import React, { useState } from 'react';
import type { WordCard } from '../types';
import { useVocabulary } from '../context/VocabularyContext';
import './StudyMode.css';

interface StudyModeProps {
  cards: WordCard[];
  onClose: () => void;
}

export default function StudyMode({ cards, onClose }: StudyModeProps) {
  const { updateWordCounts, toggleStar } = useVocabulary();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionResults, setSessionResults] = useState({ correct: 0, wrong: 0 });
  const [isFinished, setIsFinished] = useState(false);

  // Shuffle cards on entries
  const [shuffledCards] = useState(() => [...cards].sort(() => Math.random() - 0.5));

  const currentCard = shuffledCards[currentIndex];

  const handleResponse = (type: 'correct' | 'wrong') => {
    updateWordCounts(currentCard.id, type);
    setSessionResults(prev => ({ ...prev, [type]: prev[type] + 1 }));

    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="study-finished glass-panel animate-fade-in">
        <div className="finish-icon">🏆</div>
        <h2 className="heading-serif">Tebrikler! 🎉</h2>
        <p>Çalışma seansını başarıyla tamamladınız.</p>
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
        <button className="btn btn-primary" onClick={onClose}>Panole Dön</button>
      </div>
    );
  }

  return (
    <div className="study-mode-overlay animate-fade-in">
      <div className="study-mode-container">
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

        <div className={`study-main-card glass-panel ${showAnswer ? 'flipped' : ''}`} onClick={() => !showAnswer && setShowAnswer(true)}>
          <button 
            className={`study-star-btn ${currentCard.starred ? 'active' : ''}`} 
            onClick={(e) => { e.stopPropagation(); toggleStar(currentCard.id); }}
            title="Yıldızla"
          >
            <svg viewBox="0 0 24 24" fill={currentCard.starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>

          <div className="study-card-content">
            <div className="card-front-content">
              <h2 className="study-word">{currentCard.word}</h2>
              {currentCard.phonetic && <p className="study-phonetic">{currentCard.phonetic}</p>}
              <p className="study-pos-tag">{currentCard.partOfSpeech}</p>
              
              {!showAnswer && (
                <div className="study-hint">
                  <div className="hint-icon">👆</div>
                  <span>Cevabı görmek için tıkla</span>
                </div>
              )}
            </div>

            <div className="card-back-content">
              <div className="study-meaning-section">
                <span className="section-label">Anlamı</span>
                <p className="study-turkish">{currentCard.turkishMeaning}</p>
              </div>
              
              <div className="study-details">
                <div className="detail-item">
                  <span className="section-label">İngilizce Tanım</span>
                  <p>{currentCard.englishDefinition}</p>
                </div>
                <div className="detail-item">
                  <span className="section-label">Örnek Cümle</span>
                  <p className="example-text">"{currentCard.exampleSentence}"</p>
                  <p className="example-tr">{currentCard.exampleSentenceTurkish}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showAnswer && (
          <div className="study-controls animate-slide-up">
            <button className="btn study-response-btn wrong" onClick={() => handleResponse('wrong')}>
              <span className="icon">✕</span> Yanlış
            </button>
            <button className="btn study-response-btn correct" onClick={() => handleResponse('correct')}>
              <span className="icon">✓</span> Doğru
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
