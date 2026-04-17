// API service for fetching word data
import type { WordCard } from '../types';

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
  // Use picsum.photos with word-based seed for consistent images
  // Each word gets a unique but reproducible image
  const seed = word.toLowerCase().replace(/[^a-z]/g, '');
  return `https://picsum.photos/seed/${seed}/400/300`;
}

export async function fetchWordData(word: string): Promise<WordCard | null> {
  try {
    const cleanWord = word.trim().toLowerCase();

    // Fetch dictionary data
    const dictResponse = await fetch(`${DICTIONARY_API}/${encodeURIComponent(cleanWord)}`);
    if (!dictResponse.ok) {
      throw new Error('Word not found');
    }

    const dictData: DictionaryEntry[] = await dictResponse.json();
    const entry = dictData[0];
    
    if (!entry || !entry.meanings || entry.meanings.length === 0) {
      throw new Error('No meaning data');
    }

    const firstMeaning = entry.meanings[0];
    const firstDef = firstMeaning.definitions[0];

    // Find an example sentence, or create one
    let exampleSentence = firstDef.example || '';
    if (!exampleSentence) {
      // Try to find example from other definitions
      for (const meaning of entry.meanings) {
        for (const def of meaning.definitions) {
          if (def.example) {
            exampleSentence = def.example;
            break;
          }
        }
        if (exampleSentence) break;
      }
    }
    if (!exampleSentence) {
      exampleSentence = `The word "${cleanWord}" is commonly used in everyday English.`;
    }

    // Get phonetic
    const phonetic = entry.phonetic || 
      entry.phonetics?.find(p => p.text)?.text || '';

    // Translate word and example sentence to Turkish
    const [turkishMeaning, exampleSentenceTurkish] = await Promise.all([
      translateToTurkish(cleanWord),
      translateToTurkish(exampleSentence),
    ]);

    // Get image
    const imageUrl = await fetchWordImage(cleanWord);

    const card: WordCard = {
      id: `${cleanWord}-${Date.now()}`,
      word: cleanWord,
      phonetic,
      partOfSpeech: firstMeaning.partOfSpeech,
      englishDefinition: firstDef.definition,
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
