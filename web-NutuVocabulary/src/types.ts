// Types for NutuVocabulary

export interface WordCard {
  id: string;
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  englishDefinition: string;
  turkishMeaning: string;
  exampleSentence: string;
  exampleSentenceTurkish: string;
  imageUrl?: string;
  createdAt: number;
}

export interface User {
  email: string;
  name: string;
}
