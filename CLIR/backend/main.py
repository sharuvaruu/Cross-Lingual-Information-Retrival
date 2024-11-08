from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import torch
from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer
from sentence_transformers import SentenceTransformer
import numpy as np
import logging
from notebook_integration import process_notebook_results

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
try:
    translator_model = M2M100ForConditionalGeneration.from_pretrained("facebook/m2m100_418M")
    translator_tokenizer = M2M100Tokenizer.from_pretrained("facebook/m2m100_418M")
    encoder_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
    logger.info("Models loaded successfully")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    raise

class SearchQuery(BaseModel):
    query: str

class SearchResult(BaseModel):
    id: str
    title: str
    content: str
    translated_title: Optional[str]
    translated_content: Optional[str]
    relevance_score: float

# Sample documents (replace with your database)
documents = [
    {
        "id": "1",
        "title": "Introduction to Machine Learning",
        "content": "Machine learning is a subset of artificial intelligence..."
    },
    {
        "id": "2",
        "title": "Deep Learning Basics",
        "content": "Deep learning is a part of machine learning methods..."
    }
]

@app.post("/api/search", response_model=List[SearchResult])
async def search(query: SearchQuery):
    try:
        logger.info(f"Received search query: {query.query}")
        
        # Get notebook results
        notebook_results = process_notebook_results(query.query)
        
        # Encode query
        query_embedding = encoder_model.encode(query.query)
        
        results = []
        for doc in documents:
            # Encode document
            doc_text = f"{doc['title']} {doc['content']}"
            doc_embedding = encoder_model.encode(doc_text)
            
            # Calculate similarity
            similarity = np.dot(query_embedding, doc_embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(doc_embedding)
            )
            
            # Translate if similarity is above threshold
            if similarity > 0.5:
                # Translate title
                translated_title = translator_tokenizer.encode(doc["title"], 
                                                            return_tensors="pt")
                translated_title = translator_model.generate(
                    translated_title,
                    forced_bos_token_id=translator_tokenizer.get_lang_id("hi")
                )
                translated_title = translator_tokenizer.decode(translated_title[0], 
                                                            skip_special_tokens=True)
                
                # Translate content
                translated_content = translator_tokenizer.encode(doc["content"], 
                                                              return_tensors="pt")
                translated_content = translator_model.generate(
                    translated_content,
                    forced_bos_token_id=translator_tokenizer.get_lang_id("hi")
                )
                translated_content = translator_tokenizer.decode(translated_content[0], 
                                                              skip_special_tokens=True)
                
                results.append(SearchResult(
                    id=doc["id"],
                    title=doc["title"],
                    content=doc["content"],
                    translated_title=translated_title,
                    translated_content=translated_content,
                    relevance_score=float(similarity)
                ))
        
        # Combine with notebook results
        results.extend(notebook_results)
        
        # Sort by relevance
        results.sort(key=lambda x: x.relevance_score, reverse=True)
        return results[:5]  # Return top 5 results
        
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)