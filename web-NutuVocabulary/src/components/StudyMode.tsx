import React, { useState, useEffect, useCallback } from 'react';
import type { WordCard } from '../types';
import { useVocabulary } from '../context/VocabularyContext';
import './StudyMode.css';

interface StudyModeProps {
  cards: WordCard[];
  onClose: () => void;
}

export default function StudyMode({ cards, onClose }: StudyModeProps) {
  const { updateWordCounts, updateCardImage } = useVocabulary();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionResults, setSessionResults] = useState({ correct: 0, wrong: 0 });
  const [isFinished, setIsFinished] = useState(false);
  
  // Image search states
  const [isSearchingImage, setIsSearchingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Shuffle cards on entries
  const [shuffledCards] = useState(() => [...cards].sort(() => Math.random() - 0.5));

  const currentCard = shuffledCards[currentIndex];

  const handleResponse = useCallback((type: 'correct' | 'wrong') => {
    updateWordCounts(currentCard.id, type);
    setSessionResults(prev => ({ ...prev, [type]: prev[type] + 1 }));

    if (currentIndex < shuffledCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 300);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, currentCard, updateWordCounts, shuffledCards.length]);

  const toggleFlip = useCallback(() => {
    if (isSearchingImage) return;
    setIsFlipped(prev => !prev);
  }, [isSearchingImage]);

  const playAudio = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard?.word) return;
    const utterance = new SpeechSynthesisUtterance(currentCard.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [currentCard?.word]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || isSearchingImage) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        toggleFlip();
      } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        if (isFlipped) handleResponse('wrong');
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        if (isFlipped) handleResponse('correct');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, isFlipped, isSearchingImage, toggleFlip, handleResponse]);

  const handleSearchImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    const keywords = searchQuery.trim().split(' ');
    const results = Array.from({ length: 6 }).map((_, i) => 
      `https://images.unsplash.com/featured/?${keywords.join(',')}&sig=${i + Date.now()}`
    );
    setSearchResults(results);
    setSearchLoading(false);
  };

  const selectNewImage = (url: string) => {
    updateCardImage(currentCard.id, url);
    setIsSearchingImage(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  if (isFinished) {
    return (
      <div className="study-mode-overlay">
        <div className="study-finished glass-panel animate-fade-in">
          <div className="finish-icon">🏆</div>
          <h2 className="heading-serif">Çalışma Tamamlandı! 🎉</h2>
          <p>Bugünkü hedefine bir adım daha yaklaştın.</p>
          <div className="results-grid">
            <div className="result-box correct">
              <span className="count">{sessionResults.correct}</span>
              <span className="label">Doğru</span>
            </div>
            <div className="result-box wrong">
              <span className="count">{sessionResults.wrong}</span>
              <span className="label">Yanlış</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', marginTop: '1rem' }}>Panole Dön</button>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="study-mode-overlay animate-fade-in">
      {isSearchingImage && (
        <div className="image-search-overlay glass-panel animate-scale-up" onClick={(e) => e.stopPropagation()}>
          <div className="search-header">
            <h3>Görsel Değiştir: {currentCard.word}</h3>
            <button className="close-search" onClick={() => setIsSearchingImage(false)}>✕</button>
          </div>
          <form className="search-input-group" onSubmit={handleSearchImages}>
            <input 
              type="text" 
              placeholder="Görsel ara (İngilizce)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" disabled={searchLoading}>Ara</button>
          </form>
          <div className="search-results-grid">
            {searchLoading ? (
              <div className="search-loader">Görseller aranıyor...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((url, i) => (
                <div key={i} className="search-result-item" onClick={() => selectNewImage(url)}>
                  <img src={url} alt={`Option ${i}`} />
                </div>
              ))
            ) : (
              <div className="search-placeholder">Anahtar kelime yazıp "Ara" butonuna basın.</div>
            )}
          </div>
        </div>
      )}

      <div className="study-mode-container">
        <div className="study-status-row">
          <div className="status-item status-wrong">
            <span className="status-label">Öğrenmeye devam edilenler</span>
            <span className="status-count">{sessionResults.wrong}</span>
          </div>
          <div className="status-item status-correct">
            <span className="status-label">Bilinenler</span>
            <span className="status-count">{sessionResults.correct}</span>
          </div>
        </div>

        <div className="study-header">
          <button className="close-study" onClick={onClose} aria-label="Kapat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div className="progress-container">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / shuffledCards.length) * 100}%` }} />
            </div>
            <span className="progress-text"><strong>{currentIndex + 1}</strong> / {shuffledCards.length}</span>
          </div>
        </div>

        <div className="study-card-perspective">
          <div className={`study-flip-card ${isFlipped ? 'is-flipped' : ''}`} onClick={toggleFlip}>
            {/* FRONT FACE */}
            <div className="study-card-face study-card-front glass-panel">
              <div className="card-top-actions">
                <button className="audio-btn-study" onClick={playAudio}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 20, height: 20}}><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                </button>
              </div>

              <div className="card-center-content">
                {currentCard.level && <div className="level-badge">{currentCard.level} SEVİYESİ</div>}
                <h2 className="study-word-display">{currentCard.word} <span className="study-pos-display">({currentCard.partOfSpeech})</span></h2>
                {currentCard.phonetic && <p className="study-phonetic-display">{currentCard.phonetic}</p>}
                
                <div className="study-example-box">
                  <strong>Example:</strong> {currentCard.exampleSentence}
                </div>
              </div>

              <div className="card-bottom-instruction">
                <div className="instruction-box">
                  <span className="key-cap">Boşluk</span>
                  <span>tuşuna basın veya kartın üzerine tıklayın.</span>
                </div>
              </div>
            </div>

            {/* BACK FACE */}
            <div className="study-card-face study-card-back glass-panel">
               <div className="card-top-actions">
                <div />
                <button className="audio-btn-study" onClick={playAudio}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 20, height: 20}}><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                </button>
              </div>

              <div className="card-back-grid">
                <div className="card-back-info">
                  <div className="info-group">
                    <label>ENGLISH:</label>
                    <p>{currentCard.englishDefinition}</p>
                  </div>
                  <div className="info-group">
                    <label>TURKISH:</label>
                    <p className="turkish-word-display">{currentCard.turkishMeaning}</p>
                  </div>
                  <div className="info-group">
                    <label>TÜRKÇESİ:</label>
                    <p>{currentCard.exampleSentenceTurkish}</p>
                  </div>
                </div>
                
                <div className="card-image-container-wrapper">
                  <div className="card-image-box">
                    <img src={currentCard.imageUrl} alt={currentCard.word} onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }} />
                    <button 
                      className="edit-image-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSearchingImage(true);
                        setSearchQuery(currentCard.word);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 14, height: 14}}>
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Değiştir
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-bottom-instruction">
                <div className="keys-hint">
                  <div className="key-item">
                    <span className="key-cap-small">A</span>
                    <span>Yanlış</span>
                  </div>
                  <div className="key-item">
                    <span className="key-cap-small">D</span>
                    <span>Doğru</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="study-actions-circular">
          <button 
            className="circular-btn response-wrong" 
            onClick={(e) => { e.stopPropagation(); handleResponse('wrong'); }}
            disabled={!isFlipped}
            title="Yanlış (A)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          
          <button 
            className="circular-btn response-correct" 
            onClick={(e) => { e.stopPropagation(); handleResponse('correct'); }}
            disabled={!isFlipped}
            title="Doğru (D)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
