// API service for fetching word data
import type { WordCard } from '../types';
import { CEFR_VOCABULARY, determineLevel } from './cefrData';

const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const TRANSLATE_API = 'https://api.mymemory.translated.net/get';

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: Array<{ text?: string; audio?: string }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
}

async function translateToTurkish(text: string): Promise<string> {
  try {
    const response = await fetch(
      `${TRANSLATE_API}?q=${encodeURIComponent(text)}&langpair=en|tr`
    );
    const data = await response.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    return 'Çeviri bulunamadı';
  } catch {
    return 'Çeviri bulunamadı';
  }
}

async function fetchWordImage(word: string): Promise<string> {
  const seed = word.toLowerCase().replace(/[^a-z]/g, '');
  return `https://picsum.photos/seed/${seed}/400/300`;
}

export async function fetchWordData(word: string): Promise<WordCard | null> {
  try {
    const cleanWord = word.trim().toLowerCase();
    const storedData = CEFR_VOCABULARY[cleanWord];
    const level = determineLevel(cleanWord);

    // Fetch dictionary data
    let dictData: DictionaryEntry[] = [];
    try {
      const dictResponse = await fetch(`${DICTIONARY_API}/${encodeURIComponent(cleanWord)}`);
      if (dictResponse.ok) {
        dictData = await dictResponse.json();
      }
    } catch (e) {
      console.warn('Dictionary API error, falling back to stored data', e);
    }

    const entry = dictData[0];
    const firstMeaning = entry?.meanings?.[0];
    const pos = storedData?.pos || firstMeaning?.partOfSpeech || 'noun';

    // Logic to select appropriate definition and example
    let englishDefinition = storedData?.definition || '';
    let exampleSentence = storedData?.example || '';

    if (!englishDefinition || !exampleSentence) {
      // Find all available definitions and examples
      const allDefs: string[] = [];
      const allExamples: string[] = [];

      if (entry) {
        for (const meaning of entry.meanings) {
          for (const d of meaning.definitions) {
            allDefs.push(d.definition);
            if (d.example) allExamples.push(d.example);
          }
        }
      }

      // If level is A1/A2, pick the SHORTEST definition and example (usually the simplest)
      // Otherwise pick the longest/most descriptive one
      if (level === 'A1' || level === 'A2') {
        if (!englishDefinition && allDefs.length > 0) {
          englishDefinition = allDefs.reduce((a, b) => a.length <= b.length ? a : b);
        }
        if (!exampleSentence && allExamples.length > 0) {
          exampleSentence = allExamples.reduce((a, b) => a.length <= b.length ? a : b);
        }
      } else {
        if (!englishDefinition && allDefs.length > 0) {
          englishDefinition = allDefs[0];
        }
        if (!exampleSentence && allExamples.length > 0) {
          exampleSentence = allExamples[0];
        }
      }
    }

    // Fallbacks
    if (!englishDefinition) englishDefinition = 'A word commonly used in English conversations.';
    if (!exampleSentence) exampleSentence = `The word "${cleanWord}" is very important to learn.`;

    // Get phonetic
    const phonetic = entry?.phonetic || 
      entry?.phonetics?.find(p => p.text)?.text || '';

    // Translate word and example sentence to Turkish
    const [translatedWord, exampleSentenceTurkish] = await Promise.all([
      storedData?.turkishMeaning ? Promise.resolve(storedData.turkishMeaning) : translateToTurkish(cleanWord),
      translateToTurkish(exampleSentence),
    ]);

    const turkishMeaning = storedData?.turkishMeaning || translatedWord;

    // Get image
    const imageUrl = await fetchWordImage(cleanWord);

    const card: WordCard = {
      id: `${cleanWord}-${Date.now()}`,
      word: cleanWord,
      phonetic,
      partOfSpeech: pos,
      level,
      englishDefinition,
      turkishMeaning,
      exampleSentence,
      exampleSentenceTurkish,
      imageUrl,
      createdAt: Date.now(),
    };

    return card;
  } catch (error) {
    console.error('Error fetching word data:', error);
    return null;
  }
}
