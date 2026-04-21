import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WordCard, WordList } from '../types';
import { fetchWordData, fetchWordImage } from '../services/api';
import { A1_SECTION_1 } from '../services/a1Data';

interface VocabularyContextType {
  cardHistory: WordCard[];
  trashCards: WordCard[];
  lists: WordList[];
  addWord: (word: string, selectedListId: string) => Promise<string | null>;
  createList: (name: string) => void;
  toggleCardList: (cardId: string, listId: string) => void;
  deleteCard: (card: WordCard) => void;
  restoreCard: (card: WordCard) => void;
  permanentlyDelete: (cardId: string) => void;
  deleteList: (listId: string) => void;
  currentCard: WordCard | null;
  setCurrentCard: (card: WordCard | null) => void;
  archiveCurrentCard: () => void;
  toggleStar: (cardId: string) => void;
  updateWordCounts: (cardId: string, type: 'correct' | 'wrong') => void;
  updateCardImage: (cardId: string, newUrl: string) => void;
  saveCard: (card: WordCard) => void;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

const LIST_COLORS = ['#A855F7', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export function VocabularyProvider({ children }: { children: React.ReactNode }) {
  const [currentCard, setCurrentCard] = useState<WordCard | null>(null);
  
  const [cardHistory, setCardHistory] = useState<WordCard[]>(() => {
    const saved = localStorage.getItem('nutu_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [trashCards, setTrashCards] = useState<WordCard[]>(() => {
    const saved = localStorage.getItem('nutu_trash');
    return saved ? JSON.parse(saved) : [];
  });

  const [lists, setLists] = useState<WordList[]>(() => {
    const saved = localStorage.getItem('nutu_lists');
    let currentLists: WordList[] = saved ? JSON.parse(saved) : [];
    
    const defaults: WordList[] = [
      { id: 'all', name: 'Tüm Kelimeler', color: '#A855F7', createdAt: 0 },
      { id: 'starred', name: 'Yıldızladığım Kelimeler', color: '#EF4444', createdAt: 1 },
      // Parent Level Lists
      { id: 'a1', name: 'A1 SEVİYESİ', color: '#EC4899', createdAt: 2 },
      { id: 'a2', name: 'a2', color: '#3B82F6', createdAt: 3 },
      { id: 'b1', name: 'b1', color: '#10B981', createdAt: 4 },
      { id: 'b2', name: 'b2', color: '#F59E0B', createdAt: 5 },
      // Sections for A1
      ...Array.from({ length: 21 }, (_, i) => ({
        id: `a1-section-${i + 1}`,
        name: `A1 - ${i + 1}. Bölüm`,
        color: '#EC4899',
        createdAt: 10 + i
      })),
    ];

    // Ensure all defaults exist
    defaults.forEach(def => {
      if (!currentLists.find(l => l.id === def.id)) {
        currentLists.push(def);
      }
    });

    return currentLists;
  });

  // Pre-populate A1 Section 1
  useEffect(() => {
    const section1Id = 'a1-section-1';
    const hasSection1Words = cardHistory.some(c => c.listIds?.includes(section1Id));
    
    if (!hasSection1Words) {
      const init = async () => {
        const newCards: WordCard[] = await Promise.all(
          Object.entries(A1_SECTION_1).map(async ([word, data], idx) => {
            const imageUrl = await fetchWordImage(word);
            return {
              id: `a1-s1-${idx}-${Date.now()}`,
              word: word,
              partOfSpeech: data.pos,
              level: 'A1',
              englishDefinition: data.definition,
              turkishMeaning: data.turkishMeaning,
              exampleSentence: data.example,
              exampleSentenceTurkish: data.exampleTurkish || '',
              imageUrl: imageUrl,
              createdAt: Date.now() - (1000 * idx),
              listIds: [section1Id]
            };
          })
        );
        setCardHistory(prev => [...newCards, ...prev]);
      };
      init();
    }
  }, []);

  // Repair missing images for A1 Section 1
  useEffect(() => {
    const missingImages = cardHistory.filter(c => c.listIds?.includes('a1-section-1') && !c.imageUrl);
    if (missingImages.length > 0) {
      const repair = async () => {
        const updatedHistory = await Promise.all(cardHistory.map(async (card) => {
          if (card.listIds?.includes('a1-section-1') && !card.imageUrl) {
            const imageUrl = await fetchWordImage(card.word);
            return { ...card, imageUrl };
          }
          return card;
        }));
        setCardHistory(updatedHistory);
      };
      repair();
    }
  }, [cardHistory.length]);

  useEffect(() => {
    localStorage.setItem('nutu_history', JSON.stringify(cardHistory));
  }, [cardHistory]);

  useEffect(() => {
    localStorage.setItem('nutu_trash', JSON.stringify(trashCards));
  }, [trashCards]);

  useEffect(() => {
    localStorage.setItem('nutu_lists', JSON.stringify(lists));
  }, [lists]);

  const addWord = async (word: string, selectedListId: string) => {
    const cardData = await fetchWordData(word);
    if (cardData) {
      if (selectedListId !== 'all') {
        cardData.listIds = [selectedListId];
      }
      if (currentCard) {
        setCardHistory(prev => [currentCard, ...prev]);
      }
      setCurrentCard(cardData);
      return null;
    }
    return `"${word}" kelimesi bulunamadı.`;
  };

  const createList = (name: string) => {
    const newList: WordList = {
      id: `list-${Date.now()}`,
      name,
      color: LIST_COLORS[lists.length % LIST_COLORS.length],
      createdAt: Date.now()
    };
    setLists(prev => [...prev, newList]);
  };

  const deleteList = (listId: string) => {
    const defaults = ['all', 'starred', 'a1', 'a2', 'b1', 'b2'];
    if (defaults.includes(listId)) return;

    setLists(prev => prev.filter(l => l.id !== listId));
    
    // Also clean up cards that were in this list
    const cleanListIds = (card: WordCard) => ({
      ...card,
      listIds: card.listIds?.filter(id => id !== listId)
    });

    setCardHistory(prev => prev.map(cleanListIds));
    if (currentCard) {
      setCurrentCard(cleanListIds(currentCard));
    }
    // Also clean up trash
    setTrashCards(prev => prev.map(cleanListIds));
  };

  const toggleCardList = (cardId: string, listId: string) => {
    const updateCard = (card: WordCard) => {
      const currentLists = card.listIds || [];
      const isSelected = currentLists.includes(listId);
      return {
        ...card,
        listIds: isSelected 
          ? currentLists.filter(id => id !== listId)
          : [...currentLists, listId]
      };
    };

    setCardHistory(prev => prev.map(c => c.id === cardId ? updateCard(c) : c));
    if (currentCard?.id === cardId) {
      setCurrentCard(updateCard(currentCard));
    }
  };

  const archiveCurrentCard = () => {
    if (currentCard) {
      setCardHistory(prev => [currentCard, ...prev]);
      setCurrentCard(null);
    }
  };

  const deleteCard = (card: WordCard) => {
    setTrashCards(prev => [{ ...card, deletedAt: Date.now() }, ...prev]);
    setCardHistory(prev => prev.filter(c => c.id !== card.id));
    if (currentCard?.id === card.id) setCurrentCard(null);
  };

  const restoreCard = (card: WordCard) => {
    const { deletedAt: _, ...restoredCard } = card;
    setCardHistory(prev => [restoredCard as WordCard, ...prev]);
    setTrashCards(prev => prev.filter(c => c.id !== card.id));
  };

  const permanentlyDelete = (cardId: string) => {
    setTrashCards(prev => prev.filter(c => c.id !== cardId));
  };

  const toggleStar = (cardId: string) => {
    const update = (card: WordCard) => {
      const isStarred = !card.starred;
      const currentLists = card.listIds || [];
      const newListIds = isStarred 
        ? (currentLists.includes('starred') ? currentLists : [...currentLists, 'starred'])
        : currentLists.filter(id => id !== 'starred');
      
      return { ...card, starred: isStarred, listIds: newListIds };
    };

    setCardHistory(prev => prev.map(c => c.id === cardId ? update(c) : c));
    if (currentCard?.id === cardId) setCurrentCard(update(currentCard));
  };

  const updateWordCounts = (cardId: string, type: 'correct' | 'wrong') => {
    const update = (card: WordCard) => ({
      ...card,
      correctCount: (card.correctCount || 0) + (type === 'correct' ? 1 : 0),
      wrongCount: (card.wrongCount || 0) + (type === 'wrong' ? 1 : 0)
    });

    setCardHistory(prev => prev.map(c => c.id === cardId ? update(c) : c));
    if (currentCard?.id === cardId) setCurrentCard(update(currentCard));
  };

  const updateCardImage = (cardId: string, newUrl: string) => {
    const update = (card: WordCard) => ({ ...card, imageUrl: newUrl });
    setCardHistory(prev => prev.map(c => c.id === cardId ? update(c) : c));
    if (currentCard?.id === cardId) setCurrentCard(update(currentCard));
  };

  const saveCard = (card: WordCard) => {
    setCardHistory(prev => [card, ...prev]);
    setCurrentCard(card);
  };

  return (
    <VocabularyContext.Provider value={{
      cardHistory, trashCards, lists, addWord, createList, deleteList,
      toggleCardList, deleteCard, restoreCard, permanentlyDelete,
      currentCard, setCurrentCard, archiveCurrentCard, toggleStar, updateWordCounts,
      updateCardImage, saveCard
    }}>
      {children}
    </VocabularyContext.Provider>
  );
}

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (!context) throw new Error('useVocabulary must be used within VocabularyProvider');
  return context;
};
