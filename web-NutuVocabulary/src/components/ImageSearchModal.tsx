import React, { useState } from 'react';
import './ImageSearchModal.css';

interface ImageSearchModalProps {
  word: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function ImageSearchModal({ word, onSelect, onClose }: ImageSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState(word);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    
    // Enrich search query for better results and force variety
    let improvedQuery = searchQuery.trim().toLowerCase();
    
    // Contextual enrichment for common ambiguous words
    const enrichments: Record<string, string> = {
      'home': 'house,building',
      'go': 'travel,move',
      'eat': 'food,dining',
      'run': 'running,athlete',
      'play': 'game,sport'
    };
    
    if (enrichments[improvedQuery]) {
      improvedQuery += `,${enrichments[improvedQuery]}`;
    } else if (improvedQuery.length <= 3) {
      improvedQuery += ',object';
    }
    
    // Add generic "educational" context and vary tags by index to force different results
    const results = Array.from({ length: 6 }).map((_, i) => {
      // DIVERSIFIED STYLE TAGS: Photo, Illustration, Vector, Cartoon, Icon, Exterior
      const variationTags = ['photography', 'illustration', 'vector', 'cartoon', 'icon', 'exterior'];
      const tags = `${improvedQuery},${variationTags[i]}`.replace(/\s+/g, ',');
      return `https://loremflickr.com/500/400/${tags}?lock=${i + Date.now()}`;
    });
    
    setSearchResults(results);
    setLoading(false);
  };

  return (
    <div className="image-search-modal-overlay" onClick={onClose}>
      <div className="image-search-modal glass-panel animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <h3>Görsel Değiştir: {word}</h3>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        <form className="search-modal-form" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Görsel ara (İngilizce)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={loading}>Ara</button>
        </form>

        <div className="search-modal-results">
          {loading ? (
            <div className="modal-loader">Görseller aranıyor...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((url, i) => (
              <div key={i} className="modal-result-item" onClick={() => onSelect(url)}>
                <img src={url} alt={`Option ${i}`} />
              </div>
            ))
          ) : (
            <div className="modal-placeholder">Kelimeyi daha iyi ezberlemek için bir görsel seçin 💡</div>
          )}
        </div>
      </div>
    </div>
  );
}
