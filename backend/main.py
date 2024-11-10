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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        "content": "Machine learning is a subset of artificial intelligence that focuses on building systems that learn from data."
    },
    {
        "id": "2",
        "title": "Deep Learning Basics",
        "content": "Deep learning is a part of machine learning methods based on artificial neural networks with representation learning."
    },
    {
        "id": "3",
        "title": "Natural Language Processing",
        "content": "NLP combines linguistics and machine learning to help computers understand and generate human language."
    }
]

def translate_text(text: str, target_lang: str = "hi") -> str:
    try:
        inputs = translator_tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        translated = translator_model.generate(
            **inputs,
            forced_bos_token_id=translator_tokenizer.get_lang_id(target_lang),
            max_length=512,
            num_beams=4,
            length_penalty=0.6
        )
        return translator_tokenizer.batch_decode(translated, skip_special_tokens=True)[0]
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return ""

@app.post("/api/search")
async def search(query: SearchQuery):
    try:
        logger.info(f"Received search query: {query.query}")
        
        if not query.query.strip():
            return JSONResponse(
                status_code=400,
                content={"detail": "Search query cannot be empty"}
            )
        
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
            
            # Include all results with translations
            translated_title = translate_text(doc["title"])
            translated_content = translate_text(doc["content"])
            
            results.append({
                "id": doc["id"],
                "title": doc["title"],
                "content": doc["content"],
                "translated_title": translated_title,
                "translated_content": translated_content,
                "relevance_score": float(similarity)
            })
        
        # Sort by relevance
        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        if not results:
            logger.warning("No results found for query")
            return []
            
        return results[:5]  # Return top 5 results
        
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your search"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)