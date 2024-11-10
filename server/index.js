import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { documents } from './data/documents.js';
import { calculateTFIDF } from './utils/search.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));

// Hindi translations map
const translations = {
  "Understanding Vector Space Models": "वेक्टर स्पेस मॉडल को समझना",
  "Vector space models represent text documents as vectors in a high-dimensional space. Each dimension corresponds to a term in the vocabulary, and the value represents the term's importance in the document.": 
    "वेक्टर स्पेस मॉडल टेक्स्ट डॉक्यूमेंट्स को उच्च-आयामी स्पेस में वेक्टर्स के रूप में दर्शाते हैं। प्रत्येक आयाम शब्दावली में एक शब्द से संबंधित होता है, और मान दस्तावेज़ में शब्द के महत्व को दर्शाता है।",
  "Cross-Language Information Retrieval": "क्रॉस-लैंग्वेज इनफॉर्मेशन रिट्रीवल",
  "CLIR systems enable users to search documents in one language using queries in another language. This is achieved through techniques like translation-based retrieval and cross-lingual embeddings.":
    "CLIR सिस्टम उपयोगकर्ताओं को एक भाषा में क्वेरी का उपयोग करके दूसरी भाषा में दस्तावेज़ खोजने में सक्षम बनाते हैं। यह अनुवाद-आधारित पुनर्प्राप्ति और क्रॉस-लिंगुअल एम्बेडिंग जैसी तकनीकों के माध्यम से प्राप्त किया जाता है।",
  "Query Translation Methods": "क्वेरी अनुवाद विधियाँ",
  "Dictionary-based translation and machine translation are two primary approaches for query translation in CLIR. Machine translation often provides better context-aware translations.":
    "डिक्शनरी-आधारित अनुवाद और मशीन अनुवाद CLIR में क्वेरी अनुवाद के लिए दो प्राथमिक दृष्टिकोण हैं। मशीन अनुवाद अक्सर बेहतर संदर्भ-जागरूक अनुवाद प्रदान करता है।"
};

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.post('/api/search', (req, res) => {
  const { query } = req.body;
  
  if (!query?.trim()) {
    return res.status(400).json({ detail: "Search query cannot be empty" });
  }

  // Use TF-IDF for relevance scoring
  let results = calculateTFIDF(query, documents);

  // Add translations
  results = results.map(doc => ({
    ...doc,
    translated_title: translations[doc.title] || null,
    translated_content: translations[doc.content] || null
  }));

  // Sort by relevance score
  results.sort((a, b) => b.relevance_score - a.relevance_score);

  // Return top 5 results
  res.json(results.slice(0, 5));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});