# Cross-Language Information Retrieval (CLIR) System

A full-stack application that enables cross-language search between English and Hindi using advanced NLP/DL techniques.

## 🚀 Features

- English to Hindi cross-language search
- Real-time translation using M2M100 model
- Semantic search using sentence transformers
- Interactive Jupyter notebook integration
- Beautiful React frontend with Tailwind CSS
- FastAPI backend with ML model integration

## 🏗️ Architecture

### Frontend (React + TypeScript)
- `src/components/`
  - `SearchBar.tsx`: Search input component with real-time feedback
  - `SearchResults.tsx`: Displays search results with translations
- `src/services/`
  - `api.ts`: API integration with error handling
- `src/types/`
  - `search.ts`: TypeScript interfaces for search functionality

### Backend (FastAPI + Python)
- `backend/`
  - `main.py`: FastAPI server with ML model integration
  - `notebook_integration.py`: Jupyter notebook integration
  - `requirements.txt`: Python dependencies
  - `Dockerfile`: Container configuration
- `notebooks/`
  - `CLIR_System.ipynb`: Interactive notebook for model training and evaluation

## 🛠️ Technology Stack

### Frontend
- React 18.3
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Vite (build tool)

### Backend
- FastAPI
- PyTorch
- Transformers (Hugging Face)
- Sentence Transformers
- Jupyter Notebook
- Docker

## 🚀 Getting Started

1. Clone the repository
2. Start the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. Start the frontend:
   ```bash
   npm install
   npm run dev
   ```

## 🔍 How It Works

1. **Search Process**:
   - User enters English query
   - Query is embedded using sentence transformers
   - Similar documents are found using cosine similarity
   - Results are translated to Hindi using M2M100

2. **Notebook Integration**:
   - Jupyter notebook provides interactive model evaluation
   - Results are integrated into the search API
   - Real-time model performance monitoring

3. **Translation Pipeline**:
   - M2M100 model handles English to Hindi translation
   - Batch processing for efficiency
   - Error handling and fallback mechanisms

## 📊 Model Details

- **Translation**: facebook/m2m100_418M
  - 418M parameters
  - Supports 100+ languages
  - Optimized for English-Hindi translation

- **Embeddings**: paraphrase-multilingual-MiniLM-L12-v2
  - Multilingual sentence embeddings
  - 12-layer transformer
  - Optimized for semantic search

## 🔧 Configuration

Environment variables (`backend/.env`):
- `MODEL_PATH`: Path to stored models
- `DEVICE`: CPU/GPU selection
- `MAX_LENGTH`: Maximum sequence length
- `BATCH_SIZE`: Processing batch size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## 📝 License

MIT License - feel free to use and modify for your needs!