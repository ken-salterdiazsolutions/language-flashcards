export type Lang = 'japanese' | 'korean' | 'mandarin' | 'spanish' | 'french' | 'german' | 'ukrainian' | 'italian' | 'hindi';

export type BreakdownItem = { char: string; rom: string; meaning?: string };

export type Flashcard = {
  cat: string;
  english: string;
  japanese: string;
  korean: string;
  mandarin: string;
  /**
   * Latin-script translations — filled in by EXTRA_TRANSLATIONS overlay
   * at module load. Required at runtime via the merge loop below.
   */
  spanish?: string;
  french?: string;
  german?: string;
  ukrainian?: string;
  italian?: string;
  hindi?: string;
  /**
   * For Asian languages: romanization (e.g. "konnichiwa").
   * For Latin-script languages: kid-readable phonetic pronunciation
   * (e.g. "OH-lah" for Spanish "hola"). Latin-script entries filled in
   * by overlay loop at module load.
   */
  romanization: Partial<Record<Lang, string>>;
  /**
   * Character/syllable breakdown — meaningful for Asian scripts where
   * each character has a meaning. Latin-script languages omit it and
   * the breakdown panel will hide.
   */
  breakdown: Partial<Record<Lang, BreakdownItem[]>>;
  /**
   * Kanji (or mixed kanji+kana) form of the Japanese word, when one is
   * commonly written in everyday Japanese. Absent when the word is
   * normally written in kana only (e.g. greetings, 〜です/〜ます phrases).
   */
  kanji?: string;
  kanjiBreakdown?: BreakdownItem[];
  hasKanji?: boolean; // legacy; will phase out
};

