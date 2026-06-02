import { flashcards, type Flashcard } from './data';

/**
 * Curated level structure. Each level is an explicit list of card `english`
 * keys. Order matters within a level only insofar as practice mode and
 * quiz selection iterate it — feel free to reorder per pedagogy.
 *
 * Pedagogy: greetings → family/feelings → food/colors → animals/numbers →
 * body/routine → expanded greetings/politeness → time/weather/days →
 * verbs → bigger numbers/transport → harder colors → useful phrases.
 *
 * 11 levels. Total = 189 (matches deck size). Avg ~17 cards/level.
 */
export const LEVELS: Record<number, string[]> = {
  // L1: greetings + simple core (~14)
  1: [
    'Hello', 'Goodbye', 'Yes', 'No', 'Thank you', 'Please', 'You\'re welcome',
    'Mother / Mom', 'Father / Dad', 'Cat', 'Dog', 'Home', 'One', 'Two',
  ],

  // L2: family + feelings + small numbers (~14)
  2: [
    'Sister', 'Brother', 'Grandmother', 'Grandfather',
    'Love', 'Happy', 'Sad',
    'Big', 'Small',
    'Three', 'Four', 'Five',
    'Friend', 'I love you',
  ],

  // L3: food (basic) + colors (basic + new) (~18)
  3: [
    'Water', 'Rice', 'Milk', 'Bread', 'Apple', 'Banana',
    'Orange (fruit)', 'Strawberry', 'Grape',
    'Fruit', 'Delicious', 'Hungry',
    'Red', 'Blue', 'Yellow', 'Green',
    'Purple', 'Pink',
  ],

  // L4: animals + bigger numbers (~17)
  4: [
    'Bird', 'Fish', 'Horse', 'Cow', 'Pig', 'Rabbit', 'Mouse',
    'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Elephant', 'Lion', 'Tiger',
    'Watermelon', 'Carrot', 'Potato',
  ],

  // L5: body + routine (~16)
  5: [
    'Eyes', 'Ears', 'Nose', 'Mouth', 'Hands', 'Feet', 'Head', 'Hair',
    'Wash hands', 'Brush teeth', 'Take a bath',
    'Soap', 'Towel', 'Toothbrush',
    'School', 'Book',
  ],

  // L6: expanded greetings + politeness (~15)
  6: [
    'Good morning', 'Good night', 'Excuse me / Sorry', 'I\'m sorry',
    'How are you?', 'Nice to meet you', 'See you later',
    'My name is...', 'How old are you?',
    'Beautiful', 'Eleven', 'Twelve',
    'Teacher', 'Can I have...', 'More please',
  ],

  // L7: time + weather + days (~17)
  7: [
    'Today', 'Tomorrow', 'Yesterday', 'Morning', 'Night',
    'Sunny', 'Rainy', 'Cloudy', 'Snowy', 'Windy',
    'Week', 'Month',
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
  ],

  // L8: verbs + meals + breakfast trio (~19)
  8: [
    'Eat', 'Drink', 'Sleep', 'Run', 'Walk', 'Read', 'Write', 'Sing',
    'Play', 'Jump', 'Draw', 'Sit', 'Stand', 'Help',
    'Let\'s eat!', 'Good job!',
    'Breakfast', 'Lunch', 'Dinner',
  ],

  // L9: bigger numbers + transport + remaining days + treats (~21)
  9: [
    'Twenty', 'Thirty', 'Thirteen', 'Year',
    'One person', 'Two people', 'One thing', 'Two things',
    'Car', 'Bus', 'Train', 'Plane', 'Bike', 'Boat',
    'Saturday', 'Sunday',
    'Juice', 'Ice cream', 'Cookie', 'Cheese', 'Salt',
  ],

  // L10: harder feelings + harder colors + clothes + remaining routine (~20)
  10: [
    'Tired', 'Angry', 'Scared', 'Hot', 'Cold', 'Fast', 'Slow', 'New', 'Old',
    'White', 'Black', 'Brown', 'Orange (color)',
    'Shirt', 'Pants', 'Shoes', 'Hat',
    'Socks', 'Coat', 'Pajamas',
  ],

  // L11: places + useful phrases + remaining (~17)
  11: [
    'Happy Birthday', 'What is this?', 'Where is the bathroom?',
    'I don\'t understand',
    'Soup', 'Tea', 'Cake', 'Egg', 'Noodles',
    'Butter',
    'Park', 'Store', 'Library', 'Hospital', 'Playground',
    'Bed', 'Pillow',
  ],
};

export const MAX_LEVEL = Math.max(...Object.keys(LEVELS).map(Number));

/** English keys → Flashcard objects for the given level. */
export function getLevelCards(level: number): Flashcard[] {
  const englishKeys = LEVELS[level] ?? [];
  const byEnglish = new Map(flashcards.map(c => [c.english, c]));
  return englishKeys
    .map(k => byEnglish.get(k))
    .filter((c): c is Flashcard => c !== undefined);
}

/**
 * Quiz pool selector. Returns `quizSize` cards: mostly drawn from the
 * current level, with `reviewRatio` (default 0.2 = 20%) replaced by
 * random earlier-level cards. If the user has no prior levels (level 1
 * or no passedLevels), the pool is purely level N.
 *
 * Returned order is shuffled.
 */
export function getQuizPool(opts: {
  level: number;
  quizSize?: number;
  passedLevels: number[];
  reviewRatio?: number;
}): Flashcard[] {
  const { level, passedLevels } = opts;
  const quizSize = opts.quizSize ?? 10;
  const reviewRatio = opts.reviewRatio ?? 0.2;

  const levelCards = getLevelCards(level);
  if (passedLevels.length === 0 || levelCards.length === 0) {
    return shuffle(levelCards).slice(0, quizSize);
  }

  // Light review: 80% from current level, 20% from earlier levels.
  const reviewCount = Math.min(
    Math.floor(quizSize * reviewRatio),
    quizSize - 1, // ensure at least one card from the current level
  );
  const newCount = quizSize - reviewCount;

  const newPool = shuffle(levelCards).slice(0, newCount);

  const reviewCardKeys = passedLevels.flatMap(l => LEVELS[l] ?? []);
  const byEnglish = new Map(flashcards.map(c => [c.english, c]));
  const reviewCards = reviewCardKeys
    .map(k => byEnglish.get(k))
    .filter((c): c is Flashcard => c !== undefined);
  const reviewPool = shuffle(reviewCards).slice(0, reviewCount);

  return shuffle([...newPool, ...reviewPool]);
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
