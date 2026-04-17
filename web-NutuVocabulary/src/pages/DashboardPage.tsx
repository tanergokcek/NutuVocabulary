import { useState, type FormEvent } from 'react';
import type { User, WordCard } from '../types';
import { fetchWordData } from '../services/api';
import FlipCard from '../components/FlipCard';
import './DashboardPage.css';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [wordInput, setWordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentCard, setCurrentCard] = useState<WordCard | null>(null);
  const [cardHistory, setCardHistory] = useState<WordCard[]>([]);

  const handleWordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const word = wordInput.trim();
    if (!word) {
      setError('Lütfen bir kelime girin.');
      return;
    }

    // Check if only English letters
    if (!/^[a-zA-Z\s-]+$/.test(word)) {
      setError('Lütfen sadece İngilizce kelime girin.');
      return;
    }

    setIsLoading(true);

    const cardData = await fetchWordData(word);

    if (cardData) {
      // Move current card to history
      if (currentCard) {
        setCardHistory(prev => [currentCard, ...prev]);
      }
      setCurrentCard(cardData);
      setWordInput('');
    } else {
      setError(`"${word}" kelimesi bulunamadı. Lütfen farklı bir kelime deneyin.`);
    }

    setIsLoading(false);
  };

  const handleHistoryCardClick = (card: WordCard) => {
    if (currentCard) {
      setCardHistory(prev => [currentCard, ...prev.filter(c => c.id !== card.id)]);
    }
    setCurrentCard(card);
    setCardHistory(prev => prev.filter(c => c.id !== card.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M8 7h6" />
              <path d="M8 11h8" />
            </svg>
          </div>
          <span className="navbar-title">NutuVocabulary</span>
        </div>

        <div className="navbar-user">
          <span className="navbar-greeting">
            Merhaba, <strong>{user.name}</strong>
          </span>
          <div className="navbar-avatar" title={user.name}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button className="navbar-logout" onClick={onLogout} id="logout-btn">
            Çıkış
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Word Input Section */}
        <section className="word-input-section">
          <h2 className="heading-serif">Yeni Kelime Ekle ✨</h2>
          <p className="subtitle">İngilizce bir kelime girin, kartınız otomatik oluşturulsun</p>

          <form className="word-input-form" onSubmit={handleWordSubmit}>
            <input
              id="word-input"
              type="text"
              className="input-field"
              placeholder="Bir İngilizce kelime yazın... (örn: custom)"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              disabled={isLoading}
              autoFocus
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              id="create-card-btn"
            >
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Kart Oluştur
                </>
              )}
            </button>
          </form>

          {error && <p className="word-input-error">{error}</p>}
        </section>

        {/* Cards Section */}
        <section className="cards-section">
          {isLoading && !currentCard && (
            <div className="flip-card-loading glass-panel">
              <div className="loading-dots">
                <span />
                <span />
                <span />
              </div>
              <p className="loading-text">Kelime kartınız hazırlanıyor...</p>
            </div>
          )}

          {currentCard && !isLoading && <FlipCard card={currentCard} />}

          {!currentCard && !isLoading && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <path d="M7 8h4" />
                  <path d="M7 12h8" />
                </svg>
              </div>
              <h3>Henüz kartınız yok</h3>
              <p>Yukarıdaki alana İngilizce bir kelime girerek ilk kartınızı oluşturun!</p>
            </div>
          )}
        </section>

        {/* History */}
        {cardHistory.length > 0 && (
          <section className="cards-history">
            <h3 className="cards-history-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Önceki Kartlarınız ({cardHistory.length})
            </h3>
            <div className="history-cards-grid">
              {cardHistory.map(card => (
                <div
                  key={card.id}
                  className="history-card-mini glass-panel"
                  onClick={() => handleHistoryCardClick(card)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="mini-word">{card.word}</div>
                  <div className="mini-pos">{card.partOfSpeech}</div>
                  <div className="mini-def">{card.turkishMeaning}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
