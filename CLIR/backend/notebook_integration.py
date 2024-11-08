import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
import logging
from typing import List
from .main import SearchResult

logger = logging.getLogger(__name__)

def process_notebook_results(query: str) -> List[SearchResult]:
    try:
        # Load and execute notebook
        with open('notebooks/CLIR_System.ipynb') as f:
            nb = nbformat.read(f, as_version=4)
        
        ep = ExecutePreprocessor(timeout=600, kernel_name='python3')
        ep.preprocess(nb, {'metadata': {'path': 'notebooks/'}})
        
        # Extract results from notebook
        results = []
        for cell in nb.cells:
            if cell.cell_type == 'code' and 'outputs' in cell:
                for output in cell.outputs:
                    if 'data' in output and 'text/plain' in output.data:
                        # Process output and convert to SearchResult format
                        # This is a simplified example - adjust based on your notebook output
                        result_data = output.data['text/plain']
                        if isinstance(result_data, str) and 'relevance' in result_data.lower():
                            # Parse notebook output and create SearchResult
                            results.append(SearchResult(
                                id=f"nb_{len(results)}",
                                title="Notebook Result",
                                content=result_data,
                                translated_title="नोटबुक परिणाम",
                                translated_content=result_data,  # You might want to translate this
                                relevance_score=0.8  # Adjust based on your needs
                            ))
        
        return results
    except Exception as e:
        logger.error(f"Error processing notebook: {str(e)}")
        return []