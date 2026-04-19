// Types for NutuVocabulary

export interface WordCard {
  id: string;
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  level?: string; // e.g., A1, A2, B1, B2, C1, C2
  englishDefinition: string;
  turkishMeaning: string;
  exampleSentence: string;
  exampleSentenceTurkish: string;
  imageUrl?: string;
  createdAt: number;
  deletedAt?: number;
  listIds?: string[]; // IDs of lists this card belongs to
}

export interface WordList {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface User {
  email: string;
  name: string;
}
