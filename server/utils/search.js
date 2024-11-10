// TF-IDF implementation for better search relevance
export function calculateTFIDF(query, documents) {
  const terms = query.toLowerCase().split(' ');
  const N = documents.length;
  
  // Calculate document frequencies
  const df = {};
  terms.forEach(term => {
    df[term] = documents.filter(doc => 
      (doc.title + ' ' + doc.content).toLowerCase().includes(term)
    ).length;
  });

  // Calculate TF-IDF scores
  return documents.map(doc => {
    const text = (doc.title + ' ' + doc.content).toLowerCase();
    let score = 0;
    
    terms.forEach(term => {
      if (df[term] === 0) return;
      
      // Term frequency in document
      const tf = text.split(' ').filter(word => word === term).length;
      // IDF calculation
      const idf = Math.log(N / df[term]);
      score += (tf * idf);
    });
    
    return {
      ...doc,
      relevance_score: score / terms.length // Normalize by query length
    };
  });
}