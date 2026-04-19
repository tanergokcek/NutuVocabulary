import { useState, useEffect, useCallback } from 'react';
import type { WordCard } from '../types';
import './FlipCard.css';

interface FlipCardProps {
  card: WordCard;
  onDelete?: (card: WordCard) => void;
}

export default function FlipCard({ card, onDelete }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  // Keyboard support: Space to flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        toggleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFlip]);

  // Highlight the word in the example sentence
  const highlightWord = (sentence: string, word: string) => {
    const regex = new RegExp(`(${word})`, 'gi');
    const parts = sentence.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <strong key={i}>{part}</strong> : part
    );
  };

  // Text-to-speech for the word
  const speakWord = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(card.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flip-card-wrapper">
      <div
        className={`flip-card ${isFlipped ? 'is-flipped' : ''}`}
        onClick={toggleFlip}
        role="button"
        tabIndex={0}
        aria-label={`Kelime kartı: ${card.word}. Çevirmek için tıklayın.`}
      >
        {/* ===== FRONT FACE ===== */}
        <div className="flip-card-face flip-card-front">
          <div className="flip-card-front-header">
            <div className="flip-card-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              İpucu göster
            </div>
            <button className="flip-card-speaker" onClick={speakWord} aria-label="Kelimeyi dinle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
          </div>

          <div className="flip-card-front-content">
            <div className="flip-card-level-tag">
              {card.level && <span className={`flip-card-level level-${card.level.toLowerCase()}`}>{card.level} Seviyesi</span>}
            </div>

            <div className="flip-card-main-word-area">
              <div className="flip-card-word">
                {card.word} 
                <span className="flip-card-pos-inline">({card.partOfSpeech})</span>
              </div>
              {card.phonetic && (
                <div className="flip-card-phonetic">{card.phonetic}</div>
              )}
            </div>

            <div className="flip-card-example">
              <strong>Example:</strong> {highlightWord(card.exampleSentence, card.word)}
            </div>
          </div>

          <div className="flip-card-front-footer">
            <svg className="keyboard-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
            </svg>
            Kısayol &nbsp; Çevirmek için &nbsp;<kbd>Boşluk</kbd>&nbsp; tuşuna basın veya kartın üzerine tıklayın.
          </div>
        </div>

        {/* ===== BACK FACE ===== */}
        <div className="flip-card-face flip-card-back">
          <div className="flip-card-back-header">
            <button className="flip-card-speaker" onClick={speakWord} aria-label="Kelimeyi dinle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
          </div>

          <div className="flip-card-back-content">
            <div className="flip-card-back-text">
              {/* English Definition */}
              <div className="flip-card-definition-block">
                <span className="flip-card-def-label">English:</span>
                <p className="flip-card-def-text">{card.englishDefinition}</p>
              </div>

              <hr className="flip-card-def-divider" />

              {/* Turkish Meaning */}
              <div className="flip-card-definition-block">
                <span className="flip-card-def-label">Turkish:</span>
                <p className="flip-card-def-text flip-card-turkish-meaning">{card.turkishMeaning}</p>
              </div>

              <hr className="flip-card-def-divider" />

              {/* Turkish translation of example */}
              <div className="flip-card-definition-block">
                <span className="flip-card-def-label">Türkçesi</span>
                <p className="flip-card-def-text" style={{ fontSize: '0.88rem' }}>{card.exampleSentenceTurkish}</p>
              </div>
            </div>

            {/* Image */}
            {card.imageUrl && (
              <div className="flip-card-back-image">
                <img
                  src={card.imageUrl}
                  alt={`${card.word} görseli`}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flip-card-back-footer">
            Kısayol &nbsp; Tekrar çalışmak için &nbsp;<kbd>←</kbd>&nbsp; tuşuna veya cevabı biliyorsanız &nbsp;<kbd>→</kbd>&nbsp; tuşuna basın.
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flip-card-actions">
        <button className="card-action-btn wrong" aria-label="Bilmiyorum" title="Bilmiyorum">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        
        {onDelete && (
          <button 
            className="card-action-btn delete-main" 
            aria-label="Sil" 
            title="Sil"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}

        <button className="card-action-btn correct" aria-label="Biliyorum" title="Biliyorum">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
