import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WordCard, WordList } from '../types';
import { fetchWordData } from '../services/api';

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
  currentCard: WordCard | null;
  setCurrentCard: (card: WordCard | null) => void;
  archiveCurrentCard: () => void;
  toggleStar: (cardId: string) => void;
  updateWordCounts: (cardId: string, type: 'correct' | 'wrong') => void;
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
      { id: 'a1', name: 'a1', color: '#EC4899', createdAt: 2 },
      { id: 'a2', name: 'a2', color: '#3B82F6', createdAt: 3 },
      { id: 'b1', name: 'b1', color: '#10B981', createdAt: 4 },
      { id: 'b2', name: 'b2', color: '#F59E0B', createdAt: 5 },
    ];

    // Ensure all defaults exist
    defaults.forEach(def => {
      if (!currentLists.find(l => l.id === def.id)) {
        currentLists.push(def);
      }
    });

    return currentLists;
  });

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

  return (
    <VocabularyContext.Provider value={{
      cardHistory, trashCards, lists, addWord, createList, 
      toggleCardList, deleteCard, restoreCard, permanentlyDelete,
      currentCard, setCurrentCard, archiveCurrentCard, toggleStar, updateWordCounts
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
