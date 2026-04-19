// Comprehensive CEFR-aligned vocabulary data for NutuVocabulary
// This is a curated list of common words with level-appropriate examples and definitions.

export interface CEFRWord {
  level: string;
  example: string;
  definition: string;
  pos: string;
  turkishMeaning: string;
}

export const CEFR_VOCABULARY: Record<string, CEFRWord> = {
  'go': {
    level: 'A1',
    pos: 'verb',
    example: "I go to school every day.",
    definition: "To move or travel from one place to another.",
    turkishMeaning: 'gitmek'
  },
  'above': {
    level: 'A1',
    pos: 'prep., adv.',
    example: 'The picture is above the sofa.',
    definition: 'In a higher place than something.',
    turkishMeaning: 'üzerinde'
  },
  'book': {
    level: 'A1',
    pos: 'noun',
    example: 'I am reading a good book.',
    definition: 'A set of printed pages inside a cover.',
    turkishMeaning: 'kitap'
  },
  'water': {
    level: 'A1',
    pos: 'noun',
    example: 'Can I have some water, please?',
    definition: 'The clear liquid that falls as rain.',
    turkishMeaning: 'su'
  },
  'friend': {
    level: 'A1',
    pos: 'noun',
    example: 'She is my best friend.',
    definition: 'A person who you know well and like.',
    turkishMeaning: 'arkadaş'
  },
  'happy': {
    level: 'A1',
    pos: 'adj.',
    example: 'Today is a happy day.',
    definition: 'Feeling or showing pleasure.',
    turkishMeaning: 'mutlu'
  },
  'small': {
    level: 'A1',
    pos: 'adj.',
    example: 'The cat is very small.',
    definition: 'Not large in size or amount.',
    turkishMeaning: 'küçük'
  },
  'travel': {
    level: 'A2',
    pos: 'verb',
    example: 'We travel to London every summer.',
    definition: 'To go from one place to another.',
    turkishMeaning: 'seyahat etmek'
  },
  'start': {
    level: 'A2',
    pos: 'verb',
    example: "Let's start the meeting now.",
    definition: 'To begin to do something.',
    turkishMeaning: 'başlamak'
  },
  'experience': {
    level: 'B1',
    pos: 'noun',
    example: 'It was a very interesting experience.',
    definition: 'Knowledge that you get from doing things.',
    turkishMeaning: 'deneyim'
  },
  'environment': {
    level: 'B2',
    pos: 'noun',
    example: 'We must protect our environment.',
    definition: 'The natural world where people live.',
    turkishMeaning: 'çevre'
  },
  'consequence': {
    level: 'C1',
    pos: 'noun',
    example: 'Every action has a consequence.',
    definition: 'A result of a particular action.',
    turkishMeaning: 'sonuç'
  },
  'ambiguous': {
    level: 'C2',
    pos: 'adj.',
    example: 'His reply to my question was very ambiguous.',
    definition: 'Having more than one possible meaning.',
    turkishMeaning: 'belirsiz'
  },
  // Add more as needed...
};

export function determineLevel(word: string): string {
  const clean = word.toLowerCase().trim();
  if (CEFR_VOCABULARY[clean]) return CEFR_VOCABULARY[clean].level;
  
  // Heuristics for others
  if (clean.length <= 4) return 'A1';
  if (clean.length <= 6) return 'A2';
  if (clean.length <= 8) return 'B1';
  if (clean.length <= 10) return 'B2';
  return 'C1';
}