export const flashcards: Flashcard[] = [
  // GREETINGS & BASICS
  { cat: "Greetings", english: "Hello", japanese: "こんにちは", korean: "안녕하세요", mandarin: "你好", romanization: { japanese: "konnichiwa", korean: "annyeonghaseyo", mandarin: "nǐ hǎo" }, breakdown: { japanese: [{ char: "こ", rom: "ko" },{ char: "ん", rom: "n" },{ char: "に", rom: "ni" },{ char: "ち", rom: "chi" },{ char: "は", rom: "wa" }], korean: [{ char: "안", rom: "an", meaning: "peace" },{ char: "녕", rom: "nyeong" },{ char: "하", rom: "ha", meaning: "do" },{ char: "세", rom: "se" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "你", rom: "nǐ", meaning: "you" },{ char: "好", rom: "hǎo", meaning: "good" }] } },
  { cat: "Greetings", english: "Thank you", japanese: "ありがとう", korean: "감사합니다", mandarin: "谢谢", romanization: { japanese: "arigatou", korean: "gamsahamnida", mandarin: "xiè xiè" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "り", rom: "ri" },{ char: "が", rom: "ga" },{ char: "と", rom: "to" },{ char: "う", rom: "u" }], korean: [{ char: "감", rom: "gam", meaning: "feeling" },{ char: "사", rom: "sa", meaning: "thanks" },{ char: "합", rom: "ham", meaning: "do" },{ char: "니", rom: "ni" },{ char: "다", rom: "da", meaning: "formal" }], mandarin: [{ char: "谢", rom: "xiè", meaning: "thank" },{ char: "谢", rom: "xiè", meaning: "thank" }] } },
  { cat: "Greetings", english: "Good morning", japanese: "おはようございます", korean: "좋은 아침이에요", mandarin: "早上好", romanization: { japanese: "ohayou gozaimasu", korean: "joeun achimieyo", mandarin: "zǎo shang hǎo" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "は", rom: "ha" },{ char: "よ", rom: "yo" },{ char: "う", rom: "u" },{ char: "ご", rom: "go", meaning: "polite" },{ char: "ざ", rom: "za" },{ char: "い", rom: "i" },{ char: "ま", rom: "ma" },{ char: "す", rom: "su" }], korean: [{ char: "좋", rom: "jo", meaning: "good" },{ char: "은", rom: "eun" },{ char: "아", rom: "a" },{ char: "침", rom: "chim", meaning: "morning" },{ char: "이", rom: "i" },{ char: "에", rom: "e" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "早", rom: "zǎo", meaning: "early" },{ char: "上", rom: "shang", meaning: "up/morning" },{ char: "好", rom: "hǎo", meaning: "good" }] } },
  { cat: "Greetings", english: "Good night", japanese: "おやすみなさい", korean: "안녕히 주무세요", mandarin: "晚安", romanization: { japanese: "oyasuminasai", korean: "annyeonghi jumuseyo", mandarin: "wǎn ān" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "や", rom: "ya" },{ char: "す", rom: "su" },{ char: "み", rom: "mi", meaning: "rest" },{ char: "な", rom: "na" },{ char: "さ", rom: "sa" },{ char: "い", rom: "i" }], korean: [{ char: "안", rom: "an", meaning: "peace" },{ char: "녕", rom: "nyeong" },{ char: "히", rom: "hi" },{ char: "주", rom: "ju", meaning: "give" },{ char: "무", rom: "mu", meaning: "sleep" },{ char: "세", rom: "se" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "晚", rom: "wǎn", meaning: "evening" },{ char: "安", rom: "ān", meaning: "peace" }] } },
  { cat: "Greetings", english: "Goodbye", japanese: "さようなら", korean: "안녕히 가세요", mandarin: "再见", romanization: { japanese: "sayounara", korean: "annyeonghi gaseyo", mandarin: "zài jiàn" }, breakdown: { japanese: [{ char: "さ", rom: "sa" },{ char: "よ", rom: "yo" },{ char: "う", rom: "u" },{ char: "な", rom: "na" },{ char: "ら", rom: "ra" }], korean: [{ char: "안", rom: "an", meaning: "peace" },{ char: "녕", rom: "nyeong" },{ char: "히", rom: "hi" },{ char: "가", rom: "ga", meaning: "go" },{ char: "세", rom: "se" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "再", rom: "zài", meaning: "again" },{ char: "见", rom: "jiàn", meaning: "see" }] } },
  { cat: "Greetings", english: "Please", japanese: "おねがいします", korean: "부탁합니다", mandarin: "请", romanization: { japanese: "onegaishimasu", korean: "butakhamnida", mandarin: "qǐng" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "ね", rom: "ne" },{ char: "が", rom: "ga" },{ char: "い", rom: "i", meaning: "wish" },{ char: "し", rom: "shi" },{ char: "ま", rom: "ma" },{ char: "す", rom: "su" }], korean: [{ char: "부", rom: "bu" },{ char: "탁", rom: "tak", meaning: "request" },{ char: "합", rom: "ham", meaning: "do" },{ char: "니", rom: "ni" },{ char: "다", rom: "da", meaning: "formal" }], mandarin: [{ char: "请", rom: "qǐng", meaning: "please/invite" }] } },
  { cat: "Greetings", english: "Excuse me / Sorry", japanese: "すみません", korean: "죄송합니다", mandarin: "对不起", romanization: { japanese: "sumimasen", korean: "joesonghamnida", mandarin: "duì bu qǐ" }, breakdown: { japanese: [{ char: "す", rom: "su" },{ char: "み", rom: "mi" },{ char: "ま", rom: "ma" },{ char: "せ", rom: "se" },{ char: "ん", rom: "n" }], korean: [{ char: "죄", rom: "joe", meaning: "sin/fault" },{ char: "송", rom: "song", meaning: "send" },{ char: "합", rom: "ham", meaning: "do" },{ char: "니", rom: "ni" },{ char: "다", rom: "da", meaning: "formal" }], mandarin: [{ char: "对", rom: "duì", meaning: "face/correct" },{ char: "不", rom: "bu", meaning: "not" },{ char: "起", rom: "qǐ", meaning: "rise" }] } },
  { cat: "Greetings", english: "Yes", japanese: "はい", korean: "네", mandarin: "是", romanization: { japanese: "hai", korean: "ne", mandarin: "shì" }, breakdown: { japanese: [{ char: "は", rom: "ha" },{ char: "い", rom: "i" }], korean: [{ char: "네", rom: "ne", meaning: "yes" }], mandarin: [{ char: "是", rom: "shì", meaning: "is/yes" }] } },
  { cat: "Greetings", english: "No", japanese: "いいえ", korean: "아니요", mandarin: "不是", romanization: { japanese: "iie", korean: "aniyo", mandarin: "bù shì" }, breakdown: { japanese: [{ char: "い", rom: "i" },{ char: "い", rom: "i" },{ char: "え", rom: "e" }], korean: [{ char: "아", rom: "a" },{ char: "니", rom: "ni" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "不", rom: "bù", meaning: "not" },{ char: "是", rom: "shì", meaning: "is" }] } },

  // FAMILY
  { cat: "Family", english: "Mother / Mom", japanese: "おかあさん", korean: "어머니", mandarin: "妈妈", romanization: { japanese: "okaasan", korean: "eomeoni", mandarin: "mā ma" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "か", rom: "ka" },{ char: "あ", rom: "a" },{ char: "さ", rom: "sa" },{ char: "ん", rom: "n" }], korean: [{ char: "어", rom: "eo" },{ char: "머", rom: "meo", meaning: "mother" },{ char: "니", rom: "ni", meaning: "formal" }], mandarin: [{ char: "妈", rom: "mā", meaning: "mom" },{ char: "妈", rom: "ma", meaning: "mom" }] } },
  { cat: "Family", english: "Father / Dad", japanese: "おとうさん", korean: "아버지", mandarin: "爸爸", romanization: { japanese: "otousan", korean: "abeoji", mandarin: "bà ba" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "と", rom: "to" },{ char: "う", rom: "u" },{ char: "さ", rom: "sa" },{ char: "ん", rom: "n" }], korean: [{ char: "아", rom: "a" },{ char: "버", rom: "beo", meaning: "father" },{ char: "지", rom: "ji", meaning: "formal" }], mandarin: [{ char: "爸", rom: "bà", meaning: "dad" },{ char: "爸", rom: "ba", meaning: "dad" }] } },
  { cat: "Family", english: "Sister", japanese: "おねえさん", korean: "언니 / 누나", mandarin: "姐姐", romanization: { japanese: "oneesan", korean: "eonni / nuna", mandarin: "jiě jie" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "ね", rom: "ne" },{ char: "え", rom: "e" },{ char: "さ", rom: "sa" },{ char: "ん", rom: "n" }], korean: [{ char: "언", rom: "eon" },{ char: "니", rom: "ni", meaning: "older sister (girl)" }], mandarin: [{ char: "姐", rom: "jiě", meaning: "older sister" },{ char: "姐", rom: "jie", meaning: "sister" }] } },
  { cat: "Family", english: "Brother", japanese: "おにいさん", korean: "형 / 오빠", mandarin: "哥哥", romanization: { japanese: "oniisan", korean: "hyeong / oppa", mandarin: "gē ge" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "に", rom: "ni" },{ char: "い", rom: "i" },{ char: "さ", rom: "sa" },{ char: "ん", rom: "n" }], korean: [{ char: "형", rom: "hyeong", meaning: "older bro (boy)" },{ char: "오", rom: "o" },{ char: "빠", rom: "ppa", meaning: "older bro (girl)" }], mandarin: [{ char: "哥", rom: "gē", meaning: "older brother" },{ char: "哥", rom: "ge", meaning: "brother" }] } },
  { cat: "Family", english: "Grandmother", japanese: "おばあさん", korean: "할머니", mandarin: "奶奶", romanization: { japanese: "obaasan", korean: "halmeoni", mandarin: "nǎi nai" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "ば", rom: "ba" },{ char: "あ", rom: "a" },{ char: "さ", rom: "sa" },{ char: "ん", rom: "n" }], korean: [{ char: "할", rom: "hal", meaning: "grand" },{ char: "머", rom: "meo", meaning: "mother" },{ char: "니", rom: "ni" }], mandarin: [{ char: "奶", rom: "nǎi", meaning: "grandma" },{ char: "奶", rom: "nai", meaning: "grandma" }] } },
  { cat: "Family", english: "Grandfather", japanese: "おじいさん", korean: "할아버지", mandarin: "爷爷", romanization: { japanese: "ojiisan", korean: "harabeoji", mandarin: "yé ye" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "じ", rom: "ji" },{ char: "い", rom: "i" },{ char: "さ", rom: "sa" },{ char: "ん", rom: "n" }], korean: [{ char: "할", rom: "hal", meaning: "grand" },{ char: "아", rom: "a" },{ char: "버", rom: "beo", meaning: "father" },{ char: "지", rom: "ji" }], mandarin: [{ char: "爷", rom: "yé", meaning: "grandpa" },{ char: "爷", rom: "ye", meaning: "grandpa" }] } },
  { cat: "Family", english: "Love", japanese: "あい", korean: "사랑", mandarin: "爱", romanization: { japanese: "ai", korean: "sarang", mandarin: "ài" }, breakdown: { japanese: [{ char: "あ", rom: "a", meaning: "(sound)" },{ char: "い", rom: "i", meaning: "(sound)" }], korean: [{ char: "사", rom: "sa" },{ char: "랑", rom: "rang" }], mandarin: [{ char: "爱", rom: "ài", meaning: "love" }] } },
  { cat: "Family", english: "I love you", japanese: "あいしてる", korean: "사랑해요", mandarin: "我爱你", romanization: { japanese: "aishiteru", korean: "saranghaeyo", mandarin: "wǒ ài nǐ" }, breakdown: { japanese: [{ char: "あ", rom: "a", meaning: "(sound)" },{ char: "い", rom: "i", meaning: "(sound)" },{ char: "し", rom: "shi", meaning: "(sound)" },{ char: "て", rom: "te", meaning: "(sound)" },{ char: "る", rom: "ru", meaning: "(sound)" }], korean: [{ char: "사", rom: "sa" },{ char: "랑", rom: "rang" },{ char: "해", rom: "hae", meaning: "do" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "我", rom: "wǒ", meaning: "I/me" },{ char: "爱", rom: "ài", meaning: "love" },{ char: "你", rom: "nǐ", meaning: "you" }] } },

  // FEELINGS & DESCRIPTIONS
  { cat: "Feelings", english: "Happy", japanese: "うれしい", korean: "행복해요", mandarin: "快乐", romanization: { japanese: "ureshii", korean: "haengbokhaeyo", mandarin: "kuài lè" }, breakdown: { japanese: [{ char: "う", rom: "u" },{ char: "れ", rom: "re" },{ char: "し", rom: "shi" },{ char: "い", rom: "i" }], korean: [{ char: "행", rom: "haeng", meaning: "fortune" },{ char: "복", rom: "bok", meaning: "blessing" },{ char: "해", rom: "hae", meaning: "do" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "快", rom: "kuài", meaning: "fast/happy" },{ char: "乐", rom: "lè", meaning: "joy" }] } },
  { cat: "Feelings", english: "Sad", japanese: "かなしい", korean: "슬퍼요", mandarin: "难过", romanization: { japanese: "kanashii", korean: "seulpeoyo", mandarin: "nán guò" }, breakdown: { japanese: [{ char: "か", rom: "ka" },{ char: "な", rom: "na" },{ char: "し", rom: "shi" },{ char: "い", rom: "i" }], korean: [{ char: "슬", rom: "seul", meaning: "sad" },{ char: "퍼", rom: "peo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "难", rom: "nán", meaning: "difficult" },{ char: "过", rom: "guò", meaning: "pass" }] } },
  { cat: "Feelings", english: "Hungry", japanese: "おなかがすいた", korean: "배고파요", mandarin: "饿了", romanization: { japanese: "onaka ga suita", korean: "baegopayo", mandarin: "è le" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "な", rom: "na" },{ char: "か", rom: "ka", meaning: "stomach" },{ char: "が", rom: "ga", meaning: "is" },{ char: "す", rom: "su" },{ char: "い", rom: "i" },{ char: "た", rom: "ta", meaning: "empty" }], korean: [{ char: "배", rom: "bae", meaning: "stomach" },{ char: "고", rom: "go" },{ char: "파", rom: "pa", meaning: "hungry" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "饿", rom: "è", meaning: "hungry" },{ char: "了", rom: "le", meaning: "completed" }] } },
  { cat: "Feelings", english: "Tired", japanese: "つかれた", korean: "피곤해요", mandarin: "累了", romanization: { japanese: "tsukareta", korean: "pigonhaeyo", mandarin: "lèi le" }, breakdown: { japanese: [{ char: "つ", rom: "tsu" },{ char: "か", rom: "ka" },{ char: "れ", rom: "re" },{ char: "た", rom: "ta", meaning: "past tense" }], korean: [{ char: "피", rom: "pi" },{ char: "곤", rom: "gon", meaning: "tired" },{ char: "해", rom: "hae", meaning: "do" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "累", rom: "lèi", meaning: "tired" },{ char: "了", rom: "le", meaning: "completed" }] } },
  { cat: "Feelings", english: "Big", japanese: "おおきい", korean: "커요", mandarin: "大", romanization: { japanese: "ookii", korean: "keoyo", mandarin: "dà" }, breakdown: { japanese: [{ char: "お", rom: "o" },{ char: "お", rom: "o" },{ char: "き", rom: "ki" },{ char: "い", rom: "i" }], korean: [{ char: "커", rom: "keo", meaning: "big" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "大", rom: "dà", meaning: "big" }] } },
  { cat: "Feelings", english: "Small", japanese: "ちいさい", korean: "작아요", mandarin: "小", romanization: { japanese: "chiisai", korean: "jagayo", mandarin: "xiǎo" }, breakdown: { japanese: [{ char: "ち", rom: "chi" },{ char: "い", rom: "i" },{ char: "さ", rom: "sa" },{ char: "い", rom: "i" }], korean: [{ char: "작", rom: "jak", meaning: "small" },{ char: "아", rom: "a" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "小", rom: "xiǎo", meaning: "small" }] } },
  { cat: "Feelings", english: "Beautiful", japanese: "きれい", korean: "아름다워요", mandarin: "漂亮", romanization: { japanese: "kirei", korean: "areumdawoyo", mandarin: "piào liang" }, breakdown: { japanese: [{ char: "き", rom: "ki" },{ char: "れ", rom: "re" },{ char: "い", rom: "i" }], korean: [{ char: "아", rom: "a" },{ char: "름", rom: "reum" },{ char: "다", rom: "da", meaning: "beautiful" },{ char: "워", rom: "wo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "漂", rom: "piào", meaning: "float/pretty" },{ char: "亮", rom: "liang", meaning: "bright" }] } },
  { cat: "Feelings", english: "Angry", japanese: "おこってる", korean: "화나요", mandarin: "生气", romanization: { japanese: "okotteru", korean: "hwanayo", mandarin: "shēng qì" }, breakdown: { japanese: [{ char: "お", rom: "o" },{ char: "こ", rom: "ko" },{ char: "っ", rom: "t" },{ char: "て", rom: "te" },{ char: "る", rom: "ru" }], korean: [{ char: "화", rom: "hwa", meaning: "anger" },{ char: "나", rom: "na" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "生", rom: "shēng", meaning: "produce" },{ char: "气", rom: "qì", meaning: "spirit/anger" }] } },
  { cat: "Feelings", english: "Scared", japanese: "こわい", korean: "무서워요", mandarin: "害怕", romanization: { japanese: "kowai", korean: "museowoyo", mandarin: "hài pà" }, breakdown: { japanese: [{ char: "こ", rom: "ko" },{ char: "わ", rom: "wa" },{ char: "い", rom: "i" }], korean: [{ char: "무", rom: "mu" },{ char: "서", rom: "seo", meaning: "scared" },{ char: "워", rom: "wo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "害", rom: "hài", meaning: "harm" },{ char: "怕", rom: "pà", meaning: "fear" }] } },
  { cat: "Feelings", english: "Hot", japanese: "あつい", korean: "더워요", mandarin: "热", romanization: { japanese: "atsui", korean: "deowoyo", mandarin: "rè" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "つ", rom: "tsu" },{ char: "い", rom: "i" }], korean: [{ char: "더", rom: "deo", meaning: "hot" },{ char: "워", rom: "wo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "热", rom: "rè", meaning: "hot" }] } },
  { cat: "Feelings", english: "Cold", japanese: "さむい", korean: "추워요", mandarin: "冷", romanization: { japanese: "samui", korean: "chuwoyo", mandarin: "lěng" }, breakdown: { japanese: [{ char: "さ", rom: "sa" },{ char: "む", rom: "mu" },{ char: "い", rom: "i" }], korean: [{ char: "추", rom: "chu", meaning: "cold" },{ char: "워", rom: "wo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "冷", rom: "lěng", meaning: "cold" }] } },
  { cat: "Feelings", english: "Fast", japanese: "はやい", korean: "빨라요", mandarin: "快", romanization: { japanese: "hayai", korean: "ppallayo", mandarin: "kuài" }, breakdown: { japanese: [{ char: "は", rom: "ha" },{ char: "や", rom: "ya" },{ char: "い", rom: "i" }], korean: [{ char: "빨", rom: "ppal", meaning: "fast" },{ char: "라", rom: "la" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "快", rom: "kuài", meaning: "fast" }] } },
  { cat: "Feelings", english: "Slow", japanese: "おそい", korean: "느려요", mandarin: "慢", romanization: { japanese: "osoi", korean: "neuryeoyo", mandarin: "màn" }, breakdown: { japanese: [{ char: "お", rom: "o" },{ char: "そ", rom: "so" },{ char: "い", rom: "i" }], korean: [{ char: "느", rom: "neu", meaning: "slow" },{ char: "려", rom: "ryeo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "慢", rom: "màn", meaning: "slow" }] } },
  { cat: "Feelings", english: "New", japanese: "あたらしい", korean: "새로워요", mandarin: "新", romanization: { japanese: "atarashii", korean: "saerowoyo", mandarin: "xīn" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "た", rom: "ta" },{ char: "ら", rom: "ra" },{ char: "し", rom: "shi" },{ char: "い", rom: "i" }], korean: [{ char: "새", rom: "sae", meaning: "new" },{ char: "로", rom: "ro" },{ char: "워", rom: "wo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "新", rom: "xīn", meaning: "new" }] } },
  { cat: "Feelings", english: "Old", japanese: "ふるい", korean: "오래됐어요", mandarin: "旧", romanization: { japanese: "furui", korean: "oraedwaesseoyo", mandarin: "jiù" }, breakdown: { japanese: [{ char: "ふ", rom: "fu" },{ char: "る", rom: "ru" },{ char: "い", rom: "i" }], korean: [{ char: "오", rom: "o" },{ char: "래", rom: "rae", meaning: "long time" },{ char: "됐", rom: "dwaess" },{ char: "어", rom: "eo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "旧", rom: "jiù", meaning: "old" }] } },

  // FOOD & DRINK
  { cat: "Food", english: "Water", japanese: "みず", korean: "물", mandarin: "水", romanization: { japanese: "mizu", korean: "mul", mandarin: "shuǐ" }, breakdown: { japanese: [{ char: "み", rom: "mi" },{ char: "ず", rom: "zu" }], korean: [{ char: "물", rom: "mul", meaning: "water" }], mandarin: [{ char: "水", rom: "shuǐ", meaning: "water" }] } },
  { cat: "Food", english: "Rice", japanese: "ごはん", korean: "밥", mandarin: "米饭", romanization: { japanese: "gohan", korean: "bap", mandarin: "mǐ fàn" }, breakdown: { japanese: [{ char: "ご", rom: "go", meaning: "polite" },{ char: "は", rom: "ha" },{ char: "ん", rom: "n", meaning: "meal/rice" }], korean: [{ char: "밥", rom: "bap", meaning: "rice/meal" }], mandarin: [{ char: "米", rom: "mǐ", meaning: "grain/rice" },{ char: "饭", rom: "fàn", meaning: "meal/rice" }] } },
  { cat: "Food", english: "Milk", japanese: "ぎゅうにゅう", korean: "우유", mandarin: "牛奶", romanization: { japanese: "gyuunyuu", korean: "uyu", mandarin: "niú nǎi" }, breakdown: { japanese: [{ char: "ぎ", rom: "gyu" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u", meaning: "cow" },{ char: "に", rom: "nyu" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u", meaning: "milk" }], korean: [{ char: "우", rom: "u", meaning: "cow" },{ char: "유", rom: "yu", meaning: "milk" }], mandarin: [{ char: "牛", rom: "niú", meaning: "cow" },{ char: "奶", rom: "nǎi", meaning: "milk" }] } },
  { cat: "Food", english: "Fruit", japanese: "くだもの", korean: "과일", mandarin: "水果", romanization: { japanese: "kudamono", korean: "gwail", mandarin: "shuǐ guǒ" }, breakdown: { japanese: [{ char: "く", rom: "ku" },{ char: "だ", rom: "da" },{ char: "も", rom: "mo" },{ char: "の", rom: "no" }], korean: [{ char: "과", rom: "gwa", meaning: "fruit" },{ char: "일", rom: "il" }], mandarin: [{ char: "水", rom: "shuǐ", meaning: "water" },{ char: "果", rom: "guǒ", meaning: "fruit" }] } },
  { cat: "Food", english: "Delicious", japanese: "おいしい", korean: "맛있어요", mandarin: "好吃", romanization: { japanese: "oishii", korean: "masisseoyo", mandarin: "hǎo chī" }, breakdown: { japanese: [{ char: "お", rom: "o" },{ char: "い", rom: "i" },{ char: "し", rom: "shi" },{ char: "い", rom: "i" }], korean: [{ char: "맛", rom: "mat", meaning: "taste" },{ char: "있", rom: "iss", meaning: "exist" },{ char: "어", rom: "eo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "好", rom: "hǎo", meaning: "good" },{ char: "吃", rom: "chī", meaning: "eat" }] } },
  { cat: "Food", english: "Bread", japanese: "パン", korean: "빵", mandarin: "面包", romanization: { japanese: "pan", korean: "ppang", mandarin: "miàn bāo" }, breakdown: { japanese: [{ char: "パ", rom: "pa" },{ char: "ン", rom: "n" }], korean: [{ char: "빵", rom: "ppang", meaning: "bread" }], mandarin: [{ char: "面", rom: "miàn", meaning: "flour" },{ char: "包", rom: "bāo", meaning: "wrap" }] } },
  { cat: "Food", english: "Egg", japanese: "たまご", korean: "달걀", mandarin: "鸡蛋", romanization: { japanese: "tamago", korean: "dalgyal", mandarin: "jī dàn" }, breakdown: { japanese: [{ char: "た", rom: "ta" },{ char: "ま", rom: "ma" },{ char: "ご", rom: "go" }], korean: [{ char: "달", rom: "dal" },{ char: "걀", rom: "gyal" }], mandarin: [{ char: "鸡", rom: "jī", meaning: "chicken" },{ char: "蛋", rom: "dàn", meaning: "egg" }] } },
  { cat: "Food", english: "Apple", japanese: "りんご", korean: "사과", mandarin: "苹果", romanization: { japanese: "ringo", korean: "sagwa", mandarin: "píng guǒ" }, breakdown: { japanese: [{ char: "り", rom: "ri" },{ char: "ん", rom: "n" },{ char: "ご", rom: "go" }], korean: [{ char: "사", rom: "sa" },{ char: "과", rom: "gwa" }], mandarin: [{ char: "苹", rom: "píng", meaning: "apple" },{ char: "果", rom: "guǒ", meaning: "fruit" }] } },
  { cat: "Food", english: "Banana", japanese: "バナナ", korean: "바나나", mandarin: "香蕉", romanization: { japanese: "banana", korean: "banana", mandarin: "xiāng jiāo" }, breakdown: { japanese: [{ char: "バ", rom: "ba" },{ char: "ナ", rom: "na" },{ char: "ナ", rom: "na" }], korean: [{ char: "바", rom: "ba" },{ char: "나", rom: "na" },{ char: "나", rom: "na" }], mandarin: [{ char: "香", rom: "xiāng", meaning: "fragrant" },{ char: "蕉", rom: "jiāo", meaning: "banana" }] } },
  { cat: "Food", english: "Noodles", japanese: "めん", korean: "국수", mandarin: "面条", romanization: { japanese: "men", korean: "guksu", mandarin: "miàn tiáo" }, breakdown: { japanese: [{ char: "め", rom: "me" },{ char: "ん", rom: "n" }], korean: [{ char: "국", rom: "guk", meaning: "soup" },{ char: "수", rom: "su" }], mandarin: [{ char: "面", rom: "miàn", meaning: "noodle" },{ char: "条", rom: "tiáo", meaning: "strip" }] } },
  { cat: "Food", english: "Soup", japanese: "スープ", korean: "국", mandarin: "汤", romanization: { japanese: "suupu", korean: "guk", mandarin: "tāng" }, breakdown: { japanese: [{ char: "ス", rom: "su" },{ char: "ー", rom: "u" },{ char: "プ", rom: "pu" }], korean: [{ char: "국", rom: "guk", meaning: "soup" }], mandarin: [{ char: "汤", rom: "tāng", meaning: "soup" }] } },
  { cat: "Food", english: "Tea", japanese: "おちゃ", korean: "차", mandarin: "茶", romanization: { japanese: "ocha", korean: "cha", mandarin: "chá" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "ち", rom: "cha" },{ char: "ゃ", rom: "" }], korean: [{ char: "차", rom: "cha", meaning: "tea" }], mandarin: [{ char: "茶", rom: "chá", meaning: "tea" }] } },
  { cat: "Food", english: "Cake", japanese: "ケーキ", korean: "케이크", mandarin: "蛋糕", romanization: { japanese: "keeki", korean: "keikeu", mandarin: "dàn gāo" }, breakdown: { japanese: [{ char: "ケ", rom: "ke" },{ char: "ー", rom: "e" },{ char: "キ", rom: "ki" }], korean: [{ char: "케", rom: "ke" },{ char: "이", rom: "i" },{ char: "크", rom: "keu" }], mandarin: [{ char: "蛋", rom: "dàn", meaning: "egg" },{ char: "糕", rom: "gāo", meaning: "cake" }] } },

  // ANIMALS
  { cat: "Animals", english: "Cat", japanese: "ねこ", korean: "고양이", mandarin: "猫", romanization: { japanese: "neko", korean: "goyangi", mandarin: "māo" }, breakdown: { japanese: [{ char: "ね", rom: "ne" },{ char: "こ", rom: "ko" }], korean: [{ char: "고", rom: "go" },{ char: "양", rom: "yang" },{ char: "이", rom: "i" }], mandarin: [{ char: "猫", rom: "māo", meaning: "cat" }] } },
  { cat: "Animals", english: "Dog", japanese: "いぬ", korean: "개", mandarin: "狗", romanization: { japanese: "inu", korean: "gae", mandarin: "gǒu" }, breakdown: { japanese: [{ char: "い", rom: "i" },{ char: "ぬ", rom: "nu" }], korean: [{ char: "개", rom: "gae", meaning: "dog" }], mandarin: [{ char: "狗", rom: "gǒu", meaning: "dog" }] } },
  { cat: "Animals", english: "Fish", japanese: "さかな", korean: "물고기", mandarin: "鱼", romanization: { japanese: "sakana", korean: "mulgogi", mandarin: "yú" }, breakdown: { japanese: [{ char: "さ", rom: "sa" },{ char: "か", rom: "ka" },{ char: "な", rom: "na" }], korean: [{ char: "물", rom: "mul", meaning: "water" },{ char: "고", rom: "go" },{ char: "기", rom: "gi", meaning: "creature" }], mandarin: [{ char: "鱼", rom: "yú", meaning: "fish" }] } },
  { cat: "Animals", english: "Bird", japanese: "とり", korean: "새", mandarin: "鸟", romanization: { japanese: "tori", korean: "sae", mandarin: "niǎo" }, breakdown: { japanese: [{ char: "と", rom: "to" },{ char: "り", rom: "ri" }], korean: [{ char: "새", rom: "sae", meaning: "bird" }], mandarin: [{ char: "鸟", rom: "niǎo", meaning: "bird" }] } },
  { cat: "Animals", english: "Horse", japanese: "うま", korean: "말", mandarin: "马", romanization: { japanese: "uma", korean: "mal", mandarin: "mǎ" }, breakdown: { japanese: [{ char: "う", rom: "u" },{ char: "ま", rom: "ma" }], korean: [{ char: "말", rom: "mal", meaning: "horse" }], mandarin: [{ char: "马", rom: "mǎ", meaning: "horse" }] } },
  { cat: "Animals", english: "Cow", japanese: "うし", korean: "소", mandarin: "牛", romanization: { japanese: "ushi", korean: "so", mandarin: "niú" }, breakdown: { japanese: [{ char: "う", rom: "u" },{ char: "し", rom: "shi" }], korean: [{ char: "소", rom: "so", meaning: "cow" }], mandarin: [{ char: "牛", rom: "niú", meaning: "cow" }] } },
  { cat: "Animals", english: "Pig", japanese: "ぶた", korean: "돼지", mandarin: "猪", romanization: { japanese: "buta", korean: "dwaeji", mandarin: "zhū" }, breakdown: { japanese: [{ char: "ぶ", rom: "bu" },{ char: "た", rom: "ta" }], korean: [{ char: "돼", rom: "dwae" },{ char: "지", rom: "ji" }], mandarin: [{ char: "猪", rom: "zhū", meaning: "pig" }] } },
  { cat: "Animals", english: "Rabbit", japanese: "うさぎ", korean: "토끼", mandarin: "兔子", romanization: { japanese: "usagi", korean: "tokki", mandarin: "tù zi" }, breakdown: { japanese: [{ char: "う", rom: "u" },{ char: "さ", rom: "sa" },{ char: "ぎ", rom: "gi" }], korean: [{ char: "토", rom: "to" },{ char: "끼", rom: "kki" }], mandarin: [{ char: "兔", rom: "tù", meaning: "rabbit" },{ char: "子", rom: "zi", meaning: "suffix" }] } },
  { cat: "Animals", english: "Mouse", japanese: "ねずみ", korean: "쥐", mandarin: "老鼠", romanization: { japanese: "nezumi", korean: "jwi", mandarin: "lǎo shǔ" }, breakdown: { japanese: [{ char: "ね", rom: "ne" },{ char: "ず", rom: "zu" },{ char: "み", rom: "mi" }], korean: [{ char: "쥐", rom: "jwi", meaning: "mouse" }], mandarin: [{ char: "老", rom: "lǎo", meaning: "old" },{ char: "鼠", rom: "shǔ", meaning: "rat/mouse" }] } },
  { cat: "Animals", english: "Elephant", japanese: "ぞう", korean: "코끼리", mandarin: "大象", romanization: { japanese: "zou", korean: "kokkiri", mandarin: "dà xiàng" }, breakdown: { japanese: [{ char: "ぞ", rom: "zo" },{ char: "う", rom: "u" }], korean: [{ char: "코", rom: "ko", meaning: "nose" },{ char: "끼", rom: "kki" },{ char: "리", rom: "ri" }], mandarin: [{ char: "大", rom: "dà", meaning: "big" },{ char: "象", rom: "xiàng", meaning: "elephant" }] } },
  { cat: "Animals", english: "Lion", japanese: "ライオン", korean: "사자", mandarin: "狮子", romanization: { japanese: "raion", korean: "saja", mandarin: "shī zi" }, breakdown: { japanese: [{ char: "ラ", rom: "ra" },{ char: "イ", rom: "i" },{ char: "オ", rom: "o" },{ char: "ン", rom: "n" }], korean: [{ char: "사", rom: "sa" },{ char: "자", rom: "ja" }], mandarin: [{ char: "狮", rom: "shī", meaning: "lion" },{ char: "子", rom: "zi", meaning: "suffix" }] } },
  { cat: "Animals", english: "Tiger", japanese: "とら", korean: "호랑이", mandarin: "老虎", romanization: { japanese: "tora", korean: "horangi", mandarin: "lǎo hǔ" }, breakdown: { japanese: [{ char: "と", rom: "to" },{ char: "ら", rom: "ra" }], korean: [{ char: "호", rom: "ho" },{ char: "랑", rom: "rang" },{ char: "이", rom: "i" }], mandarin: [{ char: "老", rom: "lǎo", meaning: "old" },{ char: "虎", rom: "hǔ", meaning: "tiger" }] } },

  // SCHOOL
  { cat: "School", english: "School", japanese: "がっこう", korean: "학교", mandarin: "学校", romanization: { japanese: "gakkou", korean: "hakgyo", mandarin: "xué xiào" }, breakdown: { japanese: [{ char: "が", rom: "ga" },{ char: "っ", rom: "t", meaning: "double" },{ char: "こ", rom: "ko" },{ char: "う", rom: "u" }], korean: [{ char: "학", rom: "hak", meaning: "learn" },{ char: "교", rom: "gyo", meaning: "school" }], mandarin: [{ char: "学", rom: "xué", meaning: "learn" },{ char: "校", rom: "xiào", meaning: "school" }] } },
  { cat: "School", english: "Book", japanese: "ほん", korean: "책", mandarin: "书", romanization: { japanese: "hon", korean: "chaek", mandarin: "shū" }, breakdown: { japanese: [{ char: "ほ", rom: "ho" },{ char: "ん", rom: "n" }], korean: [{ char: "책", rom: "chaek", meaning: "book" }], mandarin: [{ char: "书", rom: "shū", meaning: "book" }] } },
  { cat: "School", english: "Teacher", japanese: "せんせい", korean: "선생님", mandarin: "老师", romanization: { japanese: "sensei", korean: "seonsaengnim", mandarin: "lǎo shī" }, breakdown: { japanese: [{ char: "せ", rom: "se" },{ char: "ん", rom: "n" },{ char: "せ", rom: "se" },{ char: "い", rom: "i" }], korean: [{ char: "선", rom: "seon", meaning: "first/prior" },{ char: "생", rom: "saeng", meaning: "born/life" },{ char: "님", rom: "nim", meaning: "honorific" }], mandarin: [{ char: "老", rom: "lǎo", meaning: "old/respected" },{ char: "师", rom: "shī", meaning: "master/teacher" }] } },
  { cat: "School", english: "Friend", japanese: "ともだち", korean: "친구", mandarin: "朋友", romanization: { japanese: "tomodachi", korean: "chingu", mandarin: "péng yǒu" }, breakdown: { japanese: [{ char: "と", rom: "to" },{ char: "も", rom: "mo" },{ char: "だ", rom: "da" },{ char: "ち", rom: "chi" }], korean: [{ char: "친", rom: "chin", meaning: "close" },{ char: "구", rom: "gu", meaning: "companion" }], mandarin: [{ char: "朋", rom: "péng", meaning: "friend" },{ char: "友", rom: "yǒu", meaning: "friend" }] } },

  // NUMBERS
  { cat: "Numbers", english: "One", japanese: "いち", korean: "하나", mandarin: "一", romanization: { japanese: "ichi", korean: "hana", mandarin: "yī" }, breakdown: { japanese: [{ char: "い", rom: "i" },{ char: "ち", rom: "chi" }], korean: [{ char: "하", rom: "ha" },{ char: "나", rom: "na" }], mandarin: [{ char: "一", rom: "yī", meaning: "one" }] } },
  { cat: "Numbers", english: "Two", japanese: "に", korean: "둘", mandarin: "二", romanization: { japanese: "ni", korean: "dul", mandarin: "èr" }, breakdown: { japanese: [{ char: "に", rom: "ni" }], korean: [{ char: "둘", rom: "dul", meaning: "two" }], mandarin: [{ char: "二", rom: "èr", meaning: "two" }] } },
  { cat: "Numbers", english: "Three", japanese: "さん", korean: "셋", mandarin: "三", romanization: { japanese: "san", korean: "set", mandarin: "sān" }, breakdown: { japanese: [{ char: "さ", rom: "sa" },{ char: "ん", rom: "n" }], korean: [{ char: "셋", rom: "set", meaning: "three" }], mandarin: [{ char: "三", rom: "sān", meaning: "three" }] } },
  { cat: "Numbers", english: "Four", japanese: "よん", korean: "넷", mandarin: "四", romanization: { japanese: "yon", korean: "net", mandarin: "sì" }, breakdown: { japanese: [{ char: "よ", rom: "yo" },{ char: "ん", rom: "n" }], korean: [{ char: "넷", rom: "net", meaning: "four" }], mandarin: [{ char: "四", rom: "sì", meaning: "four" }] } },
  { cat: "Numbers", english: "Five", japanese: "ご", korean: "다섯", mandarin: "五", romanization: { japanese: "go", korean: "daseot", mandarin: "wǔ" }, breakdown: { japanese: [{ char: "ご", rom: "go" }], korean: [{ char: "다", rom: "da" },{ char: "섯", rom: "seot", meaning: "five" }], mandarin: [{ char: "五", rom: "wǔ", meaning: "five" }] } },
  { cat: "Numbers", english: "Six", japanese: "ろく", korean: "여섯", mandarin: "六", romanization: { japanese: "roku", korean: "yeoseot", mandarin: "liù" }, breakdown: { japanese: [{ char: "ろ", rom: "ro" },{ char: "く", rom: "ku" }], korean: [{ char: "여", rom: "yeo" },{ char: "섯", rom: "seot" }], mandarin: [{ char: "六", rom: "liù", meaning: "six" }] } },
  { cat: "Numbers", english: "Seven", japanese: "なな", korean: "일곱", mandarin: "七", romanization: { japanese: "nana", korean: "ilgop", mandarin: "qī" }, breakdown: { japanese: [{ char: "な", rom: "na" },{ char: "な", rom: "na" }], korean: [{ char: "일", rom: "il" },{ char: "곱", rom: "gop" }], mandarin: [{ char: "七", rom: "qī", meaning: "seven" }] } },
  { cat: "Numbers", english: "Eight", japanese: "はち", korean: "여덟", mandarin: "八", romanization: { japanese: "hachi", korean: "yeodeol", mandarin: "bā" }, breakdown: { japanese: [{ char: "は", rom: "ha" },{ char: "ち", rom: "chi" }], korean: [{ char: "여", rom: "yeo" },{ char: "덟", rom: "deol" }], mandarin: [{ char: "八", rom: "bā", meaning: "eight" }] } },
  { cat: "Numbers", english: "Nine", japanese: "きゅう", korean: "아홉", mandarin: "九", romanization: { japanese: "kyuu", korean: "ahop", mandarin: "jiǔ" }, breakdown: { japanese: [{ char: "き", rom: "kyu" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u" }], korean: [{ char: "아", rom: "a" },{ char: "홉", rom: "hop" }], mandarin: [{ char: "九", rom: "jiǔ", meaning: "nine" }] } },
  { cat: "Numbers", english: "Ten", japanese: "じゅう", korean: "열", mandarin: "十", romanization: { japanese: "juu", korean: "yeol", mandarin: "shí" }, breakdown: { japanese: [{ char: "じ", rom: "ju" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u" }], korean: [{ char: "열", rom: "yeol", meaning: "ten" }], mandarin: [{ char: "十", rom: "shí", meaning: "ten" }] } },
  { cat: "Numbers", english: "Eleven", japanese: "じゅういち", korean: "열하나", mandarin: "十一", romanization: { japanese: "juu ichi", korean: "yeolhana", mandarin: "shí yī" }, breakdown: { japanese: [{ char: "じ", rom: "ju" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u", meaning: "ten" },{ char: "い", rom: "i" },{ char: "ち", rom: "chi", meaning: "one" }], korean: [{ char: "열", rom: "yeol", meaning: "ten" },{ char: "하", rom: "ha" },{ char: "나", rom: "na", meaning: "one" }], mandarin: [{ char: "十", rom: "shí", meaning: "ten" },{ char: "一", rom: "yī", meaning: "one" }] } },
  { cat: "Numbers", english: "Twelve", japanese: "じゅうに", korean: "열둘", mandarin: "十二", romanization: { japanese: "juu ni", korean: "yeoldul", mandarin: "shí èr" }, breakdown: { japanese: [{ char: "じ", rom: "ju" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u", meaning: "ten" },{ char: "に", rom: "ni", meaning: "two" }], korean: [{ char: "열", rom: "yeol", meaning: "ten" },{ char: "둘", rom: "dul", meaning: "two" }], mandarin: [{ char: "十", rom: "shí", meaning: "ten" },{ char: "二", rom: "èr", meaning: "two" }] } },
  { cat: "Numbers", english: "Thirteen", japanese: "じゅうさん", korean: "열셋", mandarin: "十三", romanization: { japanese: "juu san", korean: "yeolset", mandarin: "shí sān" }, breakdown: { japanese: [{ char: "じ", rom: "ju" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u", meaning: "ten" },{ char: "さ", rom: "sa" },{ char: "ん", rom: "n", meaning: "three" }], korean: [{ char: "열", rom: "yeol", meaning: "ten" },{ char: "셋", rom: "set", meaning: "three" }], mandarin: [{ char: "十", rom: "shí", meaning: "ten" },{ char: "三", rom: "sān", meaning: "three" }] } },
  { cat: "Numbers", english: "Twenty", japanese: "にじゅう", korean: "스물", mandarin: "二十", romanization: { japanese: "ni juu", korean: "seumul", mandarin: "èr shí" }, breakdown: { japanese: [{ char: "に", rom: "ni", meaning: "two" },{ char: "じ", rom: "ju" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u", meaning: "ten" }], korean: [{ char: "스", rom: "seu" },{ char: "물", rom: "mul" }], mandarin: [{ char: "二", rom: "èr", meaning: "two" },{ char: "十", rom: "shí", meaning: "ten" }] } },
  { cat: "Numbers", english: "Thirty", japanese: "さんじゅう", korean: "서른", mandarin: "三十", romanization: { japanese: "san juu", korean: "seoreun", mandarin: "sān shí" }, breakdown: { japanese: [{ char: "さ", rom: "sa" },{ char: "ん", rom: "n", meaning: "three" },{ char: "じ", rom: "ju" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u", meaning: "ten" }], korean: [{ char: "서", rom: "seo" },{ char: "른", rom: "reun" }], mandarin: [{ char: "三", rom: "sān", meaning: "three" },{ char: "十", rom: "shí", meaning: "ten" }] } },
  { cat: "Numbers", english: "One person", japanese: "ひとり", korean: "한 명", mandarin: "一个人", romanization: { japanese: "hitori", korean: "han myeong", mandarin: "yī gè rén" }, breakdown: { japanese: [{ char: "ひ", rom: "hi" },{ char: "と", rom: "to" },{ char: "り", rom: "ri", meaning: "person" }], korean: [{ char: "한", rom: "han", meaning: "one" },{ char: "명", rom: "myeong", meaning: "person counter" }], mandarin: [{ char: "一", rom: "yī", meaning: "one" },{ char: "个", rom: "gè", meaning: "counter" },{ char: "人", rom: "rén", meaning: "person" }] } },
  { cat: "Numbers", english: "Two people", japanese: "ふたり", korean: "두 명", mandarin: "两个人", romanization: { japanese: "futari", korean: "du myeong", mandarin: "liǎng gè rén" }, breakdown: { japanese: [{ char: "ふ", rom: "fu" },{ char: "た", rom: "ta" },{ char: "り", rom: "ri", meaning: "person" }], korean: [{ char: "두", rom: "du", meaning: "two" },{ char: "명", rom: "myeong", meaning: "person counter" }], mandarin: [{ char: "两", rom: "liǎng", meaning: "two" },{ char: "个", rom: "gè", meaning: "counter" },{ char: "人", rom: "rén", meaning: "person" }] } },
  { cat: "Numbers", english: "One thing", japanese: "ひとつ", korean: "한 개", mandarin: "一个", romanization: { japanese: "hitotsu", korean: "han gae", mandarin: "yī gè" }, breakdown: { japanese: [{ char: "ひ", rom: "hi" },{ char: "と", rom: "to" },{ char: "つ", rom: "tsu", meaning: "thing counter" }], korean: [{ char: "한", rom: "han", meaning: "one" },{ char: "개", rom: "gae", meaning: "thing counter" }], mandarin: [{ char: "一", rom: "yī", meaning: "one" },{ char: "个", rom: "gè", meaning: "general counter" }] } },
  { cat: "Numbers", english: "Two things", japanese: "ふたつ", korean: "두 개", mandarin: "两个", romanization: { japanese: "futatsu", korean: "du gae", mandarin: "liǎng gè" }, breakdown: { japanese: [{ char: "ふ", rom: "fu" },{ char: "た", rom: "ta" },{ char: "つ", rom: "tsu", meaning: "thing counter" }], korean: [{ char: "두", rom: "du", meaning: "two" },{ char: "개", rom: "gae", meaning: "thing counter" }], mandarin: [{ char: "两", rom: "liǎng", meaning: "two" },{ char: "个", rom: "gè", meaning: "general counter" }] } },

  // COLORS
  { cat: "Colors", english: "Red", japanese: "あか", korean: "빨간색", mandarin: "红色", romanization: { japanese: "aka", korean: "ppalgansaek", mandarin: "hóng sè" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "か", rom: "ka" }], korean: [{ char: "빨", rom: "ppal", meaning: "red" },{ char: "간", rom: "gan" },{ char: "색", rom: "saek", meaning: "color" }], mandarin: [{ char: "红", rom: "hóng", meaning: "red" },{ char: "色", rom: "sè", meaning: "color" }] } },
  { cat: "Colors", english: "Blue", japanese: "あお", korean: "파란색", mandarin: "蓝色", romanization: { japanese: "ao", korean: "paransaek", mandarin: "lán sè" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "お", rom: "o" }], korean: [{ char: "파", rom: "pa", meaning: "blue" },{ char: "란", rom: "ran" },{ char: "색", rom: "saek", meaning: "color" }], mandarin: [{ char: "蓝", rom: "lán", meaning: "blue" },{ char: "色", rom: "sè", meaning: "color" }] } },
  { cat: "Colors", english: "Yellow", japanese: "きいろ", korean: "노란색", mandarin: "黄色", romanization: { japanese: "kiiro", korean: "noransaek", mandarin: "huáng sè" }, breakdown: { japanese: [{ char: "き", rom: "ki" },{ char: "い", rom: "i" },{ char: "ろ", rom: "ro", meaning: "color" }], korean: [{ char: "노", rom: "no", meaning: "yellow" },{ char: "란", rom: "ran" },{ char: "색", rom: "saek", meaning: "color" }], mandarin: [{ char: "黄", rom: "huáng", meaning: "yellow" },{ char: "色", rom: "sè", meaning: "color" }] } },
  { cat: "Colors", english: "Green", japanese: "みどり", korean: "초록색", mandarin: "绿色", romanization: { japanese: "midori", korean: "choroksaek", mandarin: "lǜ sè" }, breakdown: { japanese: [{ char: "み", rom: "mi" },{ char: "ど", rom: "do" },{ char: "り", rom: "ri" }], korean: [{ char: "초", rom: "cho", meaning: "grass" },{ char: "록", rom: "rok", meaning: "green" },{ char: "색", rom: "saek", meaning: "color" }], mandarin: [{ char: "绿", rom: "lǜ", meaning: "green" },{ char: "色", rom: "sè", meaning: "color" }] } },

  // EVERYDAY PHRASES
  { cat: "Phrases", english: "Happy Birthday", japanese: "おたんじょうびおめでとう", korean: "생일 축하해요", mandarin: "生日快乐", romanization: { japanese: "otanjoubi omedetou", korean: "saengil chukhahaeyo", mandarin: "shēng rì kuài lè" }, hasKanji: true, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite prefix" },{ char: "誕", rom: "tan", meaning: "birth/be born" },{ char: "生", rom: "jou", meaning: "life/birth" },{ char: "日", rom: "bi", meaning: "day/sun" },{ char: "お", rom: "o", meaning: "polite prefix" },{ char: "め", rom: "me", meaning: "(sound)" },{ char: "で", rom: "de", meaning: "(sound)" },{ char: "と", rom: "to", meaning: "(sound)" },{ char: "う", rom: "u", meaning: "(sound)" }], korean: [{ char: "생", rom: "saeng", meaning: "birth" },{ char: "일", rom: "il", meaning: "day" },{ char: "축", rom: "chuk", meaning: "celebrate" },{ char: "하", rom: "ha", meaning: "do" },{ char: "해", rom: "hae" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "生", rom: "shēng", meaning: "birth" },{ char: "日", rom: "rì", meaning: "day" },{ char: "快", rom: "kuài", meaning: "happy" },{ char: "乐", rom: "lè", meaning: "joy" }] } },
  { cat: "Phrases", english: "How are you?", japanese: "おげんきですか", korean: "잘 지내세요?", mandarin: "你好吗?", romanization: { japanese: "ogenki desu ka", korean: "jal jinaeseyo?", mandarin: "nǐ hǎo ma?" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "げ", rom: "ge" },{ char: "ん", rom: "n" },{ char: "き", rom: "ki", meaning: "spirit/health" },{ char: "で", rom: "de" },{ char: "す", rom: "su" },{ char: "か", rom: "ka", meaning: "question" }], korean: [{ char: "잘", rom: "jal", meaning: "well" },{ char: "지", rom: "ji" },{ char: "내", rom: "nae", meaning: "spend time" },{ char: "세", rom: "se" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "你", rom: "nǐ", meaning: "you" },{ char: "好", rom: "hǎo", meaning: "good" },{ char: "吗", rom: "ma", meaning: "question" }] } },
  { cat: "Phrases", english: "My name is...", japanese: "わたしは...です", korean: "제 이름은...이에요", mandarin: "我叫...", romanization: { japanese: "watashi wa...desu", korean: "je ireumeun...ieyo", mandarin: "wǒ jiào..." }, breakdown: { japanese: [{ char: "わ", rom: "wa" },{ char: "た", rom: "ta" },{ char: "し", rom: "shi", meaning: "I/me" },{ char: "は", rom: "wa", meaning: "topic" },{ char: "で", rom: "de" },{ char: "す", rom: "su", meaning: "is" }], korean: [{ char: "제", rom: "je", meaning: "my" },{ char: "이", rom: "i" },{ char: "름", rom: "reum", meaning: "name" },{ char: "은", rom: "eun", meaning: "topic" },{ char: "이", rom: "i" },{ char: "에", rom: "e" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "我", rom: "wǒ", meaning: "I/me" },{ char: "叫", rom: "jiào", meaning: "called" }] } },
  { cat: "Phrases", english: "Nice to meet you", japanese: "はじめまして", korean: "만나서 반가워요", mandarin: "很高兴认识你", romanization: { japanese: "hajimemashite", korean: "mannaseo bangawoyo", mandarin: "hěn gāoxìng rènshi nǐ" }, breakdown: { japanese: [{ char: "は", rom: "ha" },{ char: "じ", rom: "ji" },{ char: "め", rom: "me", meaning: "beginning" },{ char: "ま", rom: "ma" },{ char: "し", rom: "shi" },{ char: "て", rom: "te" }], korean: [{ char: "만", rom: "man" },{ char: "나", rom: "na", meaning: "meet" },{ char: "서", rom: "seo" },{ char: "반", rom: "ban" },{ char: "가", rom: "ga", meaning: "glad" },{ char: "워", rom: "wo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "很", rom: "hěn", meaning: "very" },{ char: "高", rom: "gāo", meaning: "high" },{ char: "兴", rom: "xìng", meaning: "happy" },{ char: "认", rom: "rèn", meaning: "recognize" },{ char: "识", rom: "shi", meaning: "know" },{ char: "你", rom: "nǐ", meaning: "you" }] } },
  { cat: "Phrases", english: "See you later", japanese: "またね", korean: "또 봐요", mandarin: "回头见", romanization: { japanese: "mata ne", korean: "tto bwayo", mandarin: "huí tóu jiàn" }, breakdown: { japanese: [{ char: "ま", rom: "ma" },{ char: "た", rom: "ta", meaning: "again" },{ char: "ね", rom: "ne", meaning: "right?" }], korean: [{ char: "또", rom: "tto", meaning: "again" },{ char: "봐", rom: "bwa", meaning: "see" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "回", rom: "huí", meaning: "return" },{ char: "头", rom: "tóu", meaning: "head" },{ char: "见", rom: "jiàn", meaning: "see" }] } },
  { cat: "Phrases", english: "Let's eat!", japanese: "いただきます", korean: "먹자!", mandarin: "吃饭吧!", romanization: { japanese: "itadakimasu", korean: "meokja!", mandarin: "chī fàn ba!" }, breakdown: { japanese: [{ char: "い", rom: "i" },{ char: "た", rom: "ta" },{ char: "だ", rom: "da" },{ char: "き", rom: "ki", meaning: "receive" },{ char: "ま", rom: "ma" },{ char: "す", rom: "su" }], korean: [{ char: "먹", rom: "meok", meaning: "eat" },{ char: "자", rom: "ja", meaning: "let's" }], mandarin: [{ char: "吃", rom: "chī", meaning: "eat" },{ char: "饭", rom: "fàn", meaning: "meal" },{ char: "吧", rom: "ba", meaning: "let's" }] } },
  { cat: "Phrases", english: "Good job!", japanese: "よくできました", korean: "잘했어요!", mandarin: "做得好!", romanization: { japanese: "yoku dekimashita", korean: "jalhaesseoyo!", mandarin: "zuò de hǎo!" }, breakdown: { japanese: [{ char: "よ", rom: "yo" },{ char: "く", rom: "ku", meaning: "well" },{ char: "で", rom: "de" },{ char: "き", rom: "ki", meaning: "able" },{ char: "ま", rom: "ma" },{ char: "し", rom: "shi" },{ char: "た", rom: "ta", meaning: "past" }], korean: [{ char: "잘", rom: "jal", meaning: "well" },{ char: "했", rom: "haess", meaning: "did" },{ char: "어", rom: "eo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "做", rom: "zuò", meaning: "do" },{ char: "得", rom: "de", meaning: "result" },{ char: "好", rom: "hǎo", meaning: "good" }] } },
  { cat: "Phrases", english: "What is this?", japanese: "これはなんですか", korean: "이것은 뭐예요?", mandarin: "这是什么?", romanization: { japanese: "kore wa nan desu ka", korean: "igeoseun mwoyeyo?", mandarin: "zhè shì shén me?" }, breakdown: { japanese: [{ char: "こ", rom: "ko" },{ char: "れ", rom: "re", meaning: "this" },{ char: "は", rom: "wa", meaning: "topic" },{ char: "な", rom: "na" },{ char: "ん", rom: "n", meaning: "what" },{ char: "で", rom: "de" },{ char: "す", rom: "su", meaning: "is" },{ char: "か", rom: "ka", meaning: "question" }], korean: [{ char: "이", rom: "i" },{ char: "것", rom: "geot", meaning: "thing" },{ char: "은", rom: "eun", meaning: "topic" },{ char: "뭐", rom: "mwo", meaning: "what" },{ char: "예", rom: "ye" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "这", rom: "zhè", meaning: "this" },{ char: "是", rom: "shì", meaning: "is" },{ char: "什", rom: "shén", meaning: "what" },{ char: "么", rom: "me", meaning: "what" }] } },
  { cat: "Phrases", english: "Where is the bathroom?", japanese: "トイレはどこですか", korean: "화장실이 어디예요?", mandarin: "洗手间在哪里?", romanization: { japanese: "toire wa doko desu ka", korean: "hwajangsiri eodiyeyo?", mandarin: "xǐ shǒu jiān zài nǎ lǐ?" }, breakdown: { japanese: [{ char: "ト", rom: "to" },{ char: "イ", rom: "i" },{ char: "レ", rom: "re", meaning: "toilet" },{ char: "は", rom: "wa", meaning: "topic" },{ char: "ど", rom: "do" },{ char: "こ", rom: "ko", meaning: "where" },{ char: "で", rom: "de" },{ char: "す", rom: "su", meaning: "is" },{ char: "か", rom: "ka", meaning: "question" }], korean: [{ char: "화", rom: "hwa", meaning: "flower" },{ char: "장", rom: "jang", meaning: "place" },{ char: "실", rom: "sil", meaning: "room" },{ char: "이", rom: "i" },{ char: "어", rom: "eo" },{ char: "디", rom: "di", meaning: "where" },{ char: "예", rom: "ye" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "洗", rom: "xǐ", meaning: "wash" },{ char: "手", rom: "shǒu", meaning: "hand" },{ char: "间", rom: "jiān", meaning: "room" },{ char: "在", rom: "zài", meaning: "at" },{ char: "哪", rom: "nǎ", meaning: "where" },{ char: "里", rom: "lǐ", meaning: "inside" }] } },
  { cat: "Phrases", english: "I don't understand", japanese: "わかりません", korean: "이해 못해요", mandarin: "我不明白", romanization: { japanese: "wakarimasen", korean: "ihae mothaeyo", mandarin: "wǒ bù míng bai" }, breakdown: { japanese: [{ char: "わ", rom: "wa" },{ char: "か", rom: "ka" },{ char: "り", rom: "ri", meaning: "understand" },{ char: "ま", rom: "ma" },{ char: "せ", rom: "se" },{ char: "ん", rom: "n", meaning: "not" }], korean: [{ char: "이", rom: "i" },{ char: "해", rom: "hae", meaning: "understand" },{ char: "못", rom: "mot", meaning: "cannot" },{ char: "해", rom: "hae", meaning: "do" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "我", rom: "wǒ", meaning: "I/me" },{ char: "不", rom: "bù", meaning: "not" },{ char: "明", rom: "míng", meaning: "bright/clear" },{ char: "白", rom: "bai", meaning: "white/understand" }] } },

  // BODY
  { cat: "Body", english: "Eyes", japanese: "め", korean: "눈", mandarin: "眼睛", romanization: { japanese: "me", korean: "nun", mandarin: "yǎn jīng" }, breakdown: { japanese: [{ char: "め", rom: "me", meaning: "eye" }], korean: [{ char: "눈", rom: "nun", meaning: "eye" }], mandarin: [{ char: "眼", rom: "yǎn", meaning: "eye" },{ char: "睛", rom: "jīng", meaning: "eyeball" }] } },
  { cat: "Body", english: "Ears", japanese: "みみ", korean: "귀", mandarin: "耳朵", romanization: { japanese: "mimi", korean: "gwi", mandarin: "ěr duo" }, breakdown: { japanese: [{ char: "み", rom: "mi" },{ char: "み", rom: "mi" }], korean: [{ char: "귀", rom: "gwi", meaning: "ear" }], mandarin: [{ char: "耳", rom: "ěr", meaning: "ear" },{ char: "朵", rom: "duo", meaning: "suffix" }] } },
  { cat: "Body", english: "Nose", japanese: "はな", korean: "코", mandarin: "鼻子", romanization: { japanese: "hana", korean: "ko", mandarin: "bí zi" }, breakdown: { japanese: [{ char: "は", rom: "ha" },{ char: "な", rom: "na" }], korean: [{ char: "코", rom: "ko", meaning: "nose" }], mandarin: [{ char: "鼻", rom: "bí", meaning: "nose" },{ char: "子", rom: "zi", meaning: "suffix" }] } },
  { cat: "Body", english: "Mouth", japanese: "くち", korean: "입", mandarin: "嘴", romanization: { japanese: "kuchi", korean: "ip", mandarin: "zuǐ" }, breakdown: { japanese: [{ char: "く", rom: "ku" },{ char: "ち", rom: "chi" }], korean: [{ char: "입", rom: "ip", meaning: "mouth" }], mandarin: [{ char: "嘴", rom: "zuǐ", meaning: "mouth" }] } },
  { cat: "Body", english: "Hands", japanese: "て", korean: "손", mandarin: "手", romanization: { japanese: "te", korean: "son", mandarin: "shǒu" }, breakdown: { japanese: [{ char: "て", rom: "te", meaning: "hand" }], korean: [{ char: "손", rom: "son", meaning: "hand" }], mandarin: [{ char: "手", rom: "shǒu", meaning: "hand" }] } },
  { cat: "Body", english: "Feet", japanese: "あし", korean: "발", mandarin: "脚", romanization: { japanese: "ashi", korean: "bal", mandarin: "jiǎo" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "し", rom: "shi" }], korean: [{ char: "발", rom: "bal", meaning: "foot" }], mandarin: [{ char: "脚", rom: "jiǎo", meaning: "foot" }] } },
  { cat: "Body", english: "Head", japanese: "あたま", korean: "머리", mandarin: "头", romanization: { japanese: "atama", korean: "meori", mandarin: "tóu" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "た", rom: "ta" },{ char: "ま", rom: "ma" }], korean: [{ char: "머", rom: "meo" },{ char: "리", rom: "ri" }], mandarin: [{ char: "头", rom: "tóu", meaning: "head" }] } },
  { cat: "Body", english: "Hair", japanese: "かみ", korean: "머리카락", mandarin: "头发", romanization: { japanese: "kami", korean: "meorikarak", mandarin: "tóu fà" }, breakdown: { japanese: [{ char: "か", rom: "ka" },{ char: "み", rom: "mi" }], korean: [{ char: "머", rom: "meo" },{ char: "리", rom: "ri" },{ char: "카", rom: "ka" },{ char: "락", rom: "rak" }], mandarin: [{ char: "头", rom: "tóu", meaning: "head" },{ char: "发", rom: "fà", meaning: "hair" }] } },

  // TIME
  { cat: "Time", english: "Today", japanese: "きょう", korean: "오늘", mandarin: "今天", romanization: { japanese: "kyou", korean: "oneul", mandarin: "jīn tiān" }, breakdown: { japanese: [{ char: "き", rom: "kyo" },{ char: "ょ", rom: "" },{ char: "う", rom: "u" }], korean: [{ char: "오", rom: "o" },{ char: "늘", rom: "neul" }], mandarin: [{ char: "今", rom: "jīn", meaning: "now" },{ char: "天", rom: "tiān", meaning: "day" }] } },
  { cat: "Time", english: "Tomorrow", japanese: "あした", korean: "내일", mandarin: "明天", romanization: { japanese: "ashita", korean: "naeil", mandarin: "míng tiān" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "し", rom: "shi" },{ char: "た", rom: "ta" }], korean: [{ char: "내", rom: "nae" },{ char: "일", rom: "il", meaning: "day" }], mandarin: [{ char: "明", rom: "míng", meaning: "next" },{ char: "天", rom: "tiān", meaning: "day" }] } },
  { cat: "Time", english: "Yesterday", japanese: "きのう", korean: "어제", mandarin: "昨天", romanization: { japanese: "kinou", korean: "eoje", mandarin: "zuó tiān" }, breakdown: { japanese: [{ char: "き", rom: "ki" },{ char: "の", rom: "no" },{ char: "う", rom: "u" }], korean: [{ char: "어", rom: "eo" },{ char: "제", rom: "je" }], mandarin: [{ char: "昨", rom: "zuó", meaning: "yesterday" },{ char: "天", rom: "tiān", meaning: "day" }] } },
  { cat: "Time", english: "Morning", japanese: "あさ", korean: "아침", mandarin: "早上", romanization: { japanese: "asa", korean: "achim", mandarin: "zǎo shang" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "さ", rom: "sa" }], korean: [{ char: "아", rom: "a" },{ char: "침", rom: "chim", meaning: "morning" }], mandarin: [{ char: "早", rom: "zǎo", meaning: "early" },{ char: "上", rom: "shang", meaning: "up" }] } },
  { cat: "Time", english: "Night", japanese: "よる", korean: "밤", mandarin: "晚上", romanization: { japanese: "yoru", korean: "bam", mandarin: "wǎn shang" }, breakdown: { japanese: [{ char: "よ", rom: "yo" },{ char: "る", rom: "ru" }], korean: [{ char: "밤", rom: "bam", meaning: "night" }], mandarin: [{ char: "晚", rom: "wǎn", meaning: "evening" },{ char: "上", rom: "shang", meaning: "up" }] } },
  { cat: "Time", english: "Week", japanese: "しゅう", korean: "주", mandarin: "星期", romanization: { japanese: "shuu", korean: "ju", mandarin: "xīng qī" }, breakdown: { japanese: [{ char: "し", rom: "shu" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u" }], korean: [{ char: "주", rom: "ju", meaning: "week" }], mandarin: [{ char: "星", rom: "xīng", meaning: "star" },{ char: "期", rom: "qī", meaning: "period" }] } },
  { cat: "Time", english: "Month", japanese: "つき", korean: "달", mandarin: "月", romanization: { japanese: "tsuki", korean: "dal", mandarin: "yuè" }, breakdown: { japanese: [{ char: "つ", rom: "tsu" },{ char: "き", rom: "ki" }], korean: [{ char: "달", rom: "dal", meaning: "month/moon" }], mandarin: [{ char: "月", rom: "yuè", meaning: "month/moon" }] } },
  { cat: "Time", english: "Year", japanese: "とし", korean: "년", mandarin: "年", romanization: { japanese: "toshi", korean: "nyeon", mandarin: "nián" }, breakdown: { japanese: [{ char: "と", rom: "to" },{ char: "し", rom: "shi" }], korean: [{ char: "년", rom: "nyeon", meaning: "year" }], mandarin: [{ char: "年", rom: "nián", meaning: "year" }] } },

  // ACTIONS
  { cat: "Actions", english: "Eat", japanese: "たべる", korean: "먹다", mandarin: "吃", romanization: { japanese: "taberu", korean: "meokda", mandarin: "chī" }, breakdown: { japanese: [{ char: "た", rom: "ta" },{ char: "べ", rom: "be" },{ char: "る", rom: "ru", meaning: "verb ending" }], korean: [{ char: "먹", rom: "meok", meaning: "eat" },{ char: "다", rom: "da", meaning: "verb ending" }], mandarin: [{ char: "吃", rom: "chī", meaning: "eat" }] } },
  { cat: "Actions", english: "Drink", japanese: "のむ", korean: "마시다", mandarin: "喝", romanization: { japanese: "nomu", korean: "masida", mandarin: "hē" }, breakdown: { japanese: [{ char: "の", rom: "no" },{ char: "む", rom: "mu", meaning: "drink" }], korean: [{ char: "마", rom: "ma" },{ char: "시", rom: "si", meaning: "drink" },{ char: "다", rom: "da", meaning: "verb ending" }], mandarin: [{ char: "喝", rom: "hē", meaning: "drink" }] } },
  { cat: "Actions", english: "Sleep", japanese: "ねる", korean: "자다", mandarin: "睡觉", romanization: { japanese: "neru", korean: "jada", mandarin: "shuì jiào" }, breakdown: { japanese: [{ char: "ね", rom: "ne", meaning: "sleep" },{ char: "る", rom: "ru", meaning: "verb ending" }], korean: [{ char: "자", rom: "ja", meaning: "sleep" },{ char: "다", rom: "da", meaning: "verb ending" }], mandarin: [{ char: "睡", rom: "shuì", meaning: "sleep" },{ char: "觉", rom: "jiào", meaning: "sense" }] } },
  { cat: "Actions", english: "Run", japanese: "はしる", korean: "달리다", mandarin: "跑", romanization: { japanese: "hashiru", korean: "dallida", mandarin: "pǎo" }, breakdown: { japanese: [{ char: "は", rom: "ha" },{ char: "し", rom: "shi" },{ char: "る", rom: "ru", meaning: "verb ending" }], korean: [{ char: "달", rom: "dal", meaning: "run" },{ char: "리", rom: "li" },{ char: "다", rom: "da", meaning: "verb ending" }], mandarin: [{ char: "跑", rom: "pǎo", meaning: "run" }] } },
  { cat: "Actions", english: "Walk", japanese: "あるく", korean: "걷다", mandarin: "走", romanization: { japanese: "aruku", korean: "geotda", mandarin: "zǒu" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "る", rom: "ru" },{ char: "く", rom: "ku" }], korean: [{ char: "걷", rom: "geot", meaning: "walk" },{ char: "다", rom: "da", meaning: "verb ending" }], mandarin: [{ char: "走", rom: "zǒu", meaning: "walk" }] } },
  { cat: "Actions", english: "Read", japanese: "よむ", korean: "읽다", mandarin: "读", romanization: { japanese: "yomu", korean: "ikda", mandarin: "dú" }, breakdown: { japanese: [{ char: "よ", rom: "yo", meaning: "read" },{ char: "む", rom: "mu", meaning: "verb ending" }], korean: [{ char: "읽", rom: "ik", meaning: "read" },{ char: "다", rom: "da", meaning: "verb ending" }], mandarin: [{ char: "读", rom: "dú", meaning: "read" }] } },
  { cat: "Actions", english: "Write", japanese: "かく", korean: "쓰다", mandarin: "写", romanization: { japanese: "kaku", korean: "sseuda", mandarin: "xiě" }, breakdown: { japanese: [{ char: "か", rom: "ka", meaning: "write" },{ char: "く", rom: "ku" }], korean: [{ char: "쓰", rom: "sseu", meaning: "write" },{ char: "다", rom: "da", meaning: "verb ending" }], mandarin: [{ char: "写", rom: "xiě", meaning: "write" }] } },
  { cat: "Actions", english: "Sing", japanese: "うたう", korean: "노래하다", mandarin: "唱歌", romanization: { japanese: "utau", korean: "noraehada", mandarin: "chàng gē" }, breakdown: { japanese: [{ char: "う", rom: "u" },{ char: "た", rom: "ta", meaning: "song" },{ char: "う", rom: "u" }], korean: [{ char: "노", rom: "no" },{ char: "래", rom: "rae", meaning: "song" },{ char: "하", rom: "ha", meaning: "do" },{ char: "다", rom: "da", meaning: "verb ending" }], mandarin: [{ char: "唱", rom: "chàng", meaning: "sing" },{ char: "歌", rom: "gē", meaning: "song" }] } },

  // WEATHER
  { cat: "Weather", english: "Sunny", japanese: "はれ", korean: "맑아요", mandarin: "晴天", romanization: { japanese: "hare", korean: "malgayo", mandarin: "qíng tiān" }, breakdown: { japanese: [{ char: "は", rom: "ha" },{ char: "れ", rom: "re" }], korean: [{ char: "맑", rom: "malg", meaning: "clear" },{ char: "아", rom: "a" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "晴", rom: "qíng", meaning: "clear" },{ char: "天", rom: "tiān", meaning: "sky" }] } },
  { cat: "Weather", english: "Rainy", japanese: "あめ", korean: "비", mandarin: "下雨", romanization: { japanese: "ame", korean: "bi", mandarin: "xià yǔ" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "め", rom: "me" }], korean: [{ char: "비", rom: "bi", meaning: "rain" }], mandarin: [{ char: "下", rom: "xià", meaning: "fall" },{ char: "雨", rom: "yǔ", meaning: "rain" }] } },
  { cat: "Weather", english: "Cloudy", japanese: "くもり", korean: "흐려요", mandarin: "多云", romanization: { japanese: "kumori", korean: "heuryeoyo", mandarin: "duō yún" }, breakdown: { japanese: [{ char: "く", rom: "ku" },{ char: "も", rom: "mo" },{ char: "り", rom: "ri" }], korean: [{ char: "흐", rom: "heu" },{ char: "려", rom: "ryeo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "多", rom: "duō", meaning: "many" },{ char: "云", rom: "yún", meaning: "cloud" }] } },
  { cat: "Weather", english: "Snowy", japanese: "ゆき", korean: "눈", mandarin: "下雪", romanization: { japanese: "yuki", korean: "nun", mandarin: "xià xuě" }, breakdown: { japanese: [{ char: "ゆ", rom: "yu" },{ char: "き", rom: "ki" }], korean: [{ char: "눈", rom: "nun", meaning: "snow/eye" }], mandarin: [{ char: "下", rom: "xià", meaning: "fall" },{ char: "雪", rom: "xuě", meaning: "snow" }] } },
  { cat: "Weather", english: "Windy", japanese: "かぜ", korean: "바람", mandarin: "刮风", romanization: { japanese: "kaze", korean: "baram", mandarin: "guā fēng" }, breakdown: { japanese: [{ char: "か", rom: "ka" },{ char: "ぜ", rom: "ze" }], korean: [{ char: "바", rom: "ba" },{ char: "람", rom: "ram" }], mandarin: [{ char: "刮", rom: "guā", meaning: "blow" },{ char: "风", rom: "fēng", meaning: "wind" }] } },

  // TRANSPORTATION
  { cat: "Transport", english: "Car", japanese: "くるま", korean: "자동차", mandarin: "汽车", romanization: { japanese: "kuruma", korean: "jadongcha", mandarin: "qì chē" }, breakdown: { japanese: [{ char: "く", rom: "ku" },{ char: "る", rom: "ru" },{ char: "ま", rom: "ma" }], korean: [{ char: "자", rom: "ja" },{ char: "동", rom: "dong" },{ char: "차", rom: "cha", meaning: "car" }], mandarin: [{ char: "汽", rom: "qì", meaning: "steam" },{ char: "车", rom: "chē", meaning: "vehicle" }] } },
  { cat: "Transport", english: "Bus", japanese: "バス", korean: "버스", mandarin: "公共汽车", romanization: { japanese: "basu", korean: "beoseu", mandarin: "gōng gòng qì chē" }, breakdown: { japanese: [{ char: "バ", rom: "ba" },{ char: "ス", rom: "su" }], korean: [{ char: "버", rom: "beo" },{ char: "스", rom: "seu" }], mandarin: [{ char: "公", rom: "gōng", meaning: "public" },{ char: "共", rom: "gòng", meaning: "shared" },{ char: "汽", rom: "qì", meaning: "steam" },{ char: "车", rom: "chē", meaning: "vehicle" }] } },
  { cat: "Transport", english: "Train", japanese: "でんしゃ", korean: "기차", mandarin: "火车", romanization: { japanese: "densha", korean: "gicha", mandarin: "huǒ chē" }, breakdown: { japanese: [{ char: "で", rom: "de" },{ char: "ん", rom: "n", meaning: "electric" },{ char: "し", rom: "sha" },{ char: "ゃ", rom: "" }], korean: [{ char: "기", rom: "gi", meaning: "machine" },{ char: "차", rom: "cha", meaning: "vehicle" }], mandarin: [{ char: "火", rom: "huǒ", meaning: "fire" },{ char: "车", rom: "chē", meaning: "vehicle" }] } },
  { cat: "Transport", english: "Plane", japanese: "ひこうき", korean: "비행기", mandarin: "飞机", romanization: { japanese: "hikouki", korean: "bihaenggi", mandarin: "fēi jī" }, breakdown: { japanese: [{ char: "ひ", rom: "hi" },{ char: "こ", rom: "ko" },{ char: "う", rom: "u" },{ char: "き", rom: "ki", meaning: "machine" }], korean: [{ char: "비", rom: "bi" },{ char: "행", rom: "haeng", meaning: "go" },{ char: "기", rom: "gi", meaning: "machine" }], mandarin: [{ char: "飞", rom: "fēi", meaning: "fly" },{ char: "机", rom: "jī", meaning: "machine" }] } },
  { cat: "Transport", english: "Bike", japanese: "じてんしゃ", korean: "자전거", mandarin: "自行车", romanization: { japanese: "jitensha", korean: "jajeongeo", mandarin: "zì xíng chē" }, breakdown: { japanese: [{ char: "じ", rom: "ji", meaning: "self" },{ char: "て", rom: "te" },{ char: "ん", rom: "n" },{ char: "し", rom: "sha" },{ char: "ゃ", rom: "" }], korean: [{ char: "자", rom: "ja", meaning: "self" },{ char: "전", rom: "jeon" },{ char: "거", rom: "geo" }], mandarin: [{ char: "自", rom: "zì", meaning: "self" },{ char: "行", rom: "xíng", meaning: "walk" },{ char: "车", rom: "chē", meaning: "vehicle" }] } },
  { cat: "Transport", english: "Boat", japanese: "ふね", korean: "배", mandarin: "船", romanization: { japanese: "fune", korean: "bae", mandarin: "chuán" }, breakdown: { japanese: [{ char: "ふ", rom: "fu" },{ char: "ね", rom: "ne" }], korean: [{ char: "배", rom: "bae", meaning: "boat" }], mandarin: [{ char: "船", rom: "chuán", meaning: "boat" }] } },

  // ── EXPANSION SET ─────────────────────────────────────────────────────
  // 60 additional cards added 2026-06-01. Same shape as above.
  // FOOD (15)
  { cat: "Food", english: "Orange (fruit)", japanese: "オレンジ", korean: "오렌지", mandarin: "橙子", romanization: { japanese: "orenji", korean: "orenji", mandarin: "chéng zi" }, breakdown: { japanese: [{ char: "オ", rom: "o" },{ char: "レ", rom: "re" },{ char: "ン", rom: "n" },{ char: "ジ", rom: "ji" }], korean: [{ char: "오", rom: "o" },{ char: "렌", rom: "ren" },{ char: "지", rom: "ji" }], mandarin: [{ char: "橙", rom: "chéng", meaning: "orange" },{ char: "子", rom: "zi", meaning: "suffix" }] } },
  { cat: "Food", english: "Strawberry", japanese: "いちご", korean: "딸기", mandarin: "草莓", romanization: { japanese: "ichigo", korean: "ttalgi", mandarin: "cǎo méi" }, breakdown: { japanese: [{ char: "い", rom: "i" },{ char: "ち", rom: "chi" },{ char: "ご", rom: "go" }], korean: [{ char: "딸", rom: "ttal" },{ char: "기", rom: "gi" }], mandarin: [{ char: "草", rom: "cǎo", meaning: "grass" },{ char: "莓", rom: "méi", meaning: "berry" }] } },
  { cat: "Food", english: "Grape", japanese: "ぶどう", korean: "포도", mandarin: "葡萄", romanization: { japanese: "budou", korean: "podo", mandarin: "pú táo" }, breakdown: { japanese: [{ char: "ぶ", rom: "bu" },{ char: "ど", rom: "do" },{ char: "う", rom: "u" }], korean: [{ char: "포", rom: "po" },{ char: "도", rom: "do" }], mandarin: [{ char: "葡", rom: "pú" },{ char: "萄", rom: "táo" }] } },
  { cat: "Food", english: "Watermelon", japanese: "すいか", korean: "수박", mandarin: "西瓜", romanization: { japanese: "suika", korean: "subak", mandarin: "xī guā" }, breakdown: { japanese: [{ char: "す", rom: "su" },{ char: "い", rom: "i" },{ char: "か", rom: "ka" }], korean: [{ char: "수", rom: "su", meaning: "water" },{ char: "박", rom: "bak", meaning: "gourd" }], mandarin: [{ char: "西", rom: "xī", meaning: "west" },{ char: "瓜", rom: "guā", meaning: "melon" }] } },
  { cat: "Food", english: "Carrot", japanese: "にんじん", korean: "당근", mandarin: "胡萝卜", romanization: { japanese: "ninjin", korean: "danggeun", mandarin: "hú luó bo" }, breakdown: { japanese: [{ char: "に", rom: "ni" },{ char: "ん", rom: "n" },{ char: "じ", rom: "ji" },{ char: "ん", rom: "n" }], korean: [{ char: "당", rom: "dang" },{ char: "근", rom: "geun" }], mandarin: [{ char: "胡", rom: "hú" },{ char: "萝", rom: "luó" },{ char: "卜", rom: "bo" }] } },
  { cat: "Food", english: "Potato", japanese: "じゃがいも", korean: "감자", mandarin: "土豆", romanization: { japanese: "jagaimo", korean: "gamja", mandarin: "tǔ dòu" }, breakdown: { japanese: [{ char: "じ", rom: "ja" },{ char: "ゃ", rom: "" },{ char: "が", rom: "ga" },{ char: "い", rom: "i" },{ char: "も", rom: "mo" }], korean: [{ char: "감", rom: "gam" },{ char: "자", rom: "ja" }], mandarin: [{ char: "土", rom: "tǔ", meaning: "earth" },{ char: "豆", rom: "dòu", meaning: "bean" }] } },
  { cat: "Food", english: "Breakfast", japanese: "あさごはん", korean: "아침", mandarin: "早餐", romanization: { japanese: "asagohan", korean: "achim", mandarin: "zǎo cān" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "さ", rom: "sa", meaning: "morning" },{ char: "ご", rom: "go", meaning: "polite" },{ char: "は", rom: "ha" },{ char: "ん", rom: "n", meaning: "meal" }], korean: [{ char: "아", rom: "a" },{ char: "침", rom: "chim", meaning: "morning" }], mandarin: [{ char: "早", rom: "zǎo", meaning: "early" },{ char: "餐", rom: "cān", meaning: "meal" }] } },
  { cat: "Food", english: "Lunch", japanese: "ひるごはん", korean: "점심", mandarin: "午餐", romanization: { japanese: "hirugohan", korean: "jeomsim", mandarin: "wǔ cān" }, breakdown: { japanese: [{ char: "ひ", rom: "hi" },{ char: "る", rom: "ru", meaning: "noon" },{ char: "ご", rom: "go", meaning: "polite" },{ char: "は", rom: "ha" },{ char: "ん", rom: "n", meaning: "meal" }], korean: [{ char: "점", rom: "jeom" },{ char: "심", rom: "sim", meaning: "midday" }], mandarin: [{ char: "午", rom: "wǔ", meaning: "noon" },{ char: "餐", rom: "cān", meaning: "meal" }] } },
  { cat: "Food", english: "Dinner", japanese: "ばんごはん", korean: "저녁", mandarin: "晚餐", romanization: { japanese: "bangohan", korean: "jeonyeok", mandarin: "wǎn cān" }, breakdown: { japanese: [{ char: "ば", rom: "ba" },{ char: "ん", rom: "n", meaning: "evening" },{ char: "ご", rom: "go", meaning: "polite" },{ char: "は", rom: "ha" },{ char: "ん", rom: "n", meaning: "meal" }], korean: [{ char: "저", rom: "jeo" },{ char: "녁", rom: "nyeok", meaning: "evening" }], mandarin: [{ char: "晚", rom: "wǎn", meaning: "evening" },{ char: "餐", rom: "cān", meaning: "meal" }] } },
  { cat: "Food", english: "Juice", japanese: "ジュース", korean: "주스", mandarin: "果汁", romanization: { japanese: "juusu", korean: "juseu", mandarin: "guǒ zhī" }, breakdown: { japanese: [{ char: "ジ", rom: "ju" },{ char: "ュ", rom: "" },{ char: "ー", rom: "u" },{ char: "ス", rom: "su" }], korean: [{ char: "주", rom: "ju" },{ char: "스", rom: "seu" }], mandarin: [{ char: "果", rom: "guǒ", meaning: "fruit" },{ char: "汁", rom: "zhī", meaning: "juice" }] } },
  { cat: "Food", english: "Ice cream", japanese: "アイスクリーム", korean: "아이스크림", mandarin: "冰淇淋", romanization: { japanese: "aisukuriimu", korean: "aiseukeurim", mandarin: "bīng qí lín" }, breakdown: { japanese: [{ char: "ア", rom: "a" },{ char: "イ", rom: "i" },{ char: "ス", rom: "su" },{ char: "ク", rom: "ku" },{ char: "リ", rom: "ri" },{ char: "ー", rom: "i" },{ char: "ム", rom: "mu" }], korean: [{ char: "아", rom: "a" },{ char: "이", rom: "i" },{ char: "스", rom: "seu" },{ char: "크", rom: "keu" },{ char: "림", rom: "rim" }], mandarin: [{ char: "冰", rom: "bīng", meaning: "ice" },{ char: "淇", rom: "qí" },{ char: "淋", rom: "lín" }] } },
  { cat: "Food", english: "Cookie", japanese: "クッキー", korean: "쿠키", mandarin: "饼干", romanization: { japanese: "kukkii", korean: "kuki", mandarin: "bǐng gān" }, breakdown: { japanese: [{ char: "ク", rom: "ku" },{ char: "ッ", rom: "" },{ char: "キ", rom: "ki" },{ char: "ー", rom: "i" }], korean: [{ char: "쿠", rom: "ku" },{ char: "키", rom: "ki" }], mandarin: [{ char: "饼", rom: "bǐng", meaning: "cake" },{ char: "干", rom: "gān", meaning: "dry" }] } },
  { cat: "Food", english: "Cheese", japanese: "チーズ", korean: "치즈", mandarin: "奶酪", romanization: { japanese: "chiizu", korean: "chijeu", mandarin: "nǎi lào" }, breakdown: { japanese: [{ char: "チ", rom: "chi" },{ char: "ー", rom: "i" },{ char: "ズ", rom: "zu" }], korean: [{ char: "치", rom: "chi" },{ char: "즈", rom: "jeu" }], mandarin: [{ char: "奶", rom: "nǎi", meaning: "milk" },{ char: "酪", rom: "lào", meaning: "cheese" }] } },
  { cat: "Food", english: "Butter", japanese: "バター", korean: "버터", mandarin: "黄油", romanization: { japanese: "bataa", korean: "beoteo", mandarin: "huáng yóu" }, breakdown: { japanese: [{ char: "バ", rom: "ba" },{ char: "タ", rom: "ta" },{ char: "ー", rom: "a" }], korean: [{ char: "버", rom: "beo" },{ char: "터", rom: "teo" }], mandarin: [{ char: "黄", rom: "huáng", meaning: "yellow" },{ char: "油", rom: "yóu", meaning: "oil" }] } },
  { cat: "Food", english: "Salt", japanese: "しお", korean: "소금", mandarin: "盐", romanization: { japanese: "shio", korean: "sogeum", mandarin: "yán" }, breakdown: { japanese: [{ char: "し", rom: "shi" },{ char: "お", rom: "o" }], korean: [{ char: "소", rom: "so" },{ char: "금", rom: "geum" }], mandarin: [{ char: "盐", rom: "yán", meaning: "salt" }] } },

  // DAILY: clothes & routine (15)
  { cat: "Daily", english: "Shirt", japanese: "シャツ", korean: "셔츠", mandarin: "衬衫", romanization: { japanese: "shatsu", korean: "syeocheu", mandarin: "chèn shān" }, breakdown: { japanese: [{ char: "シ", rom: "sha" },{ char: "ャ", rom: "" },{ char: "ツ", rom: "tsu" }], korean: [{ char: "셔", rom: "syeo" },{ char: "츠", rom: "cheu" }], mandarin: [{ char: "衬", rom: "chèn" },{ char: "衫", rom: "shān", meaning: "shirt" }] } },
  { cat: "Daily", english: "Pants", japanese: "ズボン", korean: "바지", mandarin: "裤子", romanization: { japanese: "zubon", korean: "baji", mandarin: "kù zi" }, breakdown: { japanese: [{ char: "ズ", rom: "zu" },{ char: "ボ", rom: "bo" },{ char: "ン", rom: "n" }], korean: [{ char: "바", rom: "ba" },{ char: "지", rom: "ji" }], mandarin: [{ char: "裤", rom: "kù", meaning: "pants" },{ char: "子", rom: "zi", meaning: "suffix" }] } },
  { cat: "Daily", english: "Shoes", japanese: "くつ", korean: "신발", mandarin: "鞋子", romanization: { japanese: "kutsu", korean: "sinbal", mandarin: "xié zi" }, breakdown: { japanese: [{ char: "く", rom: "ku" },{ char: "つ", rom: "tsu" }], korean: [{ char: "신", rom: "sin" },{ char: "발", rom: "bal" }], mandarin: [{ char: "鞋", rom: "xié", meaning: "shoe" },{ char: "子", rom: "zi", meaning: "suffix" }] } },
  { cat: "Daily", english: "Socks", japanese: "くつした", korean: "양말", mandarin: "袜子", romanization: { japanese: "kutsushita", korean: "yangmal", mandarin: "wà zi" }, breakdown: { japanese: [{ char: "く", rom: "ku" },{ char: "つ", rom: "tsu", meaning: "shoe" },{ char: "し", rom: "shi" },{ char: "た", rom: "ta", meaning: "under" }], korean: [{ char: "양", rom: "yang" },{ char: "말", rom: "mal" }], mandarin: [{ char: "袜", rom: "wà", meaning: "sock" },{ char: "子", rom: "zi", meaning: "suffix" }] } },
  { cat: "Daily", english: "Hat", japanese: "ぼうし", korean: "모자", mandarin: "帽子", romanization: { japanese: "boushi", korean: "moja", mandarin: "mào zi" }, breakdown: { japanese: [{ char: "ぼ", rom: "bo" },{ char: "う", rom: "u" },{ char: "し", rom: "shi" }], korean: [{ char: "모", rom: "mo" },{ char: "자", rom: "ja" }], mandarin: [{ char: "帽", rom: "mào", meaning: "hat" },{ char: "子", rom: "zi", meaning: "suffix" }] } },
  { cat: "Daily", english: "Coat", japanese: "コート", korean: "외투", mandarin: "外套", romanization: { japanese: "kooto", korean: "oetu", mandarin: "wài tào" }, breakdown: { japanese: [{ char: "コ", rom: "ko" },{ char: "ー", rom: "o" },{ char: "ト", rom: "to" }], korean: [{ char: "외", rom: "oe", meaning: "outer" },{ char: "투", rom: "tu" }], mandarin: [{ char: "外", rom: "wài", meaning: "outside" },{ char: "套", rom: "tào", meaning: "cover" }] } },
  { cat: "Daily", english: "Pajamas", japanese: "パジャマ", korean: "잠옷", mandarin: "睡衣", romanization: { japanese: "pajama", korean: "jamot", mandarin: "shuì yī" }, breakdown: { japanese: [{ char: "パ", rom: "pa" },{ char: "ジ", rom: "ja" },{ char: "ャ", rom: "" },{ char: "マ", rom: "ma" }], korean: [{ char: "잠", rom: "jam", meaning: "sleep" },{ char: "옷", rom: "ot", meaning: "clothes" }], mandarin: [{ char: "睡", rom: "shuì", meaning: "sleep" },{ char: "衣", rom: "yī", meaning: "clothes" }] } },
  { cat: "Daily", english: "Brush teeth", japanese: "はをみがく", korean: "양치하다", mandarin: "刷牙", romanization: { japanese: "ha o migaku", korean: "yangchihada", mandarin: "shuā yá" }, breakdown: { japanese: [{ char: "は", rom: "ha", meaning: "tooth" },{ char: "を", rom: "o", meaning: "object" },{ char: "み", rom: "mi" },{ char: "が", rom: "ga" },{ char: "く", rom: "ku", meaning: "polish" }], korean: [{ char: "양", rom: "yang" },{ char: "치", rom: "chi", meaning: "tooth" },{ char: "하", rom: "ha", meaning: "do" },{ char: "다", rom: "da" }], mandarin: [{ char: "刷", rom: "shuā", meaning: "brush" },{ char: "牙", rom: "yá", meaning: "tooth" }] } },
  { cat: "Daily", english: "Wash hands", japanese: "てをあらう", korean: "손을 씻다", mandarin: "洗手", romanization: { japanese: "te o arau", korean: "soneul ssitda", mandarin: "xǐ shǒu" }, breakdown: { japanese: [{ char: "て", rom: "te", meaning: "hand" },{ char: "を", rom: "o", meaning: "object" },{ char: "あ", rom: "a" },{ char: "ら", rom: "ra" },{ char: "う", rom: "u", meaning: "wash" }], korean: [{ char: "손", rom: "son", meaning: "hand" },{ char: "을", rom: "eul", meaning: "object" },{ char: "씻", rom: "ssit", meaning: "wash" },{ char: "다", rom: "da" }], mandarin: [{ char: "洗", rom: "xǐ", meaning: "wash" },{ char: "手", rom: "shǒu", meaning: "hand" }] } },
  { cat: "Daily", english: "Take a bath", japanese: "おふろにはいる", korean: "목욕하다", mandarin: "洗澡", romanization: { japanese: "ofuro ni hairu", korean: "mogyokhada", mandarin: "xǐ zǎo" }, breakdown: { japanese: [{ char: "お", rom: "o", meaning: "polite" },{ char: "ふ", rom: "fu" },{ char: "ろ", rom: "ro", meaning: "bath" },{ char: "に", rom: "ni" },{ char: "は", rom: "ha" },{ char: "い", rom: "i" },{ char: "る", rom: "ru", meaning: "enter" }], korean: [{ char: "목", rom: "mok" },{ char: "욕", rom: "yok", meaning: "bath" },{ char: "하", rom: "ha", meaning: "do" },{ char: "다", rom: "da" }], mandarin: [{ char: "洗", rom: "xǐ", meaning: "wash" },{ char: "澡", rom: "zǎo", meaning: "bathe" }] } },
  { cat: "Daily", english: "Bed", japanese: "ベッド", korean: "침대", mandarin: "床", romanization: { japanese: "beddo", korean: "chimdae", mandarin: "chuáng" }, breakdown: { japanese: [{ char: "ベ", rom: "be" },{ char: "ッ", rom: "" },{ char: "ド", rom: "do" }], korean: [{ char: "침", rom: "chim", meaning: "sleep" },{ char: "대", rom: "dae", meaning: "platform" }], mandarin: [{ char: "床", rom: "chuáng", meaning: "bed" }] } },
  { cat: "Daily", english: "Pillow", japanese: "まくら", korean: "베개", mandarin: "枕头", romanization: { japanese: "makura", korean: "begae", mandarin: "zhěn tou" }, breakdown: { japanese: [{ char: "ま", rom: "ma" },{ char: "く", rom: "ku" },{ char: "ら", rom: "ra" }], korean: [{ char: "베", rom: "be" },{ char: "개", rom: "gae" }], mandarin: [{ char: "枕", rom: "zhěn", meaning: "pillow" },{ char: "头", rom: "tou", meaning: "head" }] } },
  { cat: "Daily", english: "Soap", japanese: "せっけん", korean: "비누", mandarin: "肥皂", romanization: { japanese: "sekken", korean: "binu", mandarin: "féi zào" }, breakdown: { japanese: [{ char: "せ", rom: "se" },{ char: "っ", rom: "" },{ char: "け", rom: "ke" },{ char: "ん", rom: "n" }], korean: [{ char: "비", rom: "bi" },{ char: "누", rom: "nu" }], mandarin: [{ char: "肥", rom: "féi", meaning: "fat" },{ char: "皂", rom: "zào", meaning: "soap" }] } },
  { cat: "Daily", english: "Towel", japanese: "タオル", korean: "수건", mandarin: "毛巾", romanization: { japanese: "taoru", korean: "sugeon", mandarin: "máo jīn" }, breakdown: { japanese: [{ char: "タ", rom: "ta" },{ char: "オ", rom: "o" },{ char: "ル", rom: "ru" }], korean: [{ char: "수", rom: "su" },{ char: "건", rom: "geon" }], mandarin: [{ char: "毛", rom: "máo", meaning: "hair" },{ char: "巾", rom: "jīn", meaning: "cloth" }] } },
  { cat: "Daily", english: "Toothbrush", japanese: "はブラシ", korean: "칫솔", mandarin: "牙刷", romanization: { japanese: "haburashi", korean: "chissol", mandarin: "yá shuā" }, breakdown: { japanese: [{ char: "は", rom: "ha", meaning: "tooth" },{ char: "ブ", rom: "bu" },{ char: "ラ", rom: "ra" },{ char: "シ", rom: "shi" }], korean: [{ char: "칫", rom: "chit", meaning: "tooth" },{ char: "솔", rom: "sol", meaning: "brush" }], mandarin: [{ char: "牙", rom: "yá", meaning: "tooth" },{ char: "刷", rom: "shuā", meaning: "brush" }] } },

  // PLACES (6)
  { cat: "Places", english: "Home", japanese: "いえ", korean: "집", mandarin: "家", romanization: { japanese: "ie", korean: "jip", mandarin: "jiā" }, breakdown: { japanese: [{ char: "い", rom: "i" },{ char: "え", rom: "e" }], korean: [{ char: "집", rom: "jip", meaning: "home" }], mandarin: [{ char: "家", rom: "jiā", meaning: "home" }] } },
  { cat: "Places", english: "Park", japanese: "こうえん", korean: "공원", mandarin: "公园", romanization: { japanese: "kouen", korean: "gongwon", mandarin: "gōng yuán" }, breakdown: { japanese: [{ char: "こ", rom: "ko" },{ char: "う", rom: "u" },{ char: "え", rom: "e" },{ char: "ん", rom: "n" }], korean: [{ char: "공", rom: "gong", meaning: "public" },{ char: "원", rom: "won", meaning: "garden" }], mandarin: [{ char: "公", rom: "gōng", meaning: "public" },{ char: "园", rom: "yuán", meaning: "garden" }] } },
  { cat: "Places", english: "Store", japanese: "みせ", korean: "가게", mandarin: "商店", romanization: { japanese: "mise", korean: "gage", mandarin: "shāng diàn" }, breakdown: { japanese: [{ char: "み", rom: "mi" },{ char: "せ", rom: "se" }], korean: [{ char: "가", rom: "ga" },{ char: "게", rom: "ge" }], mandarin: [{ char: "商", rom: "shāng", meaning: "trade" },{ char: "店", rom: "diàn", meaning: "shop" }] } },
  { cat: "Places", english: "Library", japanese: "としょかん", korean: "도서관", mandarin: "图书馆", romanization: { japanese: "toshokan", korean: "doseogwan", mandarin: "tú shū guǎn" }, breakdown: { japanese: [{ char: "と", rom: "to" },{ char: "し", rom: "sho" },{ char: "ょ", rom: "" },{ char: "か", rom: "ka" },{ char: "ん", rom: "n", meaning: "hall" }], korean: [{ char: "도", rom: "do" },{ char: "서", rom: "seo", meaning: "book" },{ char: "관", rom: "gwan", meaning: "hall" }], mandarin: [{ char: "图", rom: "tú", meaning: "picture" },{ char: "书", rom: "shū", meaning: "book" },{ char: "馆", rom: "guǎn", meaning: "hall" }] } },
  { cat: "Places", english: "Hospital", japanese: "びょういん", korean: "병원", mandarin: "医院", romanization: { japanese: "byouin", korean: "byeongwon", mandarin: "yī yuàn" }, breakdown: { japanese: [{ char: "び", rom: "byo" },{ char: "ょ", rom: "" },{ char: "う", rom: "u", meaning: "sick" },{ char: "い", rom: "i" },{ char: "ん", rom: "n", meaning: "house" }], korean: [{ char: "병", rom: "byeong", meaning: "illness" },{ char: "원", rom: "won", meaning: "house" }], mandarin: [{ char: "医", rom: "yī", meaning: "medicine" },{ char: "院", rom: "yuàn", meaning: "house" }] } },
  { cat: "Places", english: "Playground", japanese: "あそびば", korean: "놀이터", mandarin: "游乐场", romanization: { japanese: "asobiba", korean: "noriteo", mandarin: "yóu lè chǎng" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "そ", rom: "so" },{ char: "び", rom: "bi", meaning: "play" },{ char: "ば", rom: "ba", meaning: "place" }], korean: [{ char: "놀", rom: "nol", meaning: "play" },{ char: "이", rom: "i" },{ char: "터", rom: "teo", meaning: "place" }], mandarin: [{ char: "游", rom: "yóu", meaning: "play" },{ char: "乐", rom: "lè", meaning: "joy" },{ char: "场", rom: "chǎng", meaning: "field" }] } },

  // ACTIONS (6 new)
  { cat: "Actions", english: "Play", japanese: "あそぶ", korean: "놀다", mandarin: "玩", romanization: { japanese: "asobu", korean: "nolda", mandarin: "wán" }, breakdown: { japanese: [{ char: "あ", rom: "a" },{ char: "そ", rom: "so" },{ char: "ぶ", rom: "bu", meaning: "play" }], korean: [{ char: "놀", rom: "nol", meaning: "play" },{ char: "다", rom: "da" }], mandarin: [{ char: "玩", rom: "wán", meaning: "play" }] } },
  { cat: "Actions", english: "Jump", japanese: "とぶ", korean: "뛰다", mandarin: "跳", romanization: { japanese: "tobu", korean: "ttwida", mandarin: "tiào" }, breakdown: { japanese: [{ char: "と", rom: "to" },{ char: "ぶ", rom: "bu", meaning: "jump" }], korean: [{ char: "뛰", rom: "ttwi", meaning: "jump" },{ char: "다", rom: "da" }], mandarin: [{ char: "跳", rom: "tiào", meaning: "jump" }] } },
  { cat: "Actions", english: "Draw", japanese: "えをかく", korean: "그리다", mandarin: "画", romanization: { japanese: "e o kaku", korean: "geurida", mandarin: "huà" }, breakdown: { japanese: [{ char: "え", rom: "e", meaning: "picture" },{ char: "を", rom: "o", meaning: "object" },{ char: "か", rom: "ka" },{ char: "く", rom: "ku", meaning: "draw" }], korean: [{ char: "그", rom: "geu" },{ char: "리", rom: "ri", meaning: "draw" },{ char: "다", rom: "da" }], mandarin: [{ char: "画", rom: "huà", meaning: "draw" }] } },
  { cat: "Actions", english: "Sit", japanese: "すわる", korean: "앉다", mandarin: "坐", romanization: { japanese: "suwaru", korean: "anjda", mandarin: "zuò" }, breakdown: { japanese: [{ char: "す", rom: "su" },{ char: "わ", rom: "wa" },{ char: "る", rom: "ru", meaning: "sit" }], korean: [{ char: "앉", rom: "anj", meaning: "sit" },{ char: "다", rom: "da" }], mandarin: [{ char: "坐", rom: "zuò", meaning: "sit" }] } },
  { cat: "Actions", english: "Stand", japanese: "たつ", korean: "서다", mandarin: "站", romanization: { japanese: "tatsu", korean: "seoda", mandarin: "zhàn" }, breakdown: { japanese: [{ char: "た", rom: "ta" },{ char: "つ", rom: "tsu", meaning: "stand" }], korean: [{ char: "서", rom: "seo", meaning: "stand" },{ char: "다", rom: "da" }], mandarin: [{ char: "站", rom: "zhàn", meaning: "stand" }] } },
  { cat: "Actions", english: "Help", japanese: "たすける", korean: "돕다", mandarin: "帮助", romanization: { japanese: "tasukeru", korean: "dopda", mandarin: "bāng zhù" }, breakdown: { japanese: [{ char: "た", rom: "ta" },{ char: "す", rom: "su" },{ char: "け", rom: "ke", meaning: "help" },{ char: "る", rom: "ru" }], korean: [{ char: "돕", rom: "dop", meaning: "help" },{ char: "다", rom: "da" }], mandarin: [{ char: "帮", rom: "bāng", meaning: "help" },{ char: "助", rom: "zhù", meaning: "assist" }] } },

  // TIME: days of the week (7)
  { cat: "Time", english: "Monday", japanese: "げつようび", korean: "월요일", mandarin: "星期一", romanization: { japanese: "getsuyoubi", korean: "woryoil", mandarin: "xīng qī yī" }, breakdown: { japanese: [{ char: "げ", rom: "ge" },{ char: "つ", rom: "tsu", meaning: "moon" },{ char: "よ", rom: "yo" },{ char: "う", rom: "u" },{ char: "び", rom: "bi", meaning: "day" }], korean: [{ char: "월", rom: "wol", meaning: "moon" },{ char: "요", rom: "yo" },{ char: "일", rom: "il", meaning: "day" }], mandarin: [{ char: "星", rom: "xīng", meaning: "star" },{ char: "期", rom: "qī", meaning: "period" },{ char: "一", rom: "yī", meaning: "one" }] } },
  { cat: "Time", english: "Tuesday", japanese: "かようび", korean: "화요일", mandarin: "星期二", romanization: { japanese: "kayoubi", korean: "hwayoil", mandarin: "xīng qī èr" }, breakdown: { japanese: [{ char: "か", rom: "ka", meaning: "fire" },{ char: "よ", rom: "yo" },{ char: "う", rom: "u" },{ char: "び", rom: "bi", meaning: "day" }], korean: [{ char: "화", rom: "hwa", meaning: "fire" },{ char: "요", rom: "yo" },{ char: "일", rom: "il", meaning: "day" }], mandarin: [{ char: "星", rom: "xīng", meaning: "star" },{ char: "期", rom: "qī", meaning: "period" },{ char: "二", rom: "èr", meaning: "two" }] } },
  { cat: "Time", english: "Wednesday", japanese: "すいようび", korean: "수요일", mandarin: "星期三", romanization: { japanese: "suiyoubi", korean: "suyoil", mandarin: "xīng qī sān" }, breakdown: { japanese: [{ char: "す", rom: "su" },{ char: "い", rom: "i", meaning: "water" },{ char: "よ", rom: "yo" },{ char: "う", rom: "u" },{ char: "び", rom: "bi", meaning: "day" }], korean: [{ char: "수", rom: "su", meaning: "water" },{ char: "요", rom: "yo" },{ char: "일", rom: "il", meaning: "day" }], mandarin: [{ char: "星", rom: "xīng", meaning: "star" },{ char: "期", rom: "qī", meaning: "period" },{ char: "三", rom: "sān", meaning: "three" }] } },
  { cat: "Time", english: "Thursday", japanese: "もくようび", korean: "목요일", mandarin: "星期四", romanization: { japanese: "mokuyoubi", korean: "mogyoil", mandarin: "xīng qī sì" }, breakdown: { japanese: [{ char: "も", rom: "mo" },{ char: "く", rom: "ku", meaning: "tree" },{ char: "よ", rom: "yo" },{ char: "う", rom: "u" },{ char: "び", rom: "bi", meaning: "day" }], korean: [{ char: "목", rom: "mok", meaning: "tree" },{ char: "요", rom: "yo" },{ char: "일", rom: "il", meaning: "day" }], mandarin: [{ char: "星", rom: "xīng", meaning: "star" },{ char: "期", rom: "qī", meaning: "period" },{ char: "四", rom: "sì", meaning: "four" }] } },
  { cat: "Time", english: "Friday", japanese: "きんようび", korean: "금요일", mandarin: "星期五", romanization: { japanese: "kinyoubi", korean: "geumyoil", mandarin: "xīng qī wǔ" }, breakdown: { japanese: [{ char: "き", rom: "ki" },{ char: "ん", rom: "n", meaning: "gold" },{ char: "よ", rom: "yo" },{ char: "う", rom: "u" },{ char: "び", rom: "bi", meaning: "day" }], korean: [{ char: "금", rom: "geum", meaning: "gold" },{ char: "요", rom: "yo" },{ char: "일", rom: "il", meaning: "day" }], mandarin: [{ char: "星", rom: "xīng", meaning: "star" },{ char: "期", rom: "qī", meaning: "period" },{ char: "五", rom: "wǔ", meaning: "five" }] } },
  { cat: "Time", english: "Saturday", japanese: "どようび", korean: "토요일", mandarin: "星期六", romanization: { japanese: "doyoubi", korean: "toyoil", mandarin: "xīng qī liù" }, breakdown: { japanese: [{ char: "ど", rom: "do", meaning: "earth" },{ char: "よ", rom: "yo" },{ char: "う", rom: "u" },{ char: "び", rom: "bi", meaning: "day" }], korean: [{ char: "토", rom: "to", meaning: "earth" },{ char: "요", rom: "yo" },{ char: "일", rom: "il", meaning: "day" }], mandarin: [{ char: "星", rom: "xīng", meaning: "star" },{ char: "期", rom: "qī", meaning: "period" },{ char: "六", rom: "liù", meaning: "six" }] } },
  { cat: "Time", english: "Sunday", japanese: "にちようび", korean: "일요일", mandarin: "星期日", romanization: { japanese: "nichiyoubi", korean: "iryoil", mandarin: "xīng qī rì" }, breakdown: { japanese: [{ char: "に", rom: "ni" },{ char: "ち", rom: "chi", meaning: "sun" },{ char: "よ", rom: "yo" },{ char: "う", rom: "u" },{ char: "び", rom: "bi", meaning: "day" }], korean: [{ char: "일", rom: "il", meaning: "sun" },{ char: "요", rom: "yo" },{ char: "일", rom: "il", meaning: "day" }], mandarin: [{ char: "星", rom: "xīng", meaning: "star" },{ char: "期", rom: "qī", meaning: "period" },{ char: "日", rom: "rì", meaning: "sun" }] } },

  // COLORS (6 new)
  { cat: "Colors", english: "Purple", japanese: "むらさき", korean: "보라색", mandarin: "紫色", romanization: { japanese: "murasaki", korean: "borasaek", mandarin: "zǐ sè" }, breakdown: { japanese: [{ char: "む", rom: "mu" },{ char: "ら", rom: "ra" },{ char: "さ", rom: "sa" },{ char: "き", rom: "ki" }], korean: [{ char: "보", rom: "bo" },{ char: "라", rom: "ra", meaning: "purple" },{ char: "색", rom: "saek", meaning: "color" }], mandarin: [{ char: "紫", rom: "zǐ", meaning: "purple" },{ char: "色", rom: "sè", meaning: "color" }] } },
  { cat: "Colors", english: "Orange (color)", japanese: "オレンジいろ", korean: "주황색", mandarin: "橙色", romanization: { japanese: "orenjiiro", korean: "juhwangsaek", mandarin: "chéng sè" }, breakdown: { japanese: [{ char: "オ", rom: "o" },{ char: "レ", rom: "re" },{ char: "ン", rom: "n" },{ char: "ジ", rom: "ji" },{ char: "い", rom: "i" },{ char: "ろ", rom: "ro", meaning: "color" }], korean: [{ char: "주", rom: "ju" },{ char: "황", rom: "hwang" },{ char: "색", rom: "saek", meaning: "color" }], mandarin: [{ char: "橙", rom: "chéng", meaning: "orange" },{ char: "色", rom: "sè", meaning: "color" }] } },
  { cat: "Colors", english: "Pink", japanese: "ピンク", korean: "분홍색", mandarin: "粉色", romanization: { japanese: "pinku", korean: "bunhongsaek", mandarin: "fěn sè" }, breakdown: { japanese: [{ char: "ピ", rom: "pi" },{ char: "ン", rom: "n" },{ char: "ク", rom: "ku" }], korean: [{ char: "분", rom: "bun" },{ char: "홍", rom: "hong" },{ char: "색", rom: "saek", meaning: "color" }], mandarin: [{ char: "粉", rom: "fěn", meaning: "powder" },{ char: "色", rom: "sè", meaning: "color" }] } },
  { cat: "Colors", english: "White", japanese: "しろ", korean: "흰색", mandarin: "白色", romanization: { japanese: "shiro", korean: "huinsaek", mandarin: "bái sè" }, breakdown: { japanese: [{ char: "し", rom: "shi" },{ char: "ろ", rom: "ro", meaning: "color" }], korean: [{ char: "흰", rom: "huin", meaning: "white" },{ char: "색", rom: "saek", meaning: "color" }], mandarin: [{ char: "白", rom: "bái", meaning: "white" },{ char: "色", rom: "sè", meaning: "color" }] } },
  { cat: "Colors", english: "Black", japanese: "くろ", korean: "검은색", mandarin: "黑色", romanization: { japanese: "kuro", korean: "geomeunsaek", mandarin: "hēi sè" }, breakdown: { japanese: [{ char: "く", rom: "ku" },{ char: "ろ", rom: "ro", meaning: "color" }], korean: [{ char: "검", rom: "geom", meaning: "black" },{ char: "은", rom: "eun" },{ char: "색", rom: "saek", meaning: "color" }], mandarin: [{ char: "黑", rom: "hēi", meaning: "black" },{ char: "色", rom: "sè", meaning: "color" }] } },
  { cat: "Colors", english: "Brown", japanese: "ちゃいろ", korean: "갈색", mandarin: "棕色", romanization: { japanese: "chairo", korean: "galsaek", mandarin: "zōng sè" }, breakdown: { japanese: [{ char: "ち", rom: "cha" },{ char: "ゃ", rom: "" },{ char: "い", rom: "i" },{ char: "ろ", rom: "ro", meaning: "color" }], korean: [{ char: "갈", rom: "gal", meaning: "brown" },{ char: "색", rom: "saek", meaning: "color" }], mandarin: [{ char: "棕", rom: "zōng", meaning: "brown" },{ char: "色", rom: "sè", meaning: "color" }] } },

  // PHRASES (5 new)
  { cat: "Phrases", english: "You're welcome", japanese: "どういたしまして", korean: "천만에요", mandarin: "不客气", romanization: { japanese: "douitashimashite", korean: "cheonmaneyo", mandarin: "bù kè qi" }, breakdown: { japanese: [{ char: "ど", rom: "do" },{ char: "う", rom: "u" },{ char: "い", rom: "i" },{ char: "た", rom: "ta" },{ char: "し", rom: "shi" },{ char: "ま", rom: "ma" },{ char: "し", rom: "shi" },{ char: "て", rom: "te" }], korean: [{ char: "천", rom: "cheon" },{ char: "만", rom: "man" },{ char: "에", rom: "e" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "不", rom: "bù", meaning: "not" },{ char: "客", rom: "kè", meaning: "guest" },{ char: "气", rom: "qi", meaning: "manner" }] } },
  { cat: "Phrases", english: "How old are you?", japanese: "なんさいですか", korean: "몇 살이에요?", mandarin: "你几岁?", romanization: { japanese: "nansai desu ka", korean: "myeot sarieyo?", mandarin: "nǐ jǐ suì?" }, breakdown: { japanese: [{ char: "な", rom: "na" },{ char: "ん", rom: "n", meaning: "what" },{ char: "さ", rom: "sa" },{ char: "い", rom: "i", meaning: "age" },{ char: "で", rom: "de" },{ char: "す", rom: "su", meaning: "is" },{ char: "か", rom: "ka", meaning: "question" }], korean: [{ char: "몇", rom: "myeot", meaning: "how many" },{ char: "살", rom: "sal", meaning: "age" },{ char: "이", rom: "i" },{ char: "에", rom: "e" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "你", rom: "nǐ", meaning: "you" },{ char: "几", rom: "jǐ", meaning: "how many" },{ char: "岁", rom: "suì", meaning: "year of age" }] } },
  { cat: "Phrases", english: "Can I have...", japanese: "...をください", korean: "...주세요", mandarin: "我可以要...", romanization: { japanese: "...o kudasai", korean: "...juseyo", mandarin: "wǒ kě yǐ yào..." }, breakdown: { japanese: [{ char: "を", rom: "o", meaning: "object" },{ char: "く", rom: "ku" },{ char: "だ", rom: "da" },{ char: "さ", rom: "sa" },{ char: "い", rom: "i", meaning: "please give" }], korean: [{ char: "주", rom: "ju", meaning: "give" },{ char: "세", rom: "se" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "我", rom: "wǒ", meaning: "I" },{ char: "可", rom: "kě", meaning: "can" },{ char: "以", rom: "yǐ" },{ char: "要", rom: "yào", meaning: "want" }] } },
  { cat: "Phrases", english: "I'm sorry", japanese: "ごめんなさい", korean: "미안해요", mandarin: "对不起", romanization: { japanese: "gomennasai", korean: "mianhaeyo", mandarin: "duì bu qǐ" }, breakdown: { japanese: [{ char: "ご", rom: "go", meaning: "polite" },{ char: "め", rom: "me" },{ char: "ん", rom: "n", meaning: "forgive" },{ char: "な", rom: "na" },{ char: "さ", rom: "sa" },{ char: "い", rom: "i" }], korean: [{ char: "미", rom: "mi" },{ char: "안", rom: "an", meaning: "sorry" },{ char: "해", rom: "hae", meaning: "do" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "对", rom: "duì" },{ char: "不", rom: "bu", meaning: "not" },{ char: "起", rom: "qǐ" }] } },
  { cat: "Phrases", english: "More please", japanese: "もっとください", korean: "더 주세요", mandarin: "再来一点", romanization: { japanese: "motto kudasai", korean: "deo juseyo", mandarin: "zài lái yī diǎn" }, breakdown: { japanese: [{ char: "も", rom: "mo" },{ char: "っ", rom: "" },{ char: "と", rom: "to", meaning: "more" },{ char: "く", rom: "ku" },{ char: "だ", rom: "da" },{ char: "さ", rom: "sa" },{ char: "い", rom: "i", meaning: "please" }], korean: [{ char: "더", rom: "deo", meaning: "more" },{ char: "주", rom: "ju", meaning: "give" },{ char: "세", rom: "se" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "再", rom: "zài", meaning: "again" },{ char: "来", rom: "lái", meaning: "come" },{ char: "一", rom: "yī", meaning: "one" },{ char: "点", rom: "diǎn", meaning: "bit" }] } }
];

/**
 * Per-card kanji overlay — keyed by `english` for stability. Only includes
 * cards where the kanji form is the standard everyday written form in modern
 * Japanese. Cards not in this map remain kana-only.
 */
const KANJI_OVERLAY: Record<string, { kanji: string; kanjiBreakdown: BreakdownItem[] }> = {
  // FAMILY
  "Mother / Mom":   { kanji: "お母さん",   kanjiBreakdown: [{ char: "お", rom: "o", meaning: "polite" },{ char: "母", rom: "kaa", meaning: "mother" },{ char: "さ", rom: "sa" },{ char: "ん", rom: "n" }] },
  "Father / Dad":   { kanji: "お父さん",   kanjiBreakdown: [{ char: "お", rom: "o", meaning: "polite" },{ char: "父", rom: "tou", meaning: "father" },{ char: "さ", rom: "sa" },{ char: "ん", rom: "n" }] },
  "Sister":         { kanji: "お姉さん",   kanjiBreakdown: [{ char: "お", rom: "o", meaning: "polite" },{ char: "姉", rom: "nee", meaning: "older sister" },{ char: "さ", rom: "sa" },{ char: "ん", rom: "n" }] },
  "Brother":        { kanji: "お兄さん",   kanjiBreakdown: [{ char: "お", rom: "o", meaning: "polite" },{ char: "兄", rom: "nii", meaning: "older brother" },{ char: "さ", rom: "sa" },{ char: "ん", rom: "n" }] },
  "Love":           { kanji: "愛",         kanjiBreakdown: [{ char: "愛", rom: "ai", meaning: "love" }] },
  "I love you":     { kanji: "愛してる",   kanjiBreakdown: [{ char: "愛", rom: "ai", meaning: "love" },{ char: "し", rom: "shi" },{ char: "て", rom: "te" },{ char: "る", rom: "ru" }] },

  // FEELINGS
  "Tired":          { kanji: "疲れた",     kanjiBreakdown: [{ char: "疲", rom: "tsuka", meaning: "tired" },{ char: "れ", rom: "re" },{ char: "た", rom: "ta", meaning: "past" }] },
  "Big":            { kanji: "大きい",     kanjiBreakdown: [{ char: "大", rom: "oo", meaning: "big" },{ char: "き", rom: "ki" },{ char: "い", rom: "i" }] },
  "Small":          { kanji: "小さい",     kanjiBreakdown: [{ char: "小", rom: "chii", meaning: "small" },{ char: "さ", rom: "sa" },{ char: "い", rom: "i" }] },

  // FOOD
  "Water":          { kanji: "水",         kanjiBreakdown: [{ char: "水", rom: "mizu", meaning: "water" }] },
  "Rice":           { kanji: "ご飯",       kanjiBreakdown: [{ char: "ご", rom: "go", meaning: "polite" },{ char: "飯", rom: "han", meaning: "meal/rice" }] },
  "Milk":           { kanji: "牛乳",       kanjiBreakdown: [{ char: "牛", rom: "gyuu", meaning: "cow" },{ char: "乳", rom: "nyuu", meaning: "milk" }] },
  "Fruit":          { kanji: "果物",       kanjiBreakdown: [{ char: "果", rom: "kuda", meaning: "fruit" },{ char: "物", rom: "mono", meaning: "thing" }] },

  // ANIMALS
  "Cat":            { kanji: "猫",         kanjiBreakdown: [{ char: "猫", rom: "neko", meaning: "cat" }] },
  "Dog":            { kanji: "犬",         kanjiBreakdown: [{ char: "犬", rom: "inu", meaning: "dog" }] },
  "Fish":           { kanji: "魚",         kanjiBreakdown: [{ char: "魚", rom: "sakana", meaning: "fish" }] },
  "Bird":           { kanji: "鳥",         kanjiBreakdown: [{ char: "鳥", rom: "tori", meaning: "bird" }] },

  // SCHOOL
  "School":         { kanji: "学校",       kanjiBreakdown: [{ char: "学", rom: "gak", meaning: "learn" },{ char: "校", rom: "kou", meaning: "school" }] },
  "Book":           { kanji: "本",         kanjiBreakdown: [{ char: "本", rom: "hon", meaning: "book" }] },
  "Teacher":        { kanji: "先生",       kanjiBreakdown: [{ char: "先", rom: "sen", meaning: "first" },{ char: "生", rom: "sei", meaning: "life/born" }] },
  "Friend":         { kanji: "友達",       kanjiBreakdown: [{ char: "友", rom: "tomo", meaning: "friend" },{ char: "達", rom: "dachi", meaning: "plural" }] },

  // NUMBERS
  "One":            { kanji: "一",         kanjiBreakdown: [{ char: "一", rom: "ichi", meaning: "one" }] },
  "Two":            { kanji: "二",         kanjiBreakdown: [{ char: "二", rom: "ni", meaning: "two" }] },
  "Three":          { kanji: "三",         kanjiBreakdown: [{ char: "三", rom: "san", meaning: "three" }] },
  "Four":           { kanji: "四",         kanjiBreakdown: [{ char: "四", rom: "yon", meaning: "four" }] },
  "Five":           { kanji: "五",         kanjiBreakdown: [{ char: "五", rom: "go", meaning: "five" }] },

  // COLORS
  "Red":            { kanji: "赤",         kanjiBreakdown: [{ char: "赤", rom: "aka", meaning: "red" }] },
  "Blue":           { kanji: "青",         kanjiBreakdown: [{ char: "青", rom: "ao", meaning: "blue" }] },
  "Yellow":         { kanji: "黄色",       kanjiBreakdown: [{ char: "黄", rom: "ki", meaning: "yellow" },{ char: "色", rom: "iro", meaning: "color" }] },
  "Green":          { kanji: "緑",         kanjiBreakdown: [{ char: "緑", rom: "midori", meaning: "green" }] },

  // PHRASES
  "Happy Birthday":     { kanji: "お誕生日おめでとう", kanjiBreakdown: [{ char: "お", rom: "o", meaning: "polite" },{ char: "誕", rom: "tan", meaning: "birth" },{ char: "生", rom: "jou", meaning: "life" },{ char: "日", rom: "bi", meaning: "day" },{ char: "お", rom: "o", meaning: "polite" },{ char: "め", rom: "me" },{ char: "で", rom: "de" },{ char: "と", rom: "to" },{ char: "う", rom: "u" }] },
  "How are you?":       { kanji: "お元気ですか",     kanjiBreakdown: [{ char: "お", rom: "o", meaning: "polite" },{ char: "元", rom: "gen", meaning: "origin" },{ char: "気", rom: "ki", meaning: "spirit" },{ char: "で", rom: "de" },{ char: "す", rom: "su" },{ char: "か", rom: "ka", meaning: "?" }] },
  "My name is...":      { kanji: "私は...です",      kanjiBreakdown: [{ char: "私", rom: "watashi", meaning: "I/me" },{ char: "は", rom: "wa", meaning: "topic" },{ char: "で", rom: "de" },{ char: "す", rom: "su", meaning: "is" }] },
  "What is this?":      { kanji: "これは何ですか",   kanjiBreakdown: [{ char: "こ", rom: "ko" },{ char: "れ", rom: "re", meaning: "this" },{ char: "は", rom: "wa", meaning: "topic" },{ char: "何", rom: "nan", meaning: "what" },{ char: "で", rom: "de" },{ char: "す", rom: "su", meaning: "is" },{ char: "か", rom: "ka", meaning: "?" }] },
  "I don't understand": { kanji: "分かりません",     kanjiBreakdown: [{ char: "分", rom: "wa", meaning: "understand" },{ char: "か", rom: "ka" },{ char: "り", rom: "ri" },{ char: "ま", rom: "ma" },{ char: "せ", rom: "se" },{ char: "ん", rom: "n", meaning: "not" }] },

  // NUMBERS 6–30
  "Six":            { kanji: "六",         kanjiBreakdown: [{ char: "六", rom: "roku", meaning: "six" }] },
  "Seven":          { kanji: "七",         kanjiBreakdown: [{ char: "七", rom: "nana", meaning: "seven" }] },
  "Eight":          { kanji: "八",         kanjiBreakdown: [{ char: "八", rom: "hachi", meaning: "eight" }] },
  "Nine":           { kanji: "九",         kanjiBreakdown: [{ char: "九", rom: "kyuu", meaning: "nine" }] },
  "Ten":            { kanji: "十",         kanjiBreakdown: [{ char: "十", rom: "juu", meaning: "ten" }] },
  "Eleven":         { kanji: "十一",       kanjiBreakdown: [{ char: "十", rom: "juu", meaning: "ten" },{ char: "一", rom: "ichi", meaning: "one" }] },
  "Twelve":         { kanji: "十二",       kanjiBreakdown: [{ char: "十", rom: "juu", meaning: "ten" },{ char: "二", rom: "ni", meaning: "two" }] },
  "Thirteen":       { kanji: "十三",       kanjiBreakdown: [{ char: "十", rom: "juu", meaning: "ten" },{ char: "三", rom: "san", meaning: "three" }] },
  "Twenty":         { kanji: "二十",       kanjiBreakdown: [{ char: "二", rom: "ni", meaning: "two" },{ char: "十", rom: "juu", meaning: "ten" }] },
  "Thirty":         { kanji: "三十",       kanjiBreakdown: [{ char: "三", rom: "san", meaning: "three" },{ char: "十", rom: "juu", meaning: "ten" }] },
  "One person":     { kanji: "一人",       kanjiBreakdown: [{ char: "一", rom: "hito", meaning: "one" },{ char: "人", rom: "ri", meaning: "person" }] },
  "Two people":     { kanji: "二人",       kanjiBreakdown: [{ char: "二", rom: "futa", meaning: "two" },{ char: "人", rom: "ri", meaning: "person" }] },
  "One thing":      { kanji: "一つ",       kanjiBreakdown: [{ char: "一", rom: "hito", meaning: "one" },{ char: "つ", rom: "tsu", meaning: "counter" }] },
  "Two things":     { kanji: "二つ",       kanjiBreakdown: [{ char: "二", rom: "futa", meaning: "two" },{ char: "つ", rom: "tsu", meaning: "counter" }] },

  // ANIMALS (additional)
  "Horse":          { kanji: "馬",         kanjiBreakdown: [{ char: "馬", rom: "uma", meaning: "horse" }] },
  "Cow":            { kanji: "牛",         kanjiBreakdown: [{ char: "牛", rom: "ushi", meaning: "cow" }] },
  "Pig":            { kanji: "豚",         kanjiBreakdown: [{ char: "豚", rom: "buta", meaning: "pig" }] },
  "Elephant":       { kanji: "象",         kanjiBreakdown: [{ char: "象", rom: "zou", meaning: "elephant" }] },
  "Tiger":          { kanji: "虎",         kanjiBreakdown: [{ char: "虎", rom: "tora", meaning: "tiger" }] },

  // FOOD (additional)
  "Egg":            { kanji: "卵",         kanjiBreakdown: [{ char: "卵", rom: "tamago", meaning: "egg" }] },
  "Noodles":        { kanji: "麺",         kanjiBreakdown: [{ char: "麺", rom: "men", meaning: "noodles" }] },
  "Tea":            { kanji: "お茶",       kanjiBreakdown: [{ char: "お", rom: "o", meaning: "polite" },{ char: "茶", rom: "cha", meaning: "tea" }] },

  // FEELINGS (additional)
  "Angry":          { kanji: "怒ってる",   kanjiBreakdown: [{ char: "怒", rom: "oko", meaning: "angry" },{ char: "っ", rom: "t" },{ char: "て", rom: "te" },{ char: "る", rom: "ru" }] },
  "Scared":         { kanji: "怖い",       kanjiBreakdown: [{ char: "怖", rom: "kowa", meaning: "scared" },{ char: "い", rom: "i" }] },
  "Hot":            { kanji: "暑い",       kanjiBreakdown: [{ char: "暑", rom: "atsu", meaning: "hot" },{ char: "い", rom: "i" }] },
  "Cold":           { kanji: "寒い",       kanjiBreakdown: [{ char: "寒", rom: "samu", meaning: "cold" },{ char: "い", rom: "i" }] },
  "Fast":           { kanji: "速い",       kanjiBreakdown: [{ char: "速", rom: "haya", meaning: "fast" },{ char: "い", rom: "i" }] },
  "Slow":           { kanji: "遅い",       kanjiBreakdown: [{ char: "遅", rom: "oso", meaning: "slow" },{ char: "い", rom: "i" }] },
  "New":            { kanji: "新しい",     kanjiBreakdown: [{ char: "新", rom: "atara", meaning: "new" },{ char: "し", rom: "shi" },{ char: "い", rom: "i" }] },
  "Old":            { kanji: "古い",       kanjiBreakdown: [{ char: "古", rom: "furu", meaning: "old" },{ char: "い", rom: "i" }] },

  // BODY
  "Eyes":           { kanji: "目",         kanjiBreakdown: [{ char: "目", rom: "me", meaning: "eye" }] },
  "Ears":           { kanji: "耳",         kanjiBreakdown: [{ char: "耳", rom: "mimi", meaning: "ear" }] },
  "Nose":           { kanji: "鼻",         kanjiBreakdown: [{ char: "鼻", rom: "hana", meaning: "nose" }] },
  "Mouth":          { kanji: "口",         kanjiBreakdown: [{ char: "口", rom: "kuchi", meaning: "mouth" }] },
  "Hands":          { kanji: "手",         kanjiBreakdown: [{ char: "手", rom: "te", meaning: "hand" }] },
  "Feet":           { kanji: "足",         kanjiBreakdown: [{ char: "足", rom: "ashi", meaning: "foot" }] },
  "Head":           { kanji: "頭",         kanjiBreakdown: [{ char: "頭", rom: "atama", meaning: "head" }] },
  "Hair":           { kanji: "髪",         kanjiBreakdown: [{ char: "髪", rom: "kami", meaning: "hair" }] },

  // TIME
  "Today":          { kanji: "今日",       kanjiBreakdown: [{ char: "今", rom: "kyo", meaning: "now" },{ char: "日", rom: "u", meaning: "day" }] },
  "Tomorrow":       { kanji: "明日",       kanjiBreakdown: [{ char: "明", rom: "ashi", meaning: "next" },{ char: "日", rom: "ta", meaning: "day" }] },
  "Yesterday":      { kanji: "昨日",       kanjiBreakdown: [{ char: "昨", rom: "ki", meaning: "previous" },{ char: "日", rom: "nou", meaning: "day" }] },
  "Morning":        { kanji: "朝",         kanjiBreakdown: [{ char: "朝", rom: "asa", meaning: "morning" }] },
  "Night":          { kanji: "夜",         kanjiBreakdown: [{ char: "夜", rom: "yoru", meaning: "night" }] },
  "Week":           { kanji: "週",         kanjiBreakdown: [{ char: "週", rom: "shuu", meaning: "week" }] },
  "Month":          { kanji: "月",         kanjiBreakdown: [{ char: "月", rom: "tsuki", meaning: "month/moon" }] },
  "Year":           { kanji: "年",         kanjiBreakdown: [{ char: "年", rom: "toshi", meaning: "year" }] },

  // ACTIONS
  "Eat":            { kanji: "食べる",     kanjiBreakdown: [{ char: "食", rom: "ta", meaning: "eat" },{ char: "べ", rom: "be" },{ char: "る", rom: "ru" }] },
  "Drink":          { kanji: "飲む",       kanjiBreakdown: [{ char: "飲", rom: "no", meaning: "drink" },{ char: "む", rom: "mu" }] },
  "Sleep":          { kanji: "寝る",       kanjiBreakdown: [{ char: "寝", rom: "ne", meaning: "sleep" },{ char: "る", rom: "ru" }] },
  "Run":            { kanji: "走る",       kanjiBreakdown: [{ char: "走", rom: "hashi", meaning: "run" },{ char: "る", rom: "ru" }] },
  "Walk":           { kanji: "歩く",       kanjiBreakdown: [{ char: "歩", rom: "aru", meaning: "walk" },{ char: "く", rom: "ku" }] },
  "Read":           { kanji: "読む",       kanjiBreakdown: [{ char: "読", rom: "yo", meaning: "read" },{ char: "む", rom: "mu" }] },
  "Write":          { kanji: "書く",       kanjiBreakdown: [{ char: "書", rom: "ka", meaning: "write" },{ char: "く", rom: "ku" }] },
  "Sing":           { kanji: "歌う",       kanjiBreakdown: [{ char: "歌", rom: "uta", meaning: "song" },{ char: "う", rom: "u" }] },

  // WEATHER
  "Sunny":          { kanji: "晴れ",       kanjiBreakdown: [{ char: "晴", rom: "ha", meaning: "clear" },{ char: "れ", rom: "re" }] },
  "Rainy":          { kanji: "雨",         kanjiBreakdown: [{ char: "雨", rom: "ame", meaning: "rain" }] },
  "Cloudy":         { kanji: "曇り",       kanjiBreakdown: [{ char: "曇", rom: "kumo", meaning: "cloud" },{ char: "り", rom: "ri" }] },
  "Snowy":          { kanji: "雪",         kanjiBreakdown: [{ char: "雪", rom: "yuki", meaning: "snow" }] },
  "Windy":          { kanji: "風",         kanjiBreakdown: [{ char: "風", rom: "kaze", meaning: "wind" }] },

  // TRANSPORT
  "Car":            { kanji: "車",         kanjiBreakdown: [{ char: "車", rom: "kuruma", meaning: "car" }] },
  "Train":          { kanji: "電車",       kanjiBreakdown: [{ char: "電", rom: "den", meaning: "electric" },{ char: "車", rom: "sha", meaning: "vehicle" }] },
  "Plane":          { kanji: "飛行機",     kanjiBreakdown: [{ char: "飛", rom: "hi", meaning: "fly" },{ char: "行", rom: "kou", meaning: "go" },{ char: "機", rom: "ki", meaning: "machine" }] },
  "Bike":           { kanji: "自転車",     kanjiBreakdown: [{ char: "自", rom: "ji", meaning: "self" },{ char: "転", rom: "ten" },{ char: "車", rom: "sha", meaning: "vehicle" }] },
  "Boat":           { kanji: "船",         kanjiBreakdown: [{ char: "船", rom: "fune", meaning: "boat" }] },
};

// Merge kanji overlay into flashcards
for (const card of flashcards) {
  const overlay = KANJI_OVERLAY[card.english];
  if (overlay) {
    card.kanji = overlay.kanji;
    card.kanjiBreakdown = overlay.kanjiBreakdown;
  }
}

/**
 * Per-card translations for Spanish / French / German keyed by `english`.
 * Each entry: word + kid-readable phonetic pronunciation.
 * Translations are best-effort modern everyday usage targeting a kid audience.
 */
type Translation = { word: string; phon: string };
type LatinRow = { spanish: Translation; french: Translation; german: Translation };

const LATIN_TRANSLATIONS: Record<string, LatinRow> = {
  // GREETINGS & BASICS
  "Hello":              { spanish: { word: "Hola",                phon: "OH-lah" },            french: { word: "Bonjour",              phon: "bohn-ZHOOR" },      german: { word: "Hallo",                  phon: "HAH-loh" } },
  "Thank you":          { spanish: { word: "Gracias",             phon: "GRAH-syahs" },        french: { word: "Merci",                phon: "mehr-SEE" },        german: { word: "Danke",                  phon: "DAHN-keh" } },
  "Good morning":       { spanish: { word: "Buenos días",         phon: "BWAY-nohs DEE-ahs" }, french: { word: "Bonjour",              phon: "bohn-ZHOOR" },      german: { word: "Guten Morgen",           phon: "GOO-ten MOR-gen" } },
  "Good night":         { spanish: { word: "Buenas noches",       phon: "BWAY-nahs NOH-chess" },french: { word: "Bonne nuit",          phon: "bun NWEE" },        german: { word: "Gute Nacht",             phon: "GOO-teh nahkt" } },
  "Goodbye":            { spanish: { word: "Adiós",               phon: "ah-DYOHS" },          french: { word: "Au revoir",            phon: "oh ruh-VWAHR" },    german: { word: "Auf Wiedersehen",        phon: "owf VEE-der-zayn" } },
  "Please":             { spanish: { word: "Por favor",           phon: "por fah-VOR" },       french: { word: "S'il vous plaît",      phon: "seel voo PLEH" },   german: { word: "Bitte",                  phon: "BIH-teh" } },
  "Excuse me / Sorry":  { spanish: { word: "Perdón",              phon: "pehr-DOHN" },         french: { word: "Pardon",               phon: "par-DOHN" },        german: { word: "Entschuldigung",         phon: "ent-SHOOL-dee-goong" } },
  "Yes":                { spanish: { word: "Sí",                  phon: "SEE" },               french: { word: "Oui",                  phon: "WEE" },             german: { word: "Ja",                     phon: "YAH" } },
  "No":                 { spanish: { word: "No",                  phon: "NOH" },               french: { word: "Non",                  phon: "NOHN" },            german: { word: "Nein",                   phon: "NINE" } },

  // FAMILY
  "Mother / Mom":       { spanish: { word: "Mamá",                phon: "mah-MAH" },           french: { word: "Maman",                phon: "mah-MAHN" },        german: { word: "Mama",                   phon: "MAH-mah" } },
  "Father / Dad":       { spanish: { word: "Papá",                phon: "pah-PAH" },           french: { word: "Papa",                 phon: "pah-PAH" },         german: { word: "Papa",                   phon: "PAH-pah" } },
  "Sister":             { spanish: { word: "Hermana",             phon: "ehr-MAH-nah" },       french: { word: "Sœur",                 phon: "SUR" },             german: { word: "Schwester",              phon: "SHVES-ter" } },
  "Brother":            { spanish: { word: "Hermano",             phon: "ehr-MAH-noh" },       french: { word: "Frère",                phon: "FREHR" },           german: { word: "Bruder",                 phon: "BROO-der" } },
  "Grandmother":        { spanish: { word: "Abuela",              phon: "ah-BWAY-lah" },       french: { word: "Grand-mère",           phon: "grahn-MEHR" },      german: { word: "Oma",                    phon: "OH-mah" } },
  "Grandfather":        { spanish: { word: "Abuelo",              phon: "ah-BWAY-loh" },       french: { word: "Grand-père",           phon: "grahn-PEHR" },      german: { word: "Opa",                    phon: "OH-pah" } },
  "Love":               { spanish: { word: "Amor",                phon: "ah-MOR" },            french: { word: "Amour",                phon: "ah-MOOR" },         german: { word: "Liebe",                  phon: "LEE-beh" } },
  "I love you":         { spanish: { word: "Te quiero",           phon: "teh kee-AIR-oh" },    french: { word: "Je t'aime",            phon: "zhuh TEM" },        german: { word: "Ich liebe dich",         phon: "ikh LEE-beh dikh" } },

  // FEELINGS
  "Happy":              { spanish: { word: "Feliz",               phon: "feh-LEES" },          french: { word: "Heureux",              phon: "uh-RUH" },          german: { word: "Glücklich",              phon: "GLOOK-likh" } },
  "Sad":                { spanish: { word: "Triste",              phon: "TREES-teh" },         french: { word: "Triste",               phon: "TREEST" },          german: { word: "Traurig",                phon: "TROW-rikh" } },
  "Hungry":             { spanish: { word: "Tengo hambre",        phon: "TEN-goh AHM-breh" },  french: { word: "J'ai faim",            phon: "zhay FAHM" },       german: { word: "Hunger",                 phon: "HOON-ger" } },
  "Tired":              { spanish: { word: "Cansado",             phon: "kahn-SAH-doh" },      french: { word: "Fatigué",              phon: "fah-tee-GAY" },     german: { word: "Müde",                   phon: "MUE-deh" } },
  "Big":                { spanish: { word: "Grande",              phon: "GRAHN-deh" },         french: { word: "Grand",                phon: "GRAHN" },           german: { word: "Groß",                   phon: "GROHS" } },
  "Small":              { spanish: { word: "Pequeño",             phon: "peh-KEH-nyoh" },      french: { word: "Petit",                phon: "puh-TEE" },         german: { word: "Klein",                  phon: "KLINE" } },
  "Beautiful":          { spanish: { word: "Hermoso",             phon: "ehr-MOH-soh" },       french: { word: "Beau",                 phon: "BOH" },             german: { word: "Schön",                  phon: "SHURN" } },
  "Angry":              { spanish: { word: "Enojado",             phon: "eh-noh-HAH-doh" },    french: { word: "Fâché",                phon: "fah-SHAY" },        german: { word: "Wütend",                 phon: "VUE-tend" } },
  "Scared":             { spanish: { word: "Asustado",            phon: "ah-soos-TAH-doh" },   french: { word: "Effrayé",              phon: "eh-fray-YAY" },     german: { word: "Ängstlich",              phon: "ENGST-likh" } },
  "Hot":                { spanish: { word: "Caliente",            phon: "kah-LYEN-teh" },      french: { word: "Chaud",                phon: "SHOH" },            german: { word: "Heiß",                   phon: "HICE" } },
  "Cold":               { spanish: { word: "Frío",                phon: "FREE-oh" },           french: { word: "Froid",                phon: "FRWAH" },           german: { word: "Kalt",                   phon: "KAHLT" } },
  "Fast":               { spanish: { word: "Rápido",              phon: "RAH-pee-doh" },       french: { word: "Rapide",               phon: "rah-PEED" },        german: { word: "Schnell",                phon: "SHNELL" } },
  "Slow":               { spanish: { word: "Lento",               phon: "LEN-toh" },           french: { word: "Lent",                 phon: "LAHN" },            german: { word: "Langsam",                phon: "LAHNG-zahm" } },
  "New":                { spanish: { word: "Nuevo",               phon: "NWAY-voh" },          french: { word: "Nouveau",              phon: "noo-VOH" },         german: { word: "Neu",                    phon: "NOY" } },
  "Old":                { spanish: { word: "Viejo",               phon: "VYEH-hoh" },          french: { word: "Vieux",                phon: "VYUH" },            german: { word: "Alt",                    phon: "AHLT" } },

  // FOOD
  "Water":              { spanish: { word: "Agua",                phon: "AH-gwah" },           french: { word: "Eau",                  phon: "OH" },              german: { word: "Wasser",                 phon: "VAH-ser" } },
  "Rice":               { spanish: { word: "Arroz",               phon: "ah-ROHS" },           french: { word: "Riz",                  phon: "REE" },             german: { word: "Reis",                   phon: "RICE" } },
  "Milk":               { spanish: { word: "Leche",               phon: "LEH-cheh" },          french: { word: "Lait",                 phon: "LEH" },             german: { word: "Milch",                  phon: "MILKH" } },
  "Fruit":              { spanish: { word: "Fruta",               phon: "FROO-tah" },          french: { word: "Fruit",                phon: "FRWEE" },           german: { word: "Obst",                   phon: "OHPST" } },
  "Delicious":          { spanish: { word: "Delicioso",           phon: "deh-lee-SYOH-soh" },  french: { word: "Délicieux",            phon: "day-lee-SYUH" },    german: { word: "Lecker",                 phon: "LEH-ker" } },
  "Bread":              { spanish: { word: "Pan",                 phon: "PAHN" },              french: { word: "Pain",                 phon: "PAHN" },            german: { word: "Brot",                   phon: "BROHT" } },
  "Egg":                { spanish: { word: "Huevo",               phon: "WAY-voh" },           french: { word: "Œuf",                  phon: "UF" },              german: { word: "Ei",                     phon: "EYE" } },
  "Apple":              { spanish: { word: "Manzana",             phon: "mahn-SAH-nah" },      french: { word: "Pomme",                phon: "POHM" },            german: { word: "Apfel",                  phon: "AHP-fel" } },
  "Banana":             { spanish: { word: "Plátano",             phon: "PLAH-tah-noh" },      french: { word: "Banane",               phon: "bah-NAHN" },        german: { word: "Banane",                 phon: "bah-NAH-neh" } },
  "Noodles":            { spanish: { word: "Fideos",              phon: "fee-DAY-ohs" },       french: { word: "Nouilles",             phon: "NWEE" },            german: { word: "Nudeln",                 phon: "NOO-deln" } },
  "Soup":               { spanish: { word: "Sopa",                phon: "SOH-pah" },           french: { word: "Soupe",                phon: "SOOP" },            german: { word: "Suppe",                  phon: "ZOO-peh" } },
  "Tea":                { spanish: { word: "Té",                  phon: "TAY" },               french: { word: "Thé",                  phon: "TAY" },             german: { word: "Tee",                    phon: "TAY" } },
  "Cake":               { spanish: { word: "Pastel",              phon: "pahs-TEL" },          french: { word: "Gâteau",               phon: "gah-TOH" },         german: { word: "Kuchen",                 phon: "KOO-khen" } },

  // ANIMALS
  "Cat":                { spanish: { word: "Gato",                phon: "GAH-toh" },           french: { word: "Chat",                 phon: "SHAH" },            german: { word: "Katze",                  phon: "KAHT-zeh" } },
  "Dog":                { spanish: { word: "Perro",               phon: "PEH-roh" },           french: { word: "Chien",                phon: "SHYEN" },           german: { word: "Hund",                   phon: "HOONT" } },
  "Fish":               { spanish: { word: "Pez",                 phon: "PES" },               french: { word: "Poisson",              phon: "pwah-SOHN" },       german: { word: "Fisch",                  phon: "FISH" } },
  "Bird":               { spanish: { word: "Pájaro",              phon: "PAH-hah-roh" },       french: { word: "Oiseau",               phon: "wah-ZOH" },         german: { word: "Vogel",                  phon: "FOH-gel" } },
  "Horse":              { spanish: { word: "Caballo",             phon: "kah-BAH-yoh" },       french: { word: "Cheval",               phon: "shuh-VAHL" },       german: { word: "Pferd",                  phon: "PFEHRT" } },
  "Cow":                { spanish: { word: "Vaca",                phon: "VAH-kah" },           french: { word: "Vache",                phon: "VAHSH" },           german: { word: "Kuh",                    phon: "KOO" } },
  "Pig":                { spanish: { word: "Cerdo",               phon: "SEHR-doh" },          french: { word: "Cochon",               phon: "koh-SHOHN" },       german: { word: "Schwein",                phon: "SHVINE" } },
  "Rabbit":             { spanish: { word: "Conejo",              phon: "koh-NEH-hoh" },       french: { word: "Lapin",                phon: "lah-PAHN" },        german: { word: "Hase",                   phon: "HAH-zeh" } },
  "Mouse":              { spanish: { word: "Ratón",               phon: "rah-TOHN" },          french: { word: "Souris",               phon: "soo-REE" },         german: { word: "Maus",                   phon: "MOWS" } },
  "Elephant":           { spanish: { word: "Elefante",            phon: "eh-leh-FAHN-teh" },   french: { word: "Éléphant",             phon: "ay-lay-FAHN" },     german: { word: "Elefant",                phon: "eh-leh-FAHNT" } },
  "Lion":               { spanish: { word: "León",                phon: "leh-OHN" },           french: { word: "Lion",                 phon: "lee-OHN" },         german: { word: "Löwe",                   phon: "LUR-veh" } },
  "Tiger":              { spanish: { word: "Tigre",               phon: "TEE-greh" },          french: { word: "Tigre",                phon: "TEE-gruh" },        german: { word: "Tiger",                  phon: "TEE-ger" } },

  // SCHOOL
  "School":             { spanish: { word: "Escuela",             phon: "es-KWAY-lah" },       french: { word: "École",                phon: "ay-KOHL" },         german: { word: "Schule",                 phon: "SHOO-leh" } },
  "Book":               { spanish: { word: "Libro",               phon: "LEE-broh" },          french: { word: "Livre",                phon: "LEE-vruh" },        german: { word: "Buch",                   phon: "BOOKH" } },
  "Teacher":            { spanish: { word: "Maestro",             phon: "mah-ES-troh" },       french: { word: "Maître",               phon: "MEHT-ruh" },        german: { word: "Lehrer",                 phon: "LEH-rer" } },
  "Friend":             { spanish: { word: "Amigo",               phon: "ah-MEE-goh" },        french: { word: "Ami",                  phon: "ah-MEE" },          german: { word: "Freund",                 phon: "FROYNT" } },

  // NUMBERS
  "One":                { spanish: { word: "Uno",                 phon: "OO-noh" },            french: { word: "Un",                   phon: "UHN" },             german: { word: "Eins",                   phon: "INES" } },
  "Two":                { spanish: { word: "Dos",                 phon: "DOHS" },              french: { word: "Deux",                 phon: "DUH" },             german: { word: "Zwei",                   phon: "TSVY" } },
  "Three":              { spanish: { word: "Tres",                phon: "TRESS" },             french: { word: "Trois",                phon: "TRWAH" },           german: { word: "Drei",                   phon: "DRY" } },
  "Four":               { spanish: { word: "Cuatro",              phon: "KWAH-troh" },         french: { word: "Quatre",               phon: "KAHT-ruh" },        german: { word: "Vier",                   phon: "FEER" } },
  "Five":               { spanish: { word: "Cinco",               phon: "SEEN-koh" },          french: { word: "Cinq",                 phon: "SANK" },            german: { word: "Fünf",                   phon: "FUENF" } },
  "Six":                { spanish: { word: "Seis",                phon: "SAYS" },              french: { word: "Six",                  phon: "SEES" },            german: { word: "Sechs",                  phon: "ZEKS" } },
  "Seven":              { spanish: { word: "Siete",               phon: "SYEH-teh" },          french: { word: "Sept",                 phon: "SET" },             german: { word: "Sieben",                 phon: "ZEE-ben" } },
  "Eight":              { spanish: { word: "Ocho",                phon: "OH-choh" },           french: { word: "Huit",                 phon: "WEET" },            german: { word: "Acht",                   phon: "AHKHT" } },
  "Nine":               { spanish: { word: "Nueve",               phon: "NWAY-veh" },          french: { word: "Neuf",                 phon: "NUF" },             german: { word: "Neun",                   phon: "NOYN" } },
  "Ten":                { spanish: { word: "Diez",                phon: "DYES" },              french: { word: "Dix",                  phon: "DEES" },            german: { word: "Zehn",                   phon: "TSAYN" } },
  "Eleven":             { spanish: { word: "Once",                phon: "OHN-seh" },           french: { word: "Onze",                 phon: "OHNZ" },            german: { word: "Elf",                    phon: "ELF" } },
  "Twelve":             { spanish: { word: "Doce",                phon: "DOH-seh" },           french: { word: "Douze",                phon: "DOOZ" },            german: { word: "Zwölf",                  phon: "TSVOLF" } },
  "Thirteen":           { spanish: { word: "Trece",               phon: "TREH-seh" },          french: { word: "Treize",               phon: "TREZ" },            german: { word: "Dreizehn",               phon: "DRY-tsayn" } },
  "Twenty":             { spanish: { word: "Veinte",              phon: "VAYN-teh" },          french: { word: "Vingt",                phon: "VAHN" },            german: { word: "Zwanzig",                phon: "TSVAHN-tsikh" } },
  "Thirty":             { spanish: { word: "Treinta",             phon: "TRAYN-tah" },         french: { word: "Trente",               phon: "TRAHNT" },          german: { word: "Dreißig",                phon: "DRY-sikh" } },
  "One person":         { spanish: { word: "Una persona",         phon: "OO-nah pehr-SOH-nah" },french: { word: "Une personne",         phon: "uun pair-SUN" },    german: { word: "Eine Person",            phon: "INE-eh pehr-ZOHN" } },
  "Two people":         { spanish: { word: "Dos personas",        phon: "DOHS pehr-SOH-nahs" },french: { word: "Deux personnes",       phon: "DUH pair-SUN" },    german: { word: "Zwei Personen",          phon: "TSVY pehr-ZOH-nen" } },
  "One thing":          { spanish: { word: "Una cosa",            phon: "OO-nah KOH-sah" },    french: { word: "Une chose",            phon: "uun SHOHZ" },       german: { word: "Eine Sache",             phon: "INE-eh ZAH-kheh" } },
  "Two things":         { spanish: { word: "Dos cosas",           phon: "DOHS KOH-sahs" },     french: { word: "Deux choses",          phon: "DUH SHOHZ" },       german: { word: "Zwei Sachen",            phon: "TSVY ZAH-khen" } },

  // COLORS
  "Red":                { spanish: { word: "Rojo",                phon: "ROH-hoh" },           french: { word: "Rouge",                phon: "ROOZH" },           german: { word: "Rot",                    phon: "ROHT" } },
  "Blue":               { spanish: { word: "Azul",                phon: "ah-SOOL" },           french: { word: "Bleu",                 phon: "BLUH" },            german: { word: "Blau",                   phon: "BLOW" } },
  "Yellow":             { spanish: { word: "Amarillo",            phon: "ah-mah-REE-yoh" },    french: { word: "Jaune",                phon: "ZHOHN" },           german: { word: "Gelb",                   phon: "GELP" } },
  "Green":              { spanish: { word: "Verde",               phon: "VEHR-deh" },          french: { word: "Vert",                 phon: "VEHR" },            german: { word: "Grün",                   phon: "GRUEN" } },

  // PHRASES
  "Happy Birthday":     { spanish: { word: "Feliz cumpleaños",    phon: "feh-LEES koom-pleh-AH-nyohs" },french: { word: "Joyeux anniversaire", phon: "zhwah-YUH ah-nee-vehr-SAIR" },german: { word: "Alles Gute zum Geburtstag", phon: "AH-les GOO-teh tsoom ge-BOORTS-tahk" } },
  "How are you?":       { spanish: { word: "¿Cómo estás?",        phon: "KOH-moh es-TAHS" },   french: { word: "Comment ça va ?",      phon: "koh-MAHN sah VAH" },german: { word: "Wie geht's?",            phon: "vee GAYTS" } },
  "My name is...":      { spanish: { word: "Me llamo...",         phon: "may YAH-moh" },       french: { word: "Je m'appelle...",      phon: "zhuh mah-PEL" },    german: { word: "Ich heiße...",           phon: "ikh HICE-eh" } },
  "Nice to meet you":   { spanish: { word: "Mucho gusto",         phon: "MOO-choh GOOS-toh" }, french: { word: "Enchanté",             phon: "ahn-shahn-TAY" },   german: { word: "Freut mich",             phon: "FROYT mikh" } },
  "See you later":      { spanish: { word: "Hasta luego",         phon: "AHS-tah LWAY-goh" },  french: { word: "À plus tard",          phon: "ah PLOO TAR" },     german: { word: "Bis später",             phon: "biss SHPEH-ter" } },
  "Let's eat!":         { spanish: { word: "¡A comer!",           phon: "ah koh-MEHR" },       french: { word: "À table !",            phon: "ah TAH-bluh" },     german: { word: "Lass uns essen!",        phon: "lahss oons ES-en" } },
  "Good job!":          { spanish: { word: "¡Buen trabajo!",      phon: "BWEN trah-BAH-hoh" },french: { word: "Bon travail !",         phon: "bohn trah-VAI" },   german: { word: "Gut gemacht!",           phon: "GOOT ge-MAHKHT" } },
  "What is this?":      { spanish: { word: "¿Qué es esto?",       phon: "kay es ES-toh" },     french: { word: "Qu'est-ce que c'est ?",phon: "kes kuh SEH" },     german: { word: "Was ist das?",           phon: "vahss ist dahss" } },
  "Where is the bathroom?":{ spanish: { word: "¿Dónde está el baño?",phon: "DOHN-deh es-TAH el BAH-nyoh" },french: { word: "Où sont les toilettes ?",phon: "oo sohn lay twah-LET" },german: { word: "Wo ist die Toilette?",    phon: "voh ist dee twa-LET-eh" } },
  "I don't understand": { spanish: { word: "No entiendo",         phon: "noh en-TYEN-doh" },   french: { word: "Je ne comprends pas",  phon: "zhuh nuh kohm-PRAHN pah" },german: { word: "Ich verstehe nicht",    phon: "ikh fehr-SHTAY-eh nikht" } },

  // BODY
  "Eyes":               { spanish: { word: "Ojos",                phon: "OH-hohs" },           french: { word: "Yeux",                 phon: "YUH" },             german: { word: "Augen",                  phon: "OW-gen" } },
  "Ears":               { spanish: { word: "Orejas",              phon: "oh-REH-hahs" },       french: { word: "Oreilles",             phon: "oh-RAY" },          german: { word: "Ohren",                  phon: "OH-ren" } },
  "Nose":               { spanish: { word: "Nariz",               phon: "nah-REES" },          french: { word: "Nez",                  phon: "NAY" },             german: { word: "Nase",                   phon: "NAH-zeh" } },
  "Mouth":              { spanish: { word: "Boca",                phon: "BOH-kah" },           french: { word: "Bouche",               phon: "BOOSH" },           german: { word: "Mund",                   phon: "MOONT" } },
  "Hands":              { spanish: { word: "Manos",               phon: "MAH-nohs" },          french: { word: "Mains",                phon: "MAHN" },            german: { word: "Hände",                  phon: "HEN-deh" } },
  "Feet":               { spanish: { word: "Pies",                phon: "PYES" },              french: { word: "Pieds",                phon: "PYAY" },            german: { word: "Füße",                   phon: "FUE-seh" } },
  "Head":               { spanish: { word: "Cabeza",              phon: "kah-BEH-sah" },       french: { word: "Tête",                 phon: "TET" },             german: { word: "Kopf",                   phon: "KOHPF" } },
  "Hair":               { spanish: { word: "Pelo",                phon: "PEH-loh" },           french: { word: "Cheveux",              phon: "shuh-VUH" },        german: { word: "Haare",                  phon: "HAH-reh" } },

  // TIME
  "Today":              { spanish: { word: "Hoy",                 phon: "OY" },                french: { word: "Aujourd'hui",          phon: "oh-zhoor-DWEE" },   german: { word: "Heute",                  phon: "HOY-teh" } },
  "Tomorrow":           { spanish: { word: "Mañana",              phon: "mah-NYAH-nah" },      french: { word: "Demain",               phon: "duh-MAHN" },        german: { word: "Morgen",                 phon: "MOR-gen" } },
  "Yesterday":          { spanish: { word: "Ayer",                phon: "ah-YEHR" },           french: { word: "Hier",                 phon: "YEHR" },            german: { word: "Gestern",                phon: "GES-tern" } },
  "Morning":            { spanish: { word: "Mañana",              phon: "mah-NYAH-nah" },      french: { word: "Matin",                phon: "mah-TAHN" },        german: { word: "Morgen",                 phon: "MOR-gen" } },
  "Night":              { spanish: { word: "Noche",               phon: "NOH-cheh" },          french: { word: "Nuit",                 phon: "NWEE" },            german: { word: "Nacht",                  phon: "NAHKHT" } },
  "Week":               { spanish: { word: "Semana",              phon: "seh-MAH-nah" },       french: { word: "Semaine",              phon: "suh-MEN" },         german: { word: "Woche",                  phon: "VOH-kheh" } },
  "Month":              { spanish: { word: "Mes",                 phon: "MES" },               french: { word: "Mois",                 phon: "MWAH" },            german: { word: "Monat",                  phon: "MOH-naht" } },
  "Year":               { spanish: { word: "Año",                 phon: "AH-nyoh" },           french: { word: "Année",                phon: "ah-NAY" },          german: { word: "Jahr",                   phon: "YAHR" } },

  // ACTIONS
  "Eat":                { spanish: { word: "Comer",               phon: "koh-MEHR" },          french: { word: "Manger",               phon: "mahn-ZHAY" },       german: { word: "Essen",                  phon: "ES-en" } },
  "Drink":              { spanish: { word: "Beber",               phon: "beh-BEHR" },          french: { word: "Boire",                phon: "BWAHR" },           german: { word: "Trinken",                phon: "TRINK-en" } },
  "Sleep":              { spanish: { word: "Dormir",              phon: "dor-MEER" },          french: { word: "Dormir",               phon: "dor-MEER" },        german: { word: "Schlafen",               phon: "SHLAH-fen" } },
  "Run":                { spanish: { word: "Correr",              phon: "koh-REHR" },          french: { word: "Courir",               phon: "koo-REER" },        german: { word: "Laufen",                 phon: "LOW-fen" } },
  "Walk":               { spanish: { word: "Caminar",             phon: "kah-mee-NAR" },       french: { word: "Marcher",              phon: "mar-SHAY" },        german: { word: "Gehen",                  phon: "GAY-en" } },
  "Read":               { spanish: { word: "Leer",                phon: "leh-EHR" },           french: { word: "Lire",                 phon: "LEER" },            german: { word: "Lesen",                  phon: "LAY-zen" } },
  "Write":              { spanish: { word: "Escribir",            phon: "es-kree-BEER" },      french: { word: "Écrire",               phon: "ay-KREER" },        german: { word: "Schreiben",              phon: "SHRY-ben" } },
  "Sing":               { spanish: { word: "Cantar",              phon: "kahn-TAR" },          french: { word: "Chanter",              phon: "shahn-TAY" },       german: { word: "Singen",                 phon: "ZING-en" } },

  // WEATHER
  "Sunny":              { spanish: { word: "Soleado",             phon: "soh-leh-AH-doh" },    french: { word: "Ensoleillé",           phon: "ahn-so-leh-YAY" },  german: { word: "Sonnig",                 phon: "ZOHN-ikh" } },
  "Rainy":              { spanish: { word: "Lluvioso",            phon: "yoo-VYOH-soh" },      french: { word: "Pluvieux",             phon: "ploo-VYUH" },       german: { word: "Regnerisch",             phon: "RAYG-ner-ish" } },
  "Cloudy":             { spanish: { word: "Nublado",             phon: "noo-BLAH-doh" },      french: { word: "Nuageux",              phon: "noo-ah-ZHUH" },     german: { word: "Bewölkt",                phon: "be-VURLKT" } },
  "Snowy":              { spanish: { word: "Nevado",              phon: "neh-VAH-doh" },       french: { word: "Neigeux",              phon: "neh-ZHUH" },        german: { word: "Schneereich",            phon: "SHNAY-rikh" } },
  "Windy":              { spanish: { word: "Ventoso",             phon: "ven-TOH-soh" },       french: { word: "Venteux",              phon: "vahn-TUH" },        german: { word: "Windig",                 phon: "VIN-dikh" } },

  // TRANSPORT
  "Car":                { spanish: { word: "Coche",               phon: "KOH-cheh" },          french: { word: "Voiture",              phon: "vwah-TUUR" },       german: { word: "Auto",                   phon: "OW-toh" } },
  "Bus":                { spanish: { word: "Autobús",             phon: "ow-toh-BOOS" },       french: { word: "Bus",                  phon: "BOOS" },            german: { word: "Bus",                    phon: "BOOS" } },
  "Train":              { spanish: { word: "Tren",                phon: "TREN" },              french: { word: "Train",                phon: "TRAHN" },           german: { word: "Zug",                    phon: "TSOOK" } },
  "Plane":              { spanish: { word: "Avión",               phon: "ah-VYOHN" },          french: { word: "Avion",                phon: "ah-VYOHN" },        german: { word: "Flugzeug",               phon: "FLOOK-tsoyk" } },
  "Bike":               { spanish: { word: "Bicicleta",           phon: "bee-see-KLEH-tah" },  french: { word: "Vélo",                 phon: "vay-LOH" },         german: { word: "Fahrrad",                phon: "FAR-raht" } },
  "Boat":               { spanish: { word: "Barco",               phon: "BAR-koh" },           french: { word: "Bateau",               phon: "bah-TOH" },         german: { word: "Boot",                   phon: "BOHT" } },

  // EXPANSION SET — FOOD
  "Orange (fruit)":     { spanish: { word: "Naranja",             phon: "nah-RAHN-hah" },      french: { word: "Orange",               phon: "oh-RAHNZH" },       german: { word: "Orange",                 phon: "oh-RAHN-zheh" } },
  "Strawberry":         { spanish: { word: "Fresa",               phon: "FREH-sah" },          french: { word: "Fraise",               phon: "FREHZ" },           german: { word: "Erdbeere",               phon: "EHRT-beh-reh" } },
  "Grape":              { spanish: { word: "Uva",                 phon: "OO-vah" },            french: { word: "Raisin",               phon: "reh-ZAHN" },        german: { word: "Traube",                 phon: "TROW-beh" } },
  "Watermelon":         { spanish: { word: "Sandía",              phon: "sahn-DEE-ah" },       french: { word: "Pastèque",             phon: "pahs-TEK" },        german: { word: "Wassermelone",           phon: "VAH-ser-meh-LOH-neh" } },
  "Carrot":             { spanish: { word: "Zanahoria",           phon: "sah-nah-OR-yah" },    french: { word: "Carotte",              phon: "kah-ROHT" },        german: { word: "Karotte",                phon: "kah-ROHT-teh" } },
  "Potato":             { spanish: { word: "Papa",                phon: "PAH-pah" },           french: { word: "Pomme de terre",       phon: "pohm duh TEHR" },   german: { word: "Kartoffel",              phon: "kar-TOFF-el" } },
  "Breakfast":          { spanish: { word: "Desayuno",            phon: "deh-sah-YOO-noh" },   french: { word: "Petit déjeuner",       phon: "puh-TEE day-zhuh-NAY" }, german: { word: "Frühstück",         phon: "FRUE-shtuek" } },
  "Lunch":              { spanish: { word: "Almuerzo",            phon: "ahl-MWEHR-soh" },     french: { word: "Déjeuner",             phon: "day-zhuh-NAY" },    german: { word: "Mittagessen",            phon: "MIT-tahg-es-en" } },
  "Dinner":             { spanish: { word: "Cena",                phon: "SEH-nah" },           french: { word: "Dîner",                phon: "dee-NAY" },         german: { word: "Abendessen",             phon: "AH-bent-es-en" } },
  "Juice":              { spanish: { word: "Jugo",                phon: "HOO-goh" },           french: { word: "Jus",                  phon: "ZHOO" },            german: { word: "Saft",                   phon: "ZAHFT" } },
  "Ice cream":          { spanish: { word: "Helado",              phon: "eh-LAH-doh" },        french: { word: "Glace",                phon: "GLAHS" },           german: { word: "Eis",                    phon: "ICE" } },
  "Cookie":             { spanish: { word: "Galleta",             phon: "gah-YEH-tah" },       french: { word: "Biscuit",              phon: "bee-SKWEE" },       german: { word: "Keks",                   phon: "KEKS" } },
  "Cheese":             { spanish: { word: "Queso",               phon: "KEH-soh" },           french: { word: "Fromage",              phon: "froh-MAHZH" },      german: { word: "Käse",                   phon: "KAY-zeh" } },
  "Butter":             { spanish: { word: "Mantequilla",         phon: "mahn-teh-KEE-yah" },  french: { word: "Beurre",               phon: "BUHR" },            german: { word: "Butter",                 phon: "BOO-ter" } },
  "Salt":               { spanish: { word: "Sal",                 phon: "SAHL" },              french: { word: "Sel",                  phon: "SEHL" },            german: { word: "Salz",                   phon: "ZAHLTS" } },

  // EXPANSION SET — DAILY (clothes + routine)
  "Shirt":              { spanish: { word: "Camisa",              phon: "kah-MEE-sah" },       french: { word: "Chemise",              phon: "shuh-MEEZ" },       german: { word: "Hemd",                   phon: "HEMT" } },
  "Pants":              { spanish: { word: "Pantalones",          phon: "pahn-tah-LOH-nes" },  french: { word: "Pantalon",             phon: "pahn-tah-LOHN" },   german: { word: "Hose",                   phon: "HOH-zeh" } },
  "Shoes":              { spanish: { word: "Zapatos",             phon: "sah-PAH-tohs" },      french: { word: "Chaussures",           phon: "shoh-SUUR" },       german: { word: "Schuhe",                 phon: "SHOO-eh" } },
  "Socks":              { spanish: { word: "Calcetines",          phon: "kahl-seh-TEE-nes" },  french: { word: "Chaussettes",          phon: "shoh-SET" },        german: { word: "Socken",                 phon: "ZOH-ken" } },
  "Hat":                { spanish: { word: "Sombrero",            phon: "som-BREH-roh" },      french: { word: "Chapeau",              phon: "shah-POH" },        german: { word: "Hut",                    phon: "HOOT" } },
  "Coat":               { spanish: { word: "Abrigo",              phon: "ah-BREE-goh" },       french: { word: "Manteau",              phon: "mahn-TOH" },        german: { word: "Mantel",                 phon: "MAHN-tel" } },
  "Pajamas":            { spanish: { word: "Pijama",              phon: "pee-HAH-mah" },       french: { word: "Pyjama",               phon: "pee-zhah-MAH" },    german: { word: "Schlafanzug",            phon: "SHLAHF-ahn-tsook" } },
  "Brush teeth":        { spanish: { word: "Cepillarse los dientes", phon: "seh-pee-YAR-seh los DYEN-tes" }, french: { word: "Se brosser les dents", phon: "suh broh-SAY lay DAHN" }, german: { word: "Zähne putzen",    phon: "TSEH-neh POOT-sen" } },
  "Wash hands":         { spanish: { word: "Lavarse las manos",   phon: "lah-VAR-seh las MAH-nohs" }, french: { word: "Se laver les mains",  phon: "suh lah-VAY lay MAHN" }, german: { word: "Hände waschen",       phon: "HEN-deh VAH-shen" } },
  "Take a bath":        { spanish: { word: "Bañarse",             phon: "bah-NYAR-seh" },      french: { word: "Prendre un bain",      phon: "PRAHN-druh uhn BAHN" }, german: { word: "Baden",                phon: "BAH-den" } },
  "Bed":                { spanish: { word: "Cama",                phon: "KAH-mah" },           french: { word: "Lit",                  phon: "LEE" },             german: { word: "Bett",                   phon: "BET" } },
  "Pillow":             { spanish: { word: "Almohada",            phon: "ahl-moh-AH-dah" },    french: { word: "Oreiller",             phon: "oh-ray-YAY" },      german: { word: "Kissen",                 phon: "KISS-en" } },
  "Soap":               { spanish: { word: "Jabón",               phon: "hah-BOHN" },          french: { word: "Savon",                phon: "sah-VOHN" },        german: { word: "Seife",                  phon: "ZAI-feh" } },
  "Towel":              { spanish: { word: "Toalla",              phon: "toh-AH-yah" },        french: { word: "Serviette",            phon: "sehr-VYET" },       german: { word: "Handtuch",               phon: "HAHNT-tookh" } },
  "Toothbrush":         { spanish: { word: "Cepillo de dientes",  phon: "seh-PEE-yoh deh DYEN-tes" }, french: { word: "Brosse à dents",   phon: "BROHS ah DAHN" },   german: { word: "Zahnbürste",             phon: "TSAHN-buer-steh" } },

  // EXPANSION SET — PLACES
  "Home":               { spanish: { word: "Casa",                phon: "KAH-sah" },           french: { word: "Maison",               phon: "may-ZOHN" },        german: { word: "Zuhause",                phon: "tsoo-HOW-zeh" } },
  "Park":               { spanish: { word: "Parque",              phon: "PAR-keh" },           french: { word: "Parc",                 phon: "PARK" },            german: { word: "Park",                   phon: "PARK" } },
  "Store":              { spanish: { word: "Tienda",              phon: "TYEN-dah" },          french: { word: "Magasin",              phon: "mah-gah-ZAHN" },    german: { word: "Geschäft",               phon: "geh-SHEFT" } },
  "Library":            { spanish: { word: "Biblioteca",          phon: "bee-blee-oh-TEH-kah" }, french: { word: "Bibliothèque",       phon: "bee-blee-oh-TEK" }, german: { word: "Bibliothek",             phon: "bee-blee-oh-TEHK" } },
  "Hospital":           { spanish: { word: "Hospital",            phon: "os-pee-TAHL" },       french: { word: "Hôpital",              phon: "oh-pee-TAHL" },     german: { word: "Krankenhaus",            phon: "KRAHN-ken-house" } },
  "Playground":         { spanish: { word: "Parque infantil",     phon: "PAR-keh een-fahn-TEEL" }, french: { word: "Aire de jeux",     phon: "EHR duh ZHUH" },    german: { word: "Spielplatz",             phon: "SHPEEL-plahts" } },

  // EXPANSION SET — ACTIONS
  "Play":               { spanish: { word: "Jugar",               phon: "hoo-GAR" },           french: { word: "Jouer",                phon: "zhoo-AY" },         german: { word: "Spielen",                phon: "SHPEE-len" } },
  "Jump":               { spanish: { word: "Saltar",              phon: "sahl-TAR" },          french: { word: "Sauter",               phon: "soh-TAY" },         german: { word: "Springen",               phon: "SHPRING-en" } },
  "Draw":               { spanish: { word: "Dibujar",             phon: "dee-boo-HAR" },       french: { word: "Dessiner",             phon: "deh-see-NAY" },     german: { word: "Zeichnen",               phon: "TSAIKH-nen" } },
  "Sit":                { spanish: { word: "Sentarse",            phon: "sen-TAR-seh" },       french: { word: "S'asseoir",            phon: "sah-SWAR" },        german: { word: "Sitzen",                 phon: "ZIT-sen" } },
  "Stand":              { spanish: { word: "Pararse",             phon: "pah-RAR-seh" },       french: { word: "Se lever",             phon: "suh luh-VAY" },     german: { word: "Stehen",                 phon: "SHTAY-en" } },
  "Help":               { spanish: { word: "Ayudar",              phon: "ah-yoo-DAR" },        french: { word: "Aider",                phon: "ay-DAY" },          german: { word: "Helfen",                 phon: "HEL-fen" } },

  // EXPANSION SET — TIME: days
  "Monday":             { spanish: { word: "Lunes",               phon: "LOO-nes" },           french: { word: "Lundi",                phon: "luhn-DEE" },        german: { word: "Montag",                 phon: "MOHN-tahk" } },
  "Tuesday":            { spanish: { word: "Martes",              phon: "MAR-tes" },           french: { word: "Mardi",                phon: "mar-DEE" },         german: { word: "Dienstag",               phon: "DEENS-tahk" } },
  "Wednesday":          { spanish: { word: "Miércoles",           phon: "MYEHR-koh-les" },     french: { word: "Mercredi",             phon: "mehr-kruh-DEE" },   german: { word: "Mittwoch",               phon: "MIT-vokh" } },
  "Thursday":           { spanish: { word: "Jueves",              phon: "HWAY-ves" },          french: { word: "Jeudi",                phon: "zhuh-DEE" },        german: { word: "Donnerstag",             phon: "DON-ers-tahk" } },
  "Friday":             { spanish: { word: "Viernes",             phon: "VYEHR-nes" },         french: { word: "Vendredi",             phon: "vahn-druh-DEE" },   german: { word: "Freitag",                phon: "FRY-tahk" } },
  "Saturday":           { spanish: { word: "Sábado",              phon: "SAH-bah-doh" },       french: { word: "Samedi",               phon: "sahm-DEE" },        german: { word: "Samstag",                phon: "ZAHMS-tahk" } },
  "Sunday":             { spanish: { word: "Domingo",             phon: "doh-MEEN-goh" },      french: { word: "Dimanche",             phon: "dee-MAHNSH" },      german: { word: "Sonntag",                phon: "ZON-tahk" } },

  // EXPANSION SET — COLORS
  "Purple":             { spanish: { word: "Morado",              phon: "moh-RAH-doh" },       french: { word: "Violet",               phon: "vee-oh-LAY" },      german: { word: "Lila",                   phon: "LEE-lah" } },
  "Orange (color)":     { spanish: { word: "Anaranjado",          phon: "ah-nah-rahn-HAH-doh" }, french: { word: "Orange",             phon: "oh-RAHNZH" },       german: { word: "Orange",                 phon: "oh-RAHN-zheh" } },
  "Pink":               { spanish: { word: "Rosa",                phon: "ROH-sah" },           french: { word: "Rose",                 phon: "ROHZ" },            german: { word: "Rosa",                   phon: "ROH-zah" } },
  "White":              { spanish: { word: "Blanco",              phon: "BLAHN-koh" },         french: { word: "Blanc",                phon: "BLAHN" },           german: { word: "Weiß",                   phon: "VICE" } },
  "Black":              { spanish: { word: "Negro",               phon: "NEH-groh" },          french: { word: "Noir",                 phon: "NWAR" },            german: { word: "Schwarz",                phon: "SHVARTS" } },
  "Brown":              { spanish: { word: "Marrón",              phon: "mah-ROHN" },          french: { word: "Marron",               phon: "mah-ROHN" },        german: { word: "Braun",                  phon: "BROWN" } },

  // EXPANSION SET — PHRASES
  "You're welcome":     { spanish: { word: "De nada",             phon: "deh NAH-dah" },       french: { word: "De rien",              phon: "duh RYEN" },        german: { word: "Bitte schön",            phon: "BIT-eh SHURN" } },
  "How old are you?":   { spanish: { word: "¿Cuántos años tienes?", phon: "KWAHN-tohs AH-nyohs TYEH-nes" }, french: { word: "Quel âge as-tu ?", phon: "kel AHZH ah TUE" }, german: { word: "Wie alt bist du?",      phon: "vee AHLT bist doo" } },
  "Can I have...":      { spanish: { word: "¿Me das...?",         phon: "may DAHS" },          french: { word: "Je peux avoir... ?",   phon: "zhuh PUH ah-VWAR" }, german: { word: "Kann ich... haben?",    phon: "kahn ikh HAH-ben" } },
  "I'm sorry":          { spanish: { word: "Lo siento",           phon: "loh SYEN-toh" },      french: { word: "Je suis désolé",       phon: "zhuh swee day-zoh-LAY" }, german: { word: "Es tut mir leid",   phon: "es toot meer LITE" } },
  "More please":        { spanish: { word: "Más, por favor",      phon: "MAHS por fah-VOR" },  french: { word: "Encore, s'il vous plaît", phon: "ahn-KOR seel voo PLEH" }, german: { word: "Mehr, bitte",      phon: "MEHR BIT-eh" } },
};

// Merge Latin-script translations into flashcards
for (const card of flashcards) {
  const t = LATIN_TRANSLATIONS[card.english];
  if (t) {
    card.spanish = t.spanish.word;
    card.french = t.french.word;
    card.german = t.german.word;
    card.romanization.spanish = t.spanish.phon;
    card.romanization.french = t.french.phon;
    card.romanization.german = t.german.phon;
  }
}

/**
 * Ukrainian translations keyed by `english`. Cyrillic word + kid-readable
 * Latin-script phonetic. We don't generate a per-letter breakdown for
 * Ukrainian because Cyrillic is alphabetic (1 letter ≈ 1 sound) so the
 * Latin phonetic effectively *is* the breakdown.
 *
 * Stress is marked by capitalizing the stressed syllable in `phon`, same
 * convention as the Latin-script entries above.
 */
const UKRAINIAN_TRANSLATIONS: Record<string, { word: string; phon: string }> = {
  // GREETINGS
  "Hello":                  { word: "Привіт",            phon: "pry-VEET" },
  "Thank you":              { word: "Дякую",             phon: "DYA-koo-yoo" },
  "Good morning":           { word: "Доброго ранку",     phon: "DOB-roh-ho RAHN-koo" },
  "Good night":             { word: "На добраніч",       phon: "nah dob-RAH-nich" },
  "Goodbye":                { word: "До побачення",      phon: "doh poh-BAH-chen-nya" },
  "Please":                 { word: "Будь ласка",        phon: "bood LAHS-kah" },
  "Excuse me / Sorry":      { word: "Вибачте",           phon: "VY-bahch-teh" },
  "Yes":                    { word: "Так",               phon: "TAHK" },
  "No":                     { word: "Ні",                phon: "NEE" },

  // FAMILY
  "Mother / Mom":           { word: "Мама",              phon: "MAH-mah" },
  "Father / Dad":           { word: "Тато",              phon: "TAH-toh" },
  "Sister":                 { word: "Сестра",            phon: "ses-TRAH" },
  "Brother":                { word: "Брат",              phon: "BRAHT" },
  "Grandmother":            { word: "Бабуся",            phon: "bah-BOO-sya" },
  "Grandfather":            { word: "Дідусь",            phon: "dee-DOOS" },
  "Love":                   { word: "Любов",             phon: "lyoo-BOHV" },
  "I love you":             { word: "Я тебе люблю",      phon: "yah teh-BEH lyoo-BLYOO" },

  // FEELINGS
  "Happy":                  { word: "Щасливий",          phon: "shchas-LY-vyy" },
  "Sad":                    { word: "Сумний",            phon: "soom-NYY" },
  "Hungry":                 { word: "Голодний",          phon: "hoh-LOHD-nyy" },
  "Tired":                  { word: "Втомлений",         phon: "VTOM-leh-nyy" },
  "Big":                    { word: "Великий",           phon: "veh-LY-kyy" },
  "Small":                  { word: "Маленький",         phon: "mah-LEN-kyy" },
  "Beautiful":              { word: "Гарний",            phon: "HAR-nyy" },
  "Angry":                  { word: "Сердитий",          phon: "ser-DY-tyy" },
  "Scared":                 { word: "Наляканий",         phon: "nah-LYAH-kah-nyy" },
  "Hot":                    { word: "Гарячий",           phon: "hah-RYAH-chyy" },
  "Cold":                   { word: "Холодний",          phon: "khoh-LOHD-nyy" },
  "Fast":                   { word: "Швидкий",           phon: "shvyd-KYY" },
  "Slow":                   { word: "Повільний",         phon: "poh-VEEL-nyy" },
  "New":                    { word: "Новий",             phon: "noh-VYY" },
  "Old":                    { word: "Старий",            phon: "stah-RYY" },

  // FOOD
  "Water":                  { word: "Вода",              phon: "voh-DAH" },
  "Rice":                   { word: "Рис",               phon: "RYS" },
  "Milk":                   { word: "Молоко",            phon: "moh-loh-KOH" },
  "Fruit":                  { word: "Фрукт",             phon: "FROOKT" },
  "Delicious":              { word: "Смачно",            phon: "SMAHCH-noh" },
  "Bread":                  { word: "Хліб",              phon: "KHLEEB" },
  "Egg":                    { word: "Яйце",              phon: "yai-TSEH" },
  "Apple":                  { word: "Яблуко",            phon: "YAH-bloo-koh" },
  "Banana":                 { word: "Банан",             phon: "bah-NAHN" },
  "Noodles":                { word: "Локшина",           phon: "lok-SHY-nah" },
  "Soup":                   { word: "Суп",               phon: "SOOP" },
  "Tea":                    { word: "Чай",               phon: "CHAI" },
  "Cake":                   { word: "Торт",              phon: "TORT" },

  // ANIMALS
  "Cat":                    { word: "Кіт",               phon: "KEET" },
  "Dog":                    { word: "Собака",            phon: "soh-BAH-kah" },
  "Fish":                   { word: "Риба",              phon: "RY-bah" },
  "Bird":                   { word: "Птах",              phon: "PTAHKH" },
  "Horse":                  { word: "Кінь",              phon: "KEEN" },
  "Cow":                    { word: "Корова",            phon: "koh-ROH-vah" },
  "Pig":                    { word: "Свиня",             phon: "svy-NYAH" },
  "Rabbit":                 { word: "Кролик",            phon: "KROH-lyk" },
  "Mouse":                  { word: "Миша",              phon: "MY-shah" },
  "Elephant":               { word: "Слон",              phon: "SLOHN" },
  "Lion":                   { word: "Лев",               phon: "LEV" },
  "Tiger":                  { word: "Тигр",              phon: "TYHR" },

  // SCHOOL
  "School":                 { word: "Школа",             phon: "SHKOH-lah" },
  "Book":                   { word: "Книга",             phon: "KNY-hah" },
  "Teacher":                { word: "Вчитель",           phon: "VCHY-tel" },
  "Friend":                 { word: "Друг",              phon: "DROOH" },

  // NUMBERS
  "One":                    { word: "Один",              phon: "oh-DYN" },
  "Two":                    { word: "Два",               phon: "DVAH" },
  "Three":                  { word: "Три",               phon: "TRY" },
  "Four":                   { word: "Чотири",            phon: "choh-TY-ry" },
  "Five":                   { word: "П'ять",             phon: "PYAHT" },
  "Six":                    { word: "Шість",             phon: "SHEEST" },
  "Seven":                  { word: "Сім",               phon: "SEEM" },
  "Eight":                  { word: "Вісім",             phon: "VEE-seem" },
  "Nine":                   { word: "Дев'ять",           phon: "DEH-vyaht" },
  "Ten":                    { word: "Десять",            phon: "DEH-syaht" },
  "Eleven":                 { word: "Одинадцять",        phon: "oh-dy-NAHD-tsyaht" },
  "Twelve":                 { word: "Дванадцять",        phon: "dvah-NAHD-tsyaht" },
  "Thirteen":               { word: "Тринадцять",        phon: "try-NAHD-tsyaht" },
  "Twenty":                 { word: "Двадцять",          phon: "DVAHD-tsyaht" },
  "Thirty":                 { word: "Тридцять",          phon: "TRYD-tsyaht" },
  "One person":             { word: "Одна людина",       phon: "od-NAH lyoo-DY-nah" },
  "Two people":             { word: "Дві людини",        phon: "DVEE lyoo-DY-ny" },
  "One thing":              { word: "Одна річ",          phon: "od-NAH REECH" },
  "Two things":             { word: "Дві речі",          phon: "DVEE REH-chee" },

  // COLORS
  "Red":                    { word: "Червоний",          phon: "cher-VOH-nyy" },
  "Blue":                   { word: "Синій",             phon: "SY-nee" },
  "Yellow":                 { word: "Жовтий",            phon: "ZHOV-tyy" },
  "Green":                  { word: "Зелений",           phon: "zeh-LEH-nyy" },

  // PHRASES
  "Happy Birthday":         { word: "З днем народження", phon: "z dnem nah-ROH-dzhen-nya" },
  "How are you?":           { word: "Як справи?",        phon: "yahk SPRAH-vy" },
  "My name is...":          { word: "Мене звуть...",     phon: "meh-NEH ZVOOT" },
  "Nice to meet you":       { word: "Приємно познайомитись", phon: "pry-YEM-noh poz-nai-YOH-my-tys" },
  "See you later":          { word: "До зустрічі",       phon: "doh ZOOST-ree-chee" },
  "Let's eat!":             { word: "Їжмо!",             phon: "YEEZH-moh" },
  "Good job!":              { word: "Молодець!",         phon: "moh-loh-DETS" },
  "What is this?":          { word: "Що це?",            phon: "shchoh TSEH" },
  "Where is the bathroom?": { word: "Де туалет?",        phon: "deh too-ah-LET" },
  "I don't understand":     { word: "Я не розумію",      phon: "yah neh roh-zoo-MEE-yoo" },

  // BODY
  "Eyes":                   { word: "Очі",               phon: "OH-chee" },
  "Ears":                   { word: "Вуха",              phon: "VOO-khah" },
  "Nose":                   { word: "Ніс",               phon: "NEES" },
  "Mouth":                  { word: "Рот",               phon: "ROHT" },
  "Hands":                  { word: "Руки",              phon: "ROO-ky" },
  "Feet":                   { word: "Ноги",              phon: "NOH-hy" },
  "Head":                   { word: "Голова",            phon: "hoh-loh-VAH" },
  "Hair":                   { word: "Волосся",           phon: "voh-LOHS-sya" },

  // TIME
  "Today":                  { word: "Сьогодні",          phon: "syoh-HOHD-nee" },
  "Tomorrow":               { word: "Завтра",            phon: "ZAHV-trah" },
  "Yesterday":              { word: "Вчора",             phon: "VCHOH-rah" },
  "Morning":                { word: "Ранок",             phon: "RAH-nok" },
  "Night":                  { word: "Ніч",               phon: "NEECH" },
  "Week":                   { word: "Тиждень",           phon: "TYZH-den" },
  "Month":                  { word: "Місяць",            phon: "MEE-syahts" },
  "Year":                   { word: "Рік",               phon: "REEK" },

  // ACTIONS
  "Eat":                    { word: "Їсти",              phon: "YEES-ty" },
  "Drink":                  { word: "Пити",              phon: "PY-ty" },
  "Sleep":                  { word: "Спати",             phon: "SPAH-ty" },
  "Run":                    { word: "Бігати",            phon: "BEE-hah-ty" },
  "Walk":                   { word: "Ходити",            phon: "khoh-DY-ty" },
  "Read":                   { word: "Читати",            phon: "chy-TAH-ty" },
  "Write":                  { word: "Писати",            phon: "py-SAH-ty" },
  "Sing":                   { word: "Співати",           phon: "spee-VAH-ty" },

  // WEATHER
  "Sunny":                  { word: "Сонячно",           phon: "SOH-nyahch-noh" },
  "Rainy":                  { word: "Дощовий",           phon: "dosh-CHOH-vyy" },
  "Cloudy":                 { word: "Хмарно",            phon: "KHMAR-noh" },
  "Snowy":                  { word: "Сніжний",           phon: "SNEEZH-nyy" },
  "Windy":                  { word: "Вітряно",           phon: "VEET-ryah-noh" },

  // TRANSPORT
  "Car":                    { word: "Машина",            phon: "mah-SHY-nah" },
  "Bus":                    { word: "Автобус",           phon: "av-TOH-boos" },
  "Train":                  { word: "Поїзд",             phon: "POH-yeezd" },
  "Plane":                  { word: "Літак",             phon: "lee-TAHK" },
  "Bike":                   { word: "Велосипед",         phon: "veh-loh-sy-PED" },
  "Boat":                   { word: "Човен",             phon: "CHOH-ven" },

  // EXPANSION SET — FOOD
  "Orange (fruit)":         { word: "Апельсин",          phon: "ah-pel-SYN" },
  "Strawberry":             { word: "Полуниця",          phon: "poh-loo-NY-tsya" },
  "Grape":                  { word: "Виноград",          phon: "vy-noh-HRAHD" },
  "Watermelon":             { word: "Кавун",             phon: "kah-VOON" },
  "Carrot":                 { word: "Морква",            phon: "MORK-vah" },
  "Potato":                 { word: "Картопля",          phon: "kar-TOP-lya" },
  "Breakfast":              { word: "Сніданок",          phon: "snee-DAH-nok" },
  "Lunch":                  { word: "Обід",              phon: "oh-BEED" },
  "Dinner":                 { word: "Вечеря",            phon: "veh-CHEH-rya" },
  "Juice":                  { word: "Сік",               phon: "SEEK" },
  "Ice cream":              { word: "Морозиво",          phon: "moh-ROH-zy-voh" },
  "Cookie":                 { word: "Печиво",            phon: "PEH-chy-voh" },
  "Cheese":                 { word: "Сир",               phon: "SYR" },
  "Butter":                 { word: "Масло",             phon: "MAHS-loh" },
  "Salt":                   { word: "Сіль",              phon: "SEEL" },

  // EXPANSION SET — DAILY
  "Shirt":                  { word: "Сорочка",           phon: "soh-ROHCH-kah" },
  "Pants":                  { word: "Штани",             phon: "shtah-NY" },
  "Shoes":                  { word: "Взуття",            phon: "vzoot-TYAH" },
  "Socks":                  { word: "Шкарпетки",         phon: "shkar-PET-ky" },
  "Hat":                    { word: "Шапка",             phon: "SHAHP-kah" },
  "Coat":                   { word: "Пальто",            phon: "pahl-TOH" },
  "Pajamas":                { word: "Піжама",            phon: "pee-ZHAH-mah" },
  "Brush teeth":            { word: "Чистити зуби",      phon: "CHYS-ty-ty ZOO-by" },
  "Wash hands":             { word: "Мити руки",         phon: "MY-ty ROO-ky" },
  "Take a bath":            { word: "Купатися",          phon: "koo-PAH-ty-sya" },
  "Bed":                    { word: "Ліжко",             phon: "LEEZH-koh" },
  "Pillow":                 { word: "Подушка",           phon: "poh-DOOSH-kah" },
  "Soap":                   { word: "Мило",              phon: "MY-loh" },
  "Towel":                  { word: "Рушник",            phon: "roosh-NYK" },
  "Toothbrush":             { word: "Зубна щітка",       phon: "zoob-NAH SHCHEET-kah" },

  // EXPANSION SET — PLACES
  "Home":                   { word: "Дім",               phon: "DEEM" },
  "Park":                   { word: "Парк",              phon: "PARK" },
  "Store":                  { word: "Магазин",           phon: "mah-hah-ZYN" },
  "Library":                { word: "Бібліотека",        phon: "bee-blee-oh-TEH-kah" },
  "Hospital":               { word: "Лікарня",           phon: "lee-KAR-nya" },
  "Playground":             { word: "Майданчик",         phon: "mai-DAHN-chyk" },

  // EXPANSION SET — ACTIONS
  "Play":                   { word: "Грати",             phon: "HRAH-ty" },
  "Jump":                   { word: "Стрибати",          phon: "stry-BAH-ty" },
  "Draw":                   { word: "Малювати",          phon: "mah-lyoo-VAH-ty" },
  "Sit":                    { word: "Сидіти",            phon: "sy-DEE-ty" },
  "Stand":                  { word: "Стояти",            phon: "stoh-YAH-ty" },
  "Help":                   { word: "Допомагати",        phon: "doh-poh-mah-HAH-ty" },

  // EXPANSION SET — TIME (days)
  "Monday":                 { word: "Понеділок",         phon: "poh-neh-DEE-lok" },
  "Tuesday":                { word: "Вівторок",          phon: "veev-TOH-rok" },
  "Wednesday":              { word: "Середа",            phon: "seh-reh-DAH" },
  "Thursday":               { word: "Четвер",            phon: "chet-VEHR" },
  "Friday":                 { word: "П'ятниця",          phon: "PYAHT-ny-tsya" },
  "Saturday":               { word: "Субота",            phon: "soo-BOH-tah" },
  "Sunday":                 { word: "Неділя",            phon: "neh-DEE-lya" },

  // EXPANSION SET — COLORS
  "Purple":                 { word: "Фіолетовий",        phon: "fee-oh-LEH-toh-vyy" },
  "Orange (color)":         { word: "Помаранчевий",      phon: "poh-mah-RAHN-cheh-vyy" },
  "Pink":                   { word: "Рожевий",           phon: "roh-ZHEH-vyy" },
  "White":                  { word: "Білий",             phon: "BEE-lyy" },
  "Black":                  { word: "Чорний",            phon: "CHOR-nyy" },
  "Brown":                  { word: "Коричневий",        phon: "koh-RYCH-neh-vyy" },

  // EXPANSION SET — PHRASES
  "You're welcome":         { word: "Будь ласка",        phon: "bood LAHS-kah" },
  "How old are you?":       { word: "Скільки тобі років?", phon: "SKEEL-ky toh-BEE ROH-keev" },
  "Can I have...":          { word: "Можна мені...?",    phon: "MOZH-nah meh-NEE" },
  "I'm sorry":              { word: "Вибач",             phon: "VY-bahch" },
  "More please":            { word: "Ще, будь ласка",    phon: "shcheh bood LAHS-kah" },
};

// Merge Ukrainian translations into flashcards
for (const card of flashcards) {
  const u = UKRAINIAN_TRANSLATIONS[card.english];
  if (u) {
    card.ukrainian = u.word;
    card.romanization.ukrainian = u.phon;
  }
}

/**
 * Italian translations keyed by `english`. Standard Italian + kid-readable
 * Latin-script phonetic. No per-character breakdown — Latin alphabet.
 */
const ITALIAN_TRANSLATIONS: Record<string, { word: string; phon: string }> = {
  // GREETINGS
  "Hello":                  { word: "Ciao",                  phon: "CHOW" },
  "Thank you":              { word: "Grazie",                phon: "GRAH-tsyeh" },
  "Good morning":           { word: "Buongiorno",            phon: "bwon-JOR-noh" },
  "Good night":             { word: "Buonanotte",            phon: "bwoh-nah-NOT-teh" },
  "Goodbye":                { word: "Arrivederci",           phon: "ah-ree-veh-DEHR-chee" },
  "Please":                 { word: "Per favore",            phon: "pehr fah-VOH-reh" },
  "Excuse me / Sorry":      { word: "Scusa",                 phon: "SKOO-zah" },
  "Yes":                    { word: "Sì",                    phon: "SEE" },
  "No":                     { word: "No",                    phon: "NOH" },

  // FAMILY
  "Mother / Mom":           { word: "Mamma",                 phon: "MAHM-mah" },
  "Father / Dad":           { word: "Papà",                  phon: "pah-PAH" },
  "Sister":                 { word: "Sorella",               phon: "soh-REL-lah" },
  "Brother":                { word: "Fratello",              phon: "frah-TEL-loh" },
  "Grandmother":            { word: "Nonna",                 phon: "NOHN-nah" },
  "Grandfather":            { word: "Nonno",                 phon: "NOHN-noh" },
  "Love":                   { word: "Amore",                 phon: "ah-MOH-reh" },
  "I love you":             { word: "Ti amo",                phon: "tee AH-moh" },

  // FEELINGS
  "Happy":                  { word: "Felice",                phon: "feh-LEE-cheh" },
  "Sad":                    { word: "Triste",                phon: "TREES-teh" },
  "Hungry":                 { word: "Ho fame",               phon: "oh FAH-meh" },
  "Tired":                  { word: "Stanco",                phon: "STAHN-koh" },
  "Big":                    { word: "Grande",                phon: "GRAHN-deh" },
  "Small":                  { word: "Piccolo",               phon: "PEEK-koh-loh" },
  "Beautiful":              { word: "Bello",                 phon: "BEL-loh" },
  "Angry":                  { word: "Arrabbiato",            phon: "ahr-rahb-BYAH-toh" },
  "Scared":                 { word: "Spaventato",            phon: "spah-ven-TAH-toh" },
  "Hot":                    { word: "Caldo",                 phon: "KAHL-doh" },
  "Cold":                   { word: "Freddo",                phon: "FRED-doh" },
  "Fast":                   { word: "Veloce",                phon: "veh-LOH-cheh" },
  "Slow":                   { word: "Lento",                 phon: "LEN-toh" },
  "New":                    { word: "Nuovo",                 phon: "NWOH-voh" },
  "Old":                    { word: "Vecchio",               phon: "VEK-kyoh" },

  // FOOD
  "Water":                  { word: "Acqua",                 phon: "AHK-kwah" },
  "Rice":                   { word: "Riso",                  phon: "REE-zoh" },
  "Milk":                   { word: "Latte",                 phon: "LAHT-teh" },
  "Fruit":                  { word: "Frutta",                phon: "FROOT-tah" },
  "Delicious":              { word: "Delizioso",             phon: "deh-lee-TSYOH-zoh" },
  "Bread":                  { word: "Pane",                  phon: "PAH-neh" },
  "Egg":                    { word: "Uovo",                  phon: "WOH-voh" },
  "Apple":                  { word: "Mela",                  phon: "MEH-lah" },
  "Banana":                 { word: "Banana",                phon: "bah-NAH-nah" },
  "Noodles":                { word: "Pasta",                 phon: "PAHS-tah" },
  "Soup":                   { word: "Zuppa",                 phon: "TSOOP-pah" },
  "Tea":                    { word: "Tè",                    phon: "TEH" },
  "Cake":                   { word: "Torta",                 phon: "TOR-tah" },

  // ANIMALS
  "Cat":                    { word: "Gatto",                 phon: "GAHT-toh" },
  "Dog":                    { word: "Cane",                  phon: "KAH-neh" },
  "Fish":                   { word: "Pesce",                 phon: "PEH-sheh" },
  "Bird":                   { word: "Uccello",               phon: "ootch-CHEL-loh" },
  "Horse":                  { word: "Cavallo",               phon: "kah-VAHL-loh" },
  "Cow":                    { word: "Mucca",                 phon: "MOOK-kah" },
  "Pig":                    { word: "Maiale",                phon: "mah-YAH-leh" },
  "Rabbit":                 { word: "Coniglio",              phon: "koh-NEE-lyoh" },
  "Mouse":                  { word: "Topo",                  phon: "TOH-poh" },
  "Elephant":               { word: "Elefante",              phon: "eh-leh-FAHN-teh" },
  "Lion":                   { word: "Leone",                 phon: "leh-OH-neh" },
  "Tiger":                  { word: "Tigre",                 phon: "TEE-greh" },

  // SCHOOL
  "School":                 { word: "Scuola",                phon: "SKWOH-lah" },
  "Book":                   { word: "Libro",                 phon: "LEE-broh" },
  "Teacher":                { word: "Maestro",               phon: "mah-ES-troh" },
  "Friend":                 { word: "Amico",                 phon: "ah-MEE-koh" },

  // NUMBERS
  "One":                    { word: "Uno",                   phon: "OO-noh" },
  "Two":                    { word: "Due",                   phon: "DOO-eh" },
  "Three":                  { word: "Tre",                   phon: "TREH" },
  "Four":                   { word: "Quattro",               phon: "KWAHT-troh" },
  "Five":                   { word: "Cinque",                phon: "CHEEN-kweh" },
  "Six":                    { word: "Sei",                   phon: "SAY" },
  "Seven":                  { word: "Sette",                 phon: "SET-teh" },
  "Eight":                  { word: "Otto",                  phon: "OT-toh" },
  "Nine":                   { word: "Nove",                  phon: "NOH-veh" },
  "Ten":                    { word: "Dieci",                 phon: "DYEH-chee" },
  "Eleven":                 { word: "Undici",                phon: "OON-dee-chee" },
  "Twelve":                 { word: "Dodici",                phon: "DOH-dee-chee" },
  "Thirteen":               { word: "Tredici",               phon: "TREH-dee-chee" },
  "Twenty":                 { word: "Venti",                 phon: "VEN-tee" },
  "Thirty":                 { word: "Trenta",                phon: "TREN-tah" },
  "One person":             { word: "Una persona",           phon: "OO-nah pehr-SOH-nah" },
  "Two people":             { word: "Due persone",           phon: "DOO-eh pehr-SOH-neh" },
  "One thing":              { word: "Una cosa",              phon: "OO-nah KOH-zah" },
  "Two things":             { word: "Due cose",              phon: "DOO-eh KOH-zeh" },

  // COLORS
  "Red":                    { word: "Rosso",                 phon: "ROHS-soh" },
  "Blue":                   { word: "Blu",                   phon: "BLOO" },
  "Yellow":                 { word: "Giallo",                phon: "JAHL-loh" },
  "Green":                  { word: "Verde",                 phon: "VEHR-deh" },

  // PHRASES
  "Happy Birthday":         { word: "Buon compleanno",       phon: "bwon kom-pleh-AHN-noh" },
  "How are you?":           { word: "Come stai?",            phon: "KOH-meh STAI" },
  "My name is...":          { word: "Mi chiamo...",          phon: "mee KYAH-moh" },
  "Nice to meet you":       { word: "Piacere",               phon: "pyah-CHEH-reh" },
  "See you later":          { word: "A dopo",                phon: "ah DOH-poh" },
  "Let's eat!":             { word: "Mangiamo!",             phon: "mahn-JAH-moh" },
  "Good job!":              { word: "Bravo!",                phon: "BRAH-voh" },
  "What is this?":          { word: "Cos'è questo?",         phon: "kohz-EH KWES-toh" },
  "Where is the bathroom?": { word: "Dov'è il bagno?",       phon: "doh-VEH eel BAH-nyoh" },
  "I don't understand":     { word: "Non capisco",           phon: "nohn kah-PEES-koh" },

  // BODY
  "Eyes":                   { word: "Occhi",                 phon: "OK-kee" },
  "Ears":                   { word: "Orecchie",              phon: "oh-REK-kyeh" },
  "Nose":                   { word: "Naso",                  phon: "NAH-zoh" },
  "Mouth":                  { word: "Bocca",                 phon: "BOHK-kah" },
  "Hands":                  { word: "Mani",                  phon: "MAH-nee" },
  "Feet":                   { word: "Piedi",                 phon: "PYEH-dee" },
  "Head":                   { word: "Testa",                 phon: "TES-tah" },
  "Hair":                   { word: "Capelli",               phon: "kah-PEL-lee" },

  // TIME
  "Today":                  { word: "Oggi",                  phon: "OHJ-jee" },
  "Tomorrow":               { word: "Domani",                phon: "doh-MAH-nee" },
  "Yesterday":              { word: "Ieri",                  phon: "YEH-ree" },
  "Morning":                { word: "Mattina",               phon: "maht-TEE-nah" },
  "Night":                  { word: "Notte",                 phon: "NOHT-teh" },
  "Week":                   { word: "Settimana",             phon: "set-tee-MAH-nah" },
  "Month":                  { word: "Mese",                  phon: "MEH-zeh" },
  "Year":                   { word: "Anno",                  phon: "AHN-noh" },

  // ACTIONS
  "Eat":                    { word: "Mangiare",              phon: "mahn-JAH-reh" },
  "Drink":                  { word: "Bere",                  phon: "BEH-reh" },
  "Sleep":                  { word: "Dormire",               phon: "dor-MEE-reh" },
  "Run":                    { word: "Correre",               phon: "KOR-reh-reh" },
  "Walk":                   { word: "Camminare",             phon: "kahm-mee-NAH-reh" },
  "Read":                   { word: "Leggere",               phon: "LEDJ-jeh-reh" },
  "Write":                  { word: "Scrivere",              phon: "SKREE-veh-reh" },
  "Sing":                   { word: "Cantare",               phon: "kahn-TAH-reh" },

  // WEATHER
  "Sunny":                  { word: "Soleggiato",            phon: "soh-led-JAH-toh" },
  "Rainy":                  { word: "Piovoso",               phon: "pyoh-VOH-zoh" },
  "Cloudy":                 { word: "Nuvoloso",              phon: "noo-voh-LOH-zoh" },
  "Snowy":                  { word: "Nevoso",                phon: "neh-VOH-zoh" },
  "Windy":                  { word: "Ventoso",               phon: "ven-TOH-zoh" },

  // TRANSPORT
  "Car":                    { word: "Macchina",              phon: "MAHK-kee-nah" },
  "Bus":                    { word: "Autobus",               phon: "OW-toh-boos" },
  "Train":                  { word: "Treno",                 phon: "TREH-noh" },
  "Plane":                  { word: "Aereo",                 phon: "ah-EH-reh-oh" },
  "Bike":                   { word: "Bicicletta",            phon: "bee-chee-KLET-tah" },
  "Boat":                   { word: "Barca",                 phon: "BAR-kah" },

  // EXPANSION SET — FOOD
  "Orange (fruit)":         { word: "Arancia",               phon: "ah-RAHN-chah" },
  "Strawberry":             { word: "Fragola",               phon: "FRAH-goh-lah" },
  "Grape":                  { word: "Uva",                   phon: "OO-vah" },
  "Watermelon":             { word: "Anguria",               phon: "ahn-GOO-ryah" },
  "Carrot":                 { word: "Carota",                phon: "kah-ROH-tah" },
  "Potato":                 { word: "Patata",                phon: "pah-TAH-tah" },
  "Breakfast":              { word: "Colazione",             phon: "koh-lah-TSYOH-neh" },
  "Lunch":                  { word: "Pranzo",                phon: "PRAHN-tsoh" },
  "Dinner":                 { word: "Cena",                  phon: "CHEH-nah" },
  "Juice":                  { word: "Succo",                 phon: "SOOK-koh" },
  "Ice cream":              { word: "Gelato",                phon: "jeh-LAH-toh" },
  "Cookie":                 { word: "Biscotto",              phon: "bees-KOT-toh" },
  "Cheese":                 { word: "Formaggio",             phon: "for-MAHJ-joh" },
  "Butter":                 { word: "Burro",                 phon: "BOOR-roh" },
  "Salt":                   { word: "Sale",                  phon: "SAH-leh" },

  // EXPANSION SET — DAILY
  "Shirt":                  { word: "Camicia",               phon: "kah-MEE-chah" },
  "Pants":                  { word: "Pantaloni",             phon: "pahn-tah-LOH-nee" },
  "Shoes":                  { word: "Scarpe",                phon: "SKAR-peh" },
  "Socks":                  { word: "Calzini",               phon: "kahl-TSEE-nee" },
  "Hat":                    { word: "Cappello",              phon: "kahp-PEL-loh" },
  "Coat":                   { word: "Cappotto",              phon: "kahp-POT-toh" },
  "Pajamas":                { word: "Pigiama",               phon: "pee-JAH-mah" },
  "Brush teeth":            { word: "Lavare i denti",        phon: "lah-VAH-reh ee DEN-tee" },
  "Wash hands":             { word: "Lavare le mani",        phon: "lah-VAH-reh leh MAH-nee" },
  "Take a bath":            { word: "Fare il bagno",         phon: "FAH-reh eel BAH-nyoh" },
  "Bed":                    { word: "Letto",                 phon: "LET-toh" },
  "Pillow":                 { word: "Cuscino",               phon: "koo-SHEE-noh" },
  "Soap":                   { word: "Sapone",                phon: "sah-POH-neh" },
  "Towel":                  { word: "Asciugamano",           phon: "ah-shoo-gah-MAH-noh" },
  "Toothbrush":             { word: "Spazzolino",            phon: "spaht-tsoh-LEE-noh" },

  // EXPANSION SET — PLACES
  "Home":                   { word: "Casa",                  phon: "KAH-zah" },
  "Park":                   { word: "Parco",                 phon: "PAR-koh" },
  "Store":                  { word: "Negozio",               phon: "neh-GOH-tsyoh" },
  "Library":                { word: "Biblioteca",            phon: "bee-blee-oh-TEH-kah" },
  "Hospital":               { word: "Ospedale",              phon: "os-peh-DAH-leh" },
  "Playground":             { word: "Parco giochi",          phon: "PAR-koh JOH-kee" },

  // EXPANSION SET — ACTIONS
  "Play":                   { word: "Giocare",               phon: "joh-KAH-reh" },
  "Jump":                   { word: "Saltare",               phon: "sahl-TAH-reh" },
  "Draw":                   { word: "Disegnare",             phon: "dee-zen-YAH-reh" },
  "Sit":                    { word: "Sedersi",               phon: "seh-DEHR-see" },
  "Stand":                  { word: "Stare in piedi",        phon: "STAH-reh een PYEH-dee" },
  "Help":                   { word: "Aiutare",               phon: "ah-yoo-TAH-reh" },

  // EXPANSION SET — TIME (days)
  "Monday":                 { word: "Lunedì",                phon: "loo-neh-DEE" },
  "Tuesday":                { word: "Martedì",               phon: "mar-teh-DEE" },
  "Wednesday":              { word: "Mercoledì",             phon: "mehr-koh-leh-DEE" },
  "Thursday":               { word: "Giovedì",               phon: "joh-veh-DEE" },
  "Friday":                 { word: "Venerdì",               phon: "veh-nehr-DEE" },
  "Saturday":               { word: "Sabato",                phon: "SAH-bah-toh" },
  "Sunday":                 { word: "Domenica",              phon: "doh-MEH-nee-kah" },

  // EXPANSION SET — COLORS
  "Purple":                 { word: "Viola",                 phon: "VYOH-lah" },
  "Orange (color)":         { word: "Arancione",             phon: "ah-rahn-CHOH-neh" },
  "Pink":                   { word: "Rosa",                  phon: "ROH-zah" },
  "White":                  { word: "Bianco",                phon: "BYAHN-koh" },
  "Black":                  { word: "Nero",                  phon: "NEH-roh" },
  "Brown":                  { word: "Marrone",               phon: "mahr-ROH-neh" },

  // EXPANSION SET — PHRASES
  "You're welcome":         { word: "Prego",                 phon: "PREH-goh" },
  "How old are you?":       { word: "Quanti anni hai?",      phon: "KWAHN-tee AHN-nee AI" },
  "Can I have...":          { word: "Posso avere...?",       phon: "POHS-soh ah-VEH-reh" },
  "I'm sorry":              { word: "Mi dispiace",           phon: "mee dees-PYAH-cheh" },
  "More please":            { word: "Ancora, per favore",    phon: "ahn-KOH-rah pehr fah-VOH-reh" },
};

for (const card of flashcards) {
  const it = ITALIAN_TRANSLATIONS[card.english];
  if (it) {
    card.italian = it.word;
    card.romanization.italian = it.phon;
  }
}

/**
 * Hindi translations keyed by `english`. Devanagari script + kid-readable
 * Latin phonetic. No per-character breakdown — Devanagari is alphasyllabic
 * and the Latin phonetic effectively *is* the breakdown.
 */
const HINDI_TRANSLATIONS: Record<string, { word: string; phon: string }> = {
  // GREETINGS
  "Hello":                  { word: "नमस्ते",            phon: "nuh-mas-TAY" },
  "Thank you":              { word: "धन्यवाद",           phon: "DHAN-yuh-vahd" },
  "Good morning":           { word: "सुप्रभात",          phon: "soo-pruh-BHAHT" },
  "Good night":             { word: "शुभ रात्रि",        phon: "SHOOBH RAH-tree" },
  "Goodbye":                { word: "अलविदा",            phon: "ahl-vee-DAH" },
  "Please":                 { word: "कृपया",             phon: "KRIP-yah" },
  "Excuse me / Sorry":      { word: "माफ़ कीजिए",        phon: "MAHF KEE-jee-yeh" },
  "Yes":                    { word: "हाँ",               phon: "HAAN" },
  "No":                     { word: "नहीं",              phon: "nuh-HEEN" },

  // FAMILY
  "Mother / Mom":           { word: "माँ",               phon: "MAA" },
  "Father / Dad":           { word: "पिता",              phon: "pee-TAH" },
  "Sister":                 { word: "बहन",               phon: "BUH-hen" },
  "Brother":                { word: "भाई",               phon: "BHAI" },
  "Grandmother":            { word: "दादी",              phon: "DAH-dee" },
  "Grandfather":            { word: "दादा",              phon: "DAH-dah" },
  "Love":                   { word: "प्यार",             phon: "PYAR" },
  "I love you":             { word: "मैं तुमसे प्यार करता हूँ", phon: "main TOOM-seh PYAR KUR-tah HOON" },

  // FEELINGS
  "Happy":                  { word: "खुश",               phon: "KHOOSH" },
  "Sad":                    { word: "उदास",              phon: "oo-DAHS" },
  "Hungry":                 { word: "भूखा",              phon: "BHOO-khah" },
  "Tired":                  { word: "थका हुआ",           phon: "thuh-KAH hoo-AH" },
  "Big":                    { word: "बड़ा",              phon: "BUH-rah" },
  "Small":                  { word: "छोटा",              phon: "CHOH-tah" },
  "Beautiful":              { word: "सुंदर",             phon: "SOON-dur" },
  "Angry":                  { word: "ग़ुस्सा",           phon: "GOOS-sah" },
  "Scared":                 { word: "डरा हुआ",           phon: "duh-RAH hoo-AH" },
  "Hot":                    { word: "गरम",               phon: "guh-RUHM" },
  "Cold":                   { word: "ठंडा",              phon: "TUHN-dah" },
  "Fast":                   { word: "तेज़",              phon: "TAYZ" },
  "Slow":                   { word: "धीमा",              phon: "DHEE-mah" },
  "New":                    { word: "नया",               phon: "nuh-YAH" },
  "Old":                    { word: "पुराना",            phon: "poo-RAH-nah" },

  // FOOD
  "Water":                  { word: "पानी",              phon: "PAH-nee" },
  "Rice":                   { word: "चावल",              phon: "CHAH-vul" },
  "Milk":                   { word: "दूध",               phon: "DOODH" },
  "Fruit":                  { word: "फल",                phon: "FUHL" },
  "Delicious":              { word: "स्वादिष्ट",         phon: "SVAH-dishth" },
  "Bread":                  { word: "रोटी",              phon: "ROH-tee" },
  "Egg":                    { word: "अंडा",              phon: "UHN-dah" },
  "Apple":                  { word: "सेब",               phon: "SAYB" },
  "Banana":                 { word: "केला",              phon: "KAY-lah" },
  "Noodles":                { word: "नूडल्स",            phon: "NOO-duls" },
  "Soup":                   { word: "सूप",               phon: "SOOP" },
  "Tea":                    { word: "चाय",               phon: "CHAI" },
  "Cake":                   { word: "केक",               phon: "KAYK" },

  // ANIMALS
  "Cat":                    { word: "बिल्ली",            phon: "BIL-lee" },
  "Dog":                    { word: "कुत्ता",            phon: "KOOT-tah" },
  "Fish":                   { word: "मछली",              phon: "MUCH-lee" },
  "Bird":                   { word: "चिड़िया",           phon: "CHID-yah" },
  "Horse":                  { word: "घोड़ा",             phon: "GHOH-rah" },
  "Cow":                    { word: "गाय",               phon: "GAI" },
  "Pig":                    { word: "सुअर",              phon: "SOO-ur" },
  "Rabbit":                 { word: "खरगोश",             phon: "KHAR-gohsh" },
  "Mouse":                  { word: "चूहा",              phon: "CHOO-hah" },
  "Elephant":               { word: "हाथी",              phon: "HAH-thee" },
  "Lion":                   { word: "शेर",               phon: "SHAYR" },
  "Tiger":                  { word: "बाघ",               phon: "BAAGH" },

  // SCHOOL
  "School":                 { word: "स्कूल",             phon: "SKOOL" },
  "Book":                   { word: "किताब",             phon: "kee-TAAB" },
  "Teacher":                { word: "शिक्षक",            phon: "SHIK-shuk" },
  "Friend":                 { word: "दोस्त",             phon: "DOHST" },

  // NUMBERS
  "One":                    { word: "एक",                phon: "AYK" },
  "Two":                    { word: "दो",                phon: "DOH" },
  "Three":                  { word: "तीन",               phon: "TEEN" },
  "Four":                   { word: "चार",               phon: "CHAR" },
  "Five":                   { word: "पाँच",              phon: "PAANCH" },
  "Six":                    { word: "छह",                phon: "CHHEH" },
  "Seven":                  { word: "सात",               phon: "SAAT" },
  "Eight":                  { word: "आठ",                phon: "AATH" },
  "Nine":                   { word: "नौ",                phon: "NOW" },
  "Ten":                    { word: "दस",                phon: "DUS" },
  "Eleven":                 { word: "ग्यारह",            phon: "GYAH-ruh" },
  "Twelve":                 { word: "बारह",              phon: "BAH-ruh" },
  "Thirteen":               { word: "तेरह",              phon: "TEH-ruh" },
  "Twenty":                 { word: "बीस",               phon: "BEES" },
  "Thirty":                 { word: "तीस",               phon: "TEES" },
  "One person":             { word: "एक व्यक्ति",        phon: "AYK VYUK-tee" },
  "Two people":             { word: "दो लोग",            phon: "DOH LOHG" },
  "One thing":              { word: "एक चीज़",           phon: "AYK CHEEZ" },
  "Two things":             { word: "दो चीज़ें",         phon: "DOH CHEE-zen" },

  // COLORS
  "Red":                    { word: "लाल",               phon: "LAHL" },
  "Blue":                   { word: "नीला",              phon: "NEE-lah" },
  "Yellow":                 { word: "पीला",              phon: "PEE-lah" },
  "Green":                  { word: "हरा",               phon: "huh-RAH" },

  // PHRASES
  "Happy Birthday":         { word: "जन्मदिन मुबारक",    phon: "JUN-um-din moo-BAH-ruk" },
  "How are you?":           { word: "आप कैसे हैं?",      phon: "AHP KAY-say HAIN" },
  "My name is...":          { word: "मेरा नाम...है",     phon: "MEH-rah NAAM... hai" },
  "Nice to meet you":       { word: "आपसे मिलकर खुशी हुई", phon: "AHP-say mil-KUR khoo-SHEE hoo-EE" },
  "See you later":          { word: "फिर मिलेंगे",       phon: "fir mi-LEN-gay" },
  "Let's eat!":             { word: "चलो खाते हैं!",     phon: "CHUH-loh KHAH-tay HAIN" },
  "Good job!":              { word: "शाबाश!",            phon: "shah-BAHSH" },
  "What is this?":          { word: "यह क्या है?",       phon: "YEH KYAH HAI" },
  "Where is the bathroom?": { word: "बाथरूम कहाँ है?",   phon: "BAATH-room kuh-HAAN HAI" },
  "I don't understand":     { word: "मुझे समझ नहीं आया", phon: "MOO-jhay SUH-muj nuh-HEEN ah-YAH" },

  // BODY
  "Eyes":                   { word: "आँखें",             phon: "AAN-khen" },
  "Ears":                   { word: "कान",               phon: "KAAN" },
  "Nose":                   { word: "नाक",               phon: "NAAK" },
  "Mouth":                  { word: "मुँह",              phon: "MOONH" },
  "Hands":                  { word: "हाथ",               phon: "HAATH" },
  "Feet":                   { word: "पैर",               phon: "PAIR" },
  "Head":                   { word: "सिर",               phon: "SIR" },
  "Hair":                   { word: "बाल",               phon: "BAAL" },

  // TIME
  "Today":                  { word: "आज",                phon: "AAJ" },
  "Tomorrow":               { word: "कल",                phon: "KUHL" },
  "Yesterday":              { word: "कल",                phon: "KUHL" },
  "Morning":                { word: "सुबह",              phon: "SOO-buh" },
  "Night":                  { word: "रात",               phon: "RAAT" },
  "Week":                   { word: "हफ़्ता",            phon: "HUF-tah" },
  "Month":                  { word: "महीना",             phon: "muh-HEE-nah" },
  "Year":                   { word: "साल",               phon: "SAAL" },

  // ACTIONS
  "Eat":                    { word: "खाना",              phon: "KHAH-nah" },
  "Drink":                  { word: "पीना",              phon: "PEE-nah" },
  "Sleep":                  { word: "सोना",              phon: "SOH-nah" },
  "Run":                    { word: "दौड़ना",            phon: "DOR-nah" },
  "Walk":                   { word: "चलना",              phon: "CHUL-nah" },
  "Read":                   { word: "पढ़ना",             phon: "PURH-nah" },
  "Write":                  { word: "लिखना",             phon: "LIKH-nah" },
  "Sing":                   { word: "गाना",              phon: "GAH-nah" },

  // WEATHER
  "Sunny":                  { word: "धूप",               phon: "DHOOP" },
  "Rainy":                  { word: "बरसाती",            phon: "bur-SAH-tee" },
  "Cloudy":                 { word: "बादल",              phon: "BAH-dul" },
  "Snowy":                  { word: "बर्फीला",           phon: "bur-FEE-lah" },
  "Windy":                  { word: "हवादार",            phon: "huh-vah-DAHR" },

  // TRANSPORT
  "Car":                    { word: "कार",               phon: "KAR" },
  "Bus":                    { word: "बस",                phon: "BUS" },
  "Train":                  { word: "रेल",               phon: "RAYL" },
  "Plane":                  { word: "हवाई जहाज़",        phon: "huh-VAI juh-HAAZ" },
  "Bike":                   { word: "साइकिल",            phon: "SAI-kil" },
  "Boat":                   { word: "नाव",               phon: "NAAV" },

  // EXPANSION SET — FOOD
  "Orange (fruit)":         { word: "संतरा",             phon: "SUN-tuh-rah" },
  "Strawberry":             { word: "स्ट्रॉबेरी",        phon: "STRAW-beh-ree" },
  "Grape":                  { word: "अंगूर",             phon: "un-GOOR" },
  "Watermelon":             { word: "तरबूज़",            phon: "tur-BOOZ" },
  "Carrot":                 { word: "गाजर",              phon: "GAH-jur" },
  "Potato":                 { word: "आलू",               phon: "AH-loo" },
  "Breakfast":              { word: "नाश्ता",            phon: "NAHSH-tah" },
  "Lunch":                  { word: "दोपहर का खाना",     phon: "doh-PUH-her kah KHAH-nah" },
  "Dinner":                 { word: "रात का खाना",       phon: "RAAT kah KHAH-nah" },
  "Juice":                  { word: "रस",                phon: "RUS" },
  "Ice cream":              { word: "आइसक्रीम",          phon: "ICE-kreem" },
  "Cookie":                 { word: "बिस्किट",           phon: "BIS-kit" },
  "Cheese":                 { word: "पनीर",              phon: "puh-NEER" },
  "Butter":                 { word: "मक्खन",             phon: "MUKH-khun" },
  "Salt":                   { word: "नमक",               phon: "NUH-muk" },

  // EXPANSION SET — DAILY
  "Shirt":                  { word: "कमीज़",             phon: "kuh-MEEZ" },
  "Pants":                  { word: "पतलून",             phon: "put-LOON" },
  "Shoes":                  { word: "जूते",              phon: "JOO-tay" },
  "Socks":                  { word: "मोज़े",             phon: "MOH-zay" },
  "Hat":                    { word: "टोपी",              phon: "TOH-pee" },
  "Coat":                   { word: "कोट",               phon: "KOHT" },
  "Pajamas":                { word: "पजामा",             phon: "puh-JAH-mah" },
  "Brush teeth":            { word: "दाँत साफ़ करना",    phon: "DAANT SAAF KUR-nah" },
  "Wash hands":             { word: "हाथ धोना",          phon: "HAATH DHOH-nah" },
  "Take a bath":            { word: "नहाना",             phon: "nuh-HAH-nah" },
  "Bed":                    { word: "बिस्तर",            phon: "BIS-tur" },
  "Pillow":                 { word: "तकिया",             phon: "tuh-KEE-yah" },
  "Soap":                   { word: "साबुन",             phon: "SAH-boon" },
  "Towel":                  { word: "तौलिया",            phon: "TOW-lee-yah" },
  "Toothbrush":             { word: "टूथब्रश",           phon: "TOOTH-brush" },

  // EXPANSION SET — PLACES
  "Home":                   { word: "घर",                phon: "GHUR" },
  "Park":                   { word: "पार्क",             phon: "PARK" },
  "Store":                  { word: "दुकान",             phon: "doo-KAAN" },
  "Library":                { word: "पुस्तकालय",         phon: "POOS-tuh-kah-luy" },
  "Hospital":               { word: "अस्पताल",           phon: "us-puh-TAAL" },
  "Playground":             { word: "खेल का मैदान",      phon: "KHAYL kah MAI-daan" },

  // EXPANSION SET — ACTIONS
  "Play":                   { word: "खेलना",             phon: "KHAYL-nah" },
  "Jump":                   { word: "कूदना",             phon: "KOOD-nah" },
  "Draw":                   { word: "चित्र बनाना",       phon: "CHITR buh-NAH-nah" },
  "Sit":                    { word: "बैठना",             phon: "BAITH-nah" },
  "Stand":                  { word: "खड़ा होना",         phon: "khuh-RAH HOH-nah" },
  "Help":                   { word: "मदद करना",          phon: "muh-DUD KUR-nah" },

  // EXPANSION SET — TIME (days)
  "Monday":                 { word: "सोमवार",            phon: "SOHM-vahr" },
  "Tuesday":                { word: "मंगलवार",           phon: "MUN-gul-vahr" },
  "Wednesday":              { word: "बुधवार",            phon: "BOODH-vahr" },
  "Thursday":               { word: "गुरुवार",           phon: "GOO-roo-vahr" },
  "Friday":                 { word: "शुक्रवार",          phon: "SHOOK-ruh-vahr" },
  "Saturday":               { word: "शनिवार",            phon: "SHUH-nee-vahr" },
  "Sunday":                 { word: "रविवार",            phon: "RUH-vee-vahr" },

  // EXPANSION SET — COLORS
  "Purple":                 { word: "बैंगनी",            phon: "BAIN-guh-nee" },
  "Orange (color)":         { word: "नारंगी",            phon: "nah-RUN-gee" },
  "Pink":                   { word: "गुलाबी",            phon: "goo-LAH-bee" },
  "White":                  { word: "सफ़ेद",             phon: "suh-FAYD" },
  "Black":                  { word: "काला",              phon: "KAH-lah" },
  "Brown":                  { word: "भूरा",              phon: "BHOO-rah" },

  // EXPANSION SET — PHRASES
  "You're welcome":         { word: "आपका स्वागत है",    phon: "AHP-kah SVAH-gut HAI" },
  "How old are you?":       { word: "आपकी उम्र क्या है?", phon: "AHP-kee OOMR KYAH HAI" },
  "Can I have...":          { word: "क्या मुझे...मिल सकता है?", phon: "KYAH MOO-jhay... MIL SUK-tah HAI" },
  "I'm sorry":              { word: "मुझे माफ़ करें",    phon: "MOO-jhay MAHF kuh-REN" },
  "More please":            { word: "और कृपया",          phon: "AUR KRIP-yah" },
};

for (const card of flashcards) {
  const hi = HINDI_TRANSLATIONS[card.english];
  if (hi) {
    card.hindi = hi.word;
    card.romanization.hindi = hi.phon;
  }
}

export const categories = ['all', 'Greetings', 'Family', 'Feelings', 'Food', 'Animals', 'School', 'Numbers', 'Colors', 'Phrases', 'Body', 'Time', 'Actions', 'Weather', 'Transport', 'Daily', 'Places'];

export const CATEGORY_EMOJI: Record<string, string> = {
  all: '📚',
  Greetings: '👋',
  Family: '👨‍👩‍👧',
  Feelings: '😊',
  Food: '🍚',
  Animals: '🐱',
  School: '🏫',
  Numbers: '🔢',
  Colors: '🎨',
  Phrases: '💬',
  Body: '👀',
  Time: '⏰',
  Actions: '🏃',
  Weather: '☀️',
  Transport: '🚗',
  Daily: '🧼',
  Places: '🏞️',
};
