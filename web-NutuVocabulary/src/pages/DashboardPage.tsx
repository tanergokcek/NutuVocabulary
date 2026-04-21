import { useState, useEffect, type FormEvent, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { User, WordCard } from '../types';
import FlipCard from '../components/FlipCard';
import StudyMode from '../components/StudyMode';
import ImageSearchModal from '../components/ImageSearchModal';
import { useVocabulary } from '../context/VocabularyContext';
import './DashboardPage.css';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    cardHistory, trashCards, lists, addWord, createList, deleteList,
    toggleCardList, deleteCard, restoreCard, currentCard, setCurrentCard, 
    permanentlyDelete, archiveCurrentCard, toggleStar, saveCard
  } = useVocabulary();

  const [wordInput, setWordInput] = useState('');
  const [newListName, setNewListName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedListId, setSelectedListId] = useState('all');
  const [showTrash, setShowTrash] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  const [pendingCardData, setPendingCardData] = useState<any>(null);
  const [isPickingImage, setIsPickingImage] = useState(false);

  // Sync selected list based on URL
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/login') {
      setSelectedListId('all');
    } else if (location.pathname === '/lists') {
      // Auto-archive current card to history when viewing lists to ensure it shows up in the grid
      archiveCurrentCard();
    }
  }, [location.pathname]);

  const handleWordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const word = wordInput.trim();
    if (!word || !/^[a-zA-Z\s-]+$/.test(word)) {
      setError('Lütfen geçerli bir İngilizce kelime girin.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Import fetchWordData if not available locally, or use a service
      const { fetchWordData } = await import('../services/api');
      const data = await fetchWordData(word);
      
      if (data) {
        setPendingCardData(data);
        setIsPickingImage(true);
        setWordInput('');
      } else {
        setError('Kelime bulunamadı. Lütfen kontrol edin.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeCard = async (imageUrl: string) => {
    if (!pendingCardData) return;
    
    setIsLoading(true);
    const finalizedCard: WordCard = {
      ...pendingCardData,
      id: `word-${Date.now()}`,
      imageUrl: imageUrl,
      createdAt: Date.now(),
      listIds: selectedListId !== 'all' ? [selectedListId] : []
    };

    // Add to history and set as current
    saveCard(finalizedCard);
    
    setIsPickingImage(false);
    setPendingCardData(null);
    setIsLoading(false);
    if (location.pathname !== '/') navigate('/');
  };

  const handleCreateList = (e: FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createList(newListName.trim());
    setNewListName('');
    setIsCreatingList(false);
  };

  const handleListClick = (listId: string) => {
    setSelectedListId(listId);
    navigate('/lists');
  };

  const filteredHistory = selectedListId === 'all' 
    ? cardHistory 
    : cardHistory.filter(card => card.listIds?.includes(selectedListId));

  const handleHistoryCardClick = (card: WordCard) => {
    setCurrentCard(card);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteList = (e: MouseEvent, listId: string, listName: string) => {
    e.stopPropagation();
    if (window.confirm(`"${listName}" listesini silmek istediğinize emin misiniz?`)) {
      deleteList(listId);
      if (selectedListId === listId) {
        setSelectedListId('all');
        navigate('/');
      }
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Navbar at top */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="navbar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /><path d="M8 7h6" /><path d="M8 11h8" /></svg>
          </div>
          <span className="navbar-title">NutuVocabulary</span>
        </div>

        <div className="navbar-user">
          <span className="navbar-greeting">Merhaba, <strong>{user.name}</strong></span>
          <div className="navbar-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <button className="navbar-logout" onClick={onLogout}>Çıkış</button>
        </div>
      </nav>

      <div className="dashboard-main-wrapper">
        <aside className="dashboard-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-header">
              <h3 className="sidebar-title">Listelerim</h3>
            </div>

            <div className="sidebar-lists-container">
              {/* Default Lists Section */}
              <div className="sidebar-sub-section">
                <h4 className="sidebar-sub-title">Varsayılan</h4>
                <div className="sidebar-lists">
                  {lists.filter(l => ['all', 'starred', 'a1', 'a2', 'b1', 'b2'].includes(l.id)).map(list => (
                    <button
                      key={list.id}
                      className={`sidebar-list-item ${(selectedListId === list.id || (list.id === 'a1' && selectedListId.startsWith('a1-section'))) ? 'active' : ''}`}
                      onClick={() => handleListClick(list.id)}
                    >
                      <span className="list-dot" style={{ backgroundColor: list.color }} />
                      <span className="list-name">{list.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Lists Section */}
              <div className="sidebar-sub-section">
                <div className="sidebar-sub-header">
                  <h4 className="sidebar-sub-title">Özel Listelerim</h4>
                  <button className="add-list-btn-small" onClick={() => setIsCreatingList(true)} title="Yeni Liste Oluştur">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </button>
                </div>

                {isCreatingList && (
                  <form className="create-list-form" onSubmit={handleCreateList}>
                    <input 
                      autoFocus
                      placeholder="Liste adı..."
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      onBlur={() => !newListName && setIsCreatingList(false)}
                    />
                  </form>
                )}

                <div className="sidebar-lists">
                  {lists.filter(l => !['all', 'starred', 'a1', 'a2', 'b1', 'b2'].includes(l.id) && !l.id.startsWith('a1-section')).map(list => (
                    <div key={list.id} className="sidebar-list-item-wrapper">
                      <button
                        className={`sidebar-list-item ${selectedListId === list.id ? 'active' : ''}`}
                        onClick={() => handleListClick(list.id)}
                      >
                        <span className="list-dot" style={{ backgroundColor: list.color }} />
                        <span className="list-name">{list.name}</span>
                      </button>
                      <button 
                        className="delete-list-btn" 
                        onClick={(e) => handleDeleteList(e, list.id, list.name)}
                        title="Listeyi Sil"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {lists.filter(l => !['all', 'starred', 'a1', 'a2', 'b1', 'b2'].includes(l.id) && !l.id.startsWith('a1-section')).length === 0 && !isCreatingList && (
                    <div className="sidebar-empty-info">Henüz özel listeniz yok.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trash Can in Sidebar */}
          <div className="sidebar-section sidebar-footer">
            <button 
              className={`sidebar-list-item trash-btn-sidebar ${showTrash ? 'active' : ''}`}
              onClick={() => setShowTrash(!showTrash)}
            >
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 16, height: 16}}>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span className="list-name">Çöp Kutusu</span>
              {trashCards.length > 0 && <span className="trash-count">{trashCards.length}</span>}
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          {location.pathname === '/' ? (
            <>
              <section className="word-input-section">
                <h2 className="heading-serif">Yeni Kelime Ekle ✨</h2>
                <p className="subtitle">İngilizce bir kelime girin, kartınız otomatik oluşturulsun</p>

                <form className="word-input-form" onSubmit={handleWordSubmit}>
                  <input
                    className="input-field"
                    placeholder="Bir İngilizce kelime yazın..."
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Oluşturuluyor...' : 'Kart Oluştur'}
                  </button>
                </form>
                {error && <p className="word-input-error">{error}</p>}
              </section>

              <section className="cards-section">
                {isLoading && !currentCard && (
                  <div className="flip-card-loading glass-panel">
                    <div className="loading-dots"><span /><span /><span /></div>
                    <p>Kelime kartınız hazırlanıyor...</p>
                  </div>
                )}

                {currentCard && !isLoading && (
                  <div className="main-card-container">
                    <FlipCard 
                      card={currentCard} 
                      onDelete={() => deleteCard(currentCard)} 
                    />
                    
                    <div className="card-list-assigner glass-panel">
                      <span className="assigner-title">
                        {expandedListId ? (
                          <button className="assigner-back-btn" onClick={() => setExpandedListId(null)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
                            Geri
                          </button>
                        ) : 'Listeye Ekle:'}
                      </span>
                      <div className="assigner-options">
                        {!expandedListId ? (
                          // Top level lists
                          lists.filter(l => l.id !== 'all' && !l.id.startsWith('a1-section')).map(list => {
                            const hasSubActive = list.id === 'a1' && currentCard.listIds?.some(id => id.startsWith('a1-section'));
                            return (
                              <button
                                key={list.id}
                                className={`assigner-btn ${currentCard.listIds?.includes(list.id) || hasSubActive ? 'active' : ''}`}
                                onClick={() => list.id === 'a1' ? setExpandedListId('a1') : toggleCardList(currentCard.id, list.id)}
                              >
                                <span className="list-dot" style={{ backgroundColor: list.color }} />
                                {list.name}
                                {list.id === 'a1' && <span className="expand-chevron">›</span>}
                              </button>
                            );
                          })
                        ) : (
                          // Expanded sub-lists
                          lists.filter(l => l.id.startsWith(`${expandedListId}-section`)).map(list => (
                            <button
                              key={list.id}
                              className={`assigner-btn ${currentCard.listIds?.includes(list.id) ? 'active' : ''}`}
                              onClick={() => toggleCardList(currentCard.id, list.id)}
                            >
                              <span className="list-dot" style={{ backgroundColor: list.color }} />
                              {list.name.split(' - ')[1]}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {!currentCard && !isLoading && (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /><path d="M7 8h4" /><path d="M7 12h8" /></svg>
                    </div>
                    <h3>Henüz kartınız yok</h3>
                    <p>Yeni bir kelime ekleyerek başlayın.</p>
                  </div>
                )}
              </section>
            </>
          ) : (
            <section className="dashboard-lists-view animate-fade-in">
              <header className="lists-view-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 className="heading-serif">
                  {selectedListId.startsWith('a1-section') ? (
                    <button className="back-to-sections-btn" onClick={() => setSelectedListId('a1')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
                      A1 Seviyesi
                    </button>
                  ) : (
                    selectedListId === 'all' ? 'Tüm Kartlarınız' : `"${lists.find(l => l.id === selectedListId)?.name}" Listesi`
                  )}
                </h2>
                <p className="subtitle">
                  {selectedListId === 'a1' ? 'Çalışmak istediğiniz bölümü seçin' : `${filteredHistory.length} Kelime bulundu`}
                </p>

                {selectedListId !== 'a1' && (
                  <div className="list-study-action" style={{ marginTop: '1.5rem' }}>
                    {filteredHistory.length >= 2 ? (
                      <button 
                        className="btn btn-primary study-start-btn" 
                        onClick={() => setIsStudying(true)}
                      >
                        <span className="btn-icon">📖</span>
                        Çalışmaya Başla
                      </button>
                    ) : (
                      <button 
                        className="btn btn-glass study-add-more-btn" 
                        onClick={() => navigate('/')}
                      >
                        <span className="btn-icon">➕</span>
                        {filteredHistory.length === 1 ? '1 kelime daha ekle ve çalışmaya başla' : 'Kelime ekle ve çalışmaya başla'}
                      </button>
                    )}
                  </div>
                )}
              </header>

              {selectedListId === 'a1' ? (
                <div className="level-sections-grid animate-fade-in">
                  {lists.filter(l => l.id.startsWith('a1-section')).map((list, index) => (
                    <button
                      key={list.id}
                      className="level-section-card glass-panel"
                      onClick={() => setSelectedListId(list.id)}
                    >
                      <div className="section-number">{index + 1}</div>
                      <div className="section-details">
                        <div className="section-name">{list.name.split(' - ')[1]}</div>
                        <div className="section-count">{cardHistory.filter(c => c.listIds?.includes(list.id)).length} Kelime</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="history-cards-grid">
                  {filteredHistory.map(card => (
                    <div key={card.id} className="history-card-mini glass-panel" onClick={() => handleHistoryCardClick(card)}>
                      <button className="history-card-delete" onClick={(e) => { e.stopPropagation(); deleteCard(card); }}>✕</button>
                      <button 
                        className={`history-card-star ${card.starred ? 'active' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); toggleStar(card.id); }}
                      >
                        {card.starred ? '★' : '☆'}
                      </button>
                      <div className="mini-word">{card.word}</div>
                      <div className="mini-pos">{card.partOfSpeech}</div>
                      <div className="mini-def">{card.turkishMeaning}</div>
                      <div className="mini-card-lists">
                        {card.listIds?.map(lId => {
                          const list = lists.find(l => l.id === lId);
                          return list ? <span key={lId} className="mini-list-tag" style={{ borderLeft: `3px solid ${list.color}` }}>{list.name}</span> : null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredHistory.length === 0 && (
                <div className="empty-state">
                  <p>Bu listede henüz kelime yok.</p>
                  <button className="btn btn-glass" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Kelime Ekle</button>
                </div>
              )}
            </section>
          )}

          {location.pathname === '/' && filteredHistory.length > 0 && (
            <section className="cards-history" style={{ marginTop: '4rem', width: '100%' }}>
              <div className="section-header-row">
                <h3 className="cards-history-title">Önceki Kartlarınız ({filteredHistory.length})</h3>
              </div>

              <div className="history-cards-grid">
                {filteredHistory.slice(0, 4).map(card => (
                  <div key={card.id} className="history-card-mini glass-panel" onClick={() => handleHistoryCardClick(card)}>
                    <button className="history-card-delete" onClick={(e) => { e.stopPropagation(); deleteCard(card); }}>✕</button>
                    <div className="mini-word">{card.word}</div>
                    <div className="mini-def">{card.turkishMeaning}</div>
                  </div>
                ))}
              </div>
              
              <button 
                className="btn btn-glass" 
                onClick={() => navigate('/lists')}
                style={{ marginTop: '2rem', width: '100%' }}
              >
                Tümünü Gör →
              </button>
            </section>
          )}

          {showTrash && trashCards.length > 0 && (
            <section className="trash-section glass-panel" style={{ marginTop: '3rem' }}>
              <h3 className="trash-title">Çöp Kutusu</h3>
              <div className="trash-grid">
                {trashCards.map(card => (
                  <div key={card.id} className="trash-item">
                    <div className="trash-item-info"><strong>{card.word}</strong><span>{card.turkishMeaning}</span></div>
                    <div className="trash-item-actions">
                      <button className="trash-btn restore" onClick={() => restoreCard(card)}>↺</button>
                      <button className="trash-btn delete" onClick={() => permanentlyDelete(card.id)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
      {isPickingImage && pendingCardData && (
        <ImageSearchModal 
          word={pendingCardData.word}
          onSelect={handleFinalizeCard}
          onClose={() => {
            setIsPickingImage(false);
            setPendingCardData(null);
          }}
        />
      )}

      {isStudying && (
        <StudyMode 
          cards={filteredHistory} 
          onClose={() => setIsStudying(false)} 
        />
      )}
    </div>
  );
}
