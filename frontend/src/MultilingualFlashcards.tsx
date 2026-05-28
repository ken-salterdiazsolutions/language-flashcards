import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ensureSignedIn, synthesizeSpeech } from './firebase';

type Lang = 'japanese' | 'korean' | 'mandarin';

const MultilingualFlashcards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Lang>('japanese');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showKanjiVersion, setShowKanjiVersion] = useState(false);
  const [showKanjiDetails, setShowKanjiDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);

  const flashcards = [
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

    // FOOD & DRINK
    { cat: "Food", english: "Water", japanese: "みず", korean: "물", mandarin: "水", romanization: { japanese: "mizu", korean: "mul", mandarin: "shuǐ" }, breakdown: { japanese: [{ char: "み", rom: "mi" },{ char: "ず", rom: "zu" }], korean: [{ char: "물", rom: "mul", meaning: "water" }], mandarin: [{ char: "水", rom: "shuǐ", meaning: "water" }] } },
    { cat: "Food", english: "Rice", japanese: "ごはん", korean: "밥", mandarin: "米饭", romanization: { japanese: "gohan", korean: "bap", mandarin: "mǐ fàn" }, breakdown: { japanese: [{ char: "ご", rom: "go", meaning: "polite" },{ char: "は", rom: "ha" },{ char: "ん", rom: "n", meaning: "meal/rice" }], korean: [{ char: "밥", rom: "bap", meaning: "rice/meal" }], mandarin: [{ char: "米", rom: "mǐ", meaning: "grain/rice" },{ char: "饭", rom: "fàn", meaning: "meal/rice" }] } },
    { cat: "Food", english: "Milk", japanese: "ぎゅうにゅう", korean: "우유", mandarin: "牛奶", romanization: { japanese: "gyuunyuu", korean: "uyu", mandarin: "niú nǎi" }, breakdown: { japanese: [{ char: "ぎ", rom: "gyu" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u", meaning: "cow" },{ char: "に", rom: "nyu" },{ char: "ゅ", rom: "" },{ char: "う", rom: "u", meaning: "milk" }], korean: [{ char: "우", rom: "u", meaning: "cow" },{ char: "유", rom: "yu", meaning: "milk" }], mandarin: [{ char: "牛", rom: "niú", meaning: "cow" },{ char: "奶", rom: "nǎi", meaning: "milk" }] } },
    { cat: "Food", english: "Fruit", japanese: "くだもの", korean: "과일", mandarin: "水果", romanization: { japanese: "kudamono", korean: "gwail", mandarin: "shuǐ guǒ" }, breakdown: { japanese: [{ char: "く", rom: "ku" },{ char: "だ", rom: "da" },{ char: "も", rom: "mo" },{ char: "の", rom: "no" }], korean: [{ char: "과", rom: "gwa", meaning: "fruit" },{ char: "일", rom: "il" }], mandarin: [{ char: "水", rom: "shuǐ", meaning: "water" },{ char: "果", rom: "guǒ", meaning: "fruit" }] } },
    { cat: "Food", english: "Delicious", japanese: "おいしい", korean: "맛있어요", mandarin: "好吃", romanization: { japanese: "oishii", korean: "masisseoyo", mandarin: "hǎo chī" }, breakdown: { japanese: [{ char: "お", rom: "o" },{ char: "い", rom: "i" },{ char: "し", rom: "shi" },{ char: "い", rom: "i" }], korean: [{ char: "맛", rom: "mat", meaning: "taste" },{ char: "있", rom: "iss", meaning: "exist" },{ char: "어", rom: "eo" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "好", rom: "hǎo", meaning: "good" },{ char: "吃", rom: "chī", meaning: "eat" }] } },

    // ANIMALS
    { cat: "Animals", english: "Cat", japanese: "ねこ", korean: "고양이", mandarin: "猫", romanization: { japanese: "neko", korean: "goyangi", mandarin: "māo" }, breakdown: { japanese: [{ char: "ね", rom: "ne" },{ char: "こ", rom: "ko" }], korean: [{ char: "고", rom: "go" },{ char: "양", rom: "yang" },{ char: "이", rom: "i" }], mandarin: [{ char: "猫", rom: "māo", meaning: "cat" }] } },
    { cat: "Animals", english: "Dog", japanese: "いぬ", korean: "개", mandarin: "狗", romanization: { japanese: "inu", korean: "gae", mandarin: "gǒu" }, breakdown: { japanese: [{ char: "い", rom: "i" },{ char: "ぬ", rom: "nu" }], korean: [{ char: "개", rom: "gae", meaning: "dog" }], mandarin: [{ char: "狗", rom: "gǒu", meaning: "dog" }] } },
    { cat: "Animals", english: "Fish", japanese: "さかな", korean: "물고기", mandarin: "鱼", romanization: { japanese: "sakana", korean: "mulgogi", mandarin: "yú" }, breakdown: { japanese: [{ char: "さ", rom: "sa" },{ char: "か", rom: "ka" },{ char: "な", rom: "na" }], korean: [{ char: "물", rom: "mul", meaning: "water" },{ char: "고", rom: "go" },{ char: "기", rom: "gi", meaning: "creature" }], mandarin: [{ char: "鱼", rom: "yú", meaning: "fish" }] } },
    { cat: "Animals", english: "Bird", japanese: "とり", korean: "새", mandarin: "鸟", romanization: { japanese: "tori", korean: "sae", mandarin: "niǎo" }, breakdown: { japanese: [{ char: "と", rom: "to" },{ char: "り", rom: "ri" }], korean: [{ char: "새", rom: "sae", meaning: "bird" }], mandarin: [{ char: "鸟", rom: "niǎo", meaning: "bird" }] } },

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
    { cat: "Phrases", english: "I don't understand", japanese: "わかりません", korean: "이해 못해요", mandarin: "我不明白", romanization: { japanese: "wakarimasen", korean: "ihae mothaeyo", mandarin: "wǒ bù míng bai" }, breakdown: { japanese: [{ char: "わ", rom: "wa" },{ char: "か", rom: "ka" },{ char: "り", rom: "ri", meaning: "understand" },{ char: "ま", rom: "ma" },{ char: "せ", rom: "se" },{ char: "ん", rom: "n", meaning: "not" }], korean: [{ char: "이", rom: "i" },{ char: "해", rom: "hae", meaning: "understand" },{ char: "못", rom: "mot", meaning: "cannot" },{ char: "해", rom: "hae", meaning: "do" },{ char: "요", rom: "yo", meaning: "polite" }], mandarin: [{ char: "我", rom: "wǒ", meaning: "I/me" },{ char: "不", rom: "bù", meaning: "not" },{ char: "明", rom: "míng", meaning: "bright/clear" },{ char: "白", rom: "bai", meaning: "white/understand" }] } }
  ];

  const categories = ['all', 'Greetings', 'Family', 'Feelings', 'Food', 'Animals', 'School', 'Numbers', 'Colors', 'Phrases'];
  const filtered = selectedCategory === 'all' ? flashcards : flashcards.filter(c => c.cat === selectedCategory);
  const card = filtered[currentCard] || filtered[0];
  const isKanjiCard = (card as { hasKanji?: boolean }).hasKanji && selectedLanguage === 'japanese';

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % filtered.length);
    setShowAnswer(false); setShowBreakdown(false); setShowKanjiVersion(false); setShowKanjiDetails(false);
  };
  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + filtered.length) % filtered.length);
    setShowAnswer(false); setShowBreakdown(false); setShowKanjiVersion(false); setShowKanjiDetails(false);
  };
  const flipCard = () => {
    setShowAnswer(!showAnswer); setShowBreakdown(false); setShowKanjiVersion(false); setShowKanjiDetails(false);
  };
  const playSound = async (text: string, lang: Lang) => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      await ensureSignedIn();
      const { data } = await synthesizeSpeech({ text, lang });
      const audio = new Audio(`data:${data.mimeType};base64,${data.audioBase64}`);
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('error', () => setIsPlaying(false));
      await audio.play();
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  const langColors: Record<Lang, { bg: string; border: string; abg: string; ab: string; t: string }> = {
    japanese: { bg: 'bg-red-100', border: 'border-red-300', abg: 'bg-red-200', ab: 'border-red-400', t: 'text-red-800' },
    korean: { bg: 'bg-blue-100', border: 'border-blue-300', abg: 'bg-blue-200', ab: 'border-blue-400', t: 'text-blue-800' },
    mandarin: { bg: 'bg-yellow-100', border: 'border-yellow-300', abg: 'bg-yellow-200', ab: 'border-yellow-400', t: 'text-yellow-800' }
  };
  const lc = langColors[selectedLanguage];

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6 bg-white min-h-screen">
      <div className="text-center mb-3 sm:mb-5">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1">Language Learning Flashcards</h1>
        <p className="text-xs sm:text-sm text-gray-500">Tap the card to reveal the translation!</p>
      </div>

      {/* Language Selection */}
      <div className="flex flex-col sm:flex-row justify-center mb-3 sm:mb-4 gap-2">
        {(['japanese', 'korean', 'mandarin'] as Lang[]).map((lang) => {
          const labels: Record<Lang, string> = { japanese: 'Japanese 日本語', korean: 'Korean 한국어', mandarin: 'Mandarin 中文' };
          const c = langColors[lang]; const active = selectedLanguage === lang;
          return (
            <button key={lang} onClick={() => { setSelectedLanguage(lang); setShowBreakdown(false); setShowKanjiVersion(false); setShowKanjiDetails(false); }}
              className={`px-3 py-2 rounded-lg border-2 text-sm sm:text-base transition-colors ${active ? `${c.abg} ${c.ab} ${c.t}` : 'bg-gray-100 border-gray-300 text-gray-700'}`}>
              {labels[lang]}
            </button>
          );
        })}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-5">
        {categories.map((cat) => (
          <button key={cat} onClick={() => { setSelectedCategory(cat); setCurrentCard(0); setShowAnswer(false); setShowBreakdown(false); setShowKanjiVersion(false); setShowKanjiDetails(false); }}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${selectedCategory === cat ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
            {cat === 'all' ? '📚 All' : cat === 'Greetings' ? '👋 Greetings' : cat === 'Family' ? '👨‍👩‍👧 Family' : cat === 'Feelings' ? '😊 Feelings' : cat === 'Food' ? '🍚 Food' : cat === 'Animals' ? '🐱 Animals' : cat === 'School' ? '🏫 School' : cat === 'Numbers' ? '🔢 Numbers' : cat === 'Colors' ? '🎨 Colors' : '💬 Phrases'}
          </button>
        ))}
      </div>

      {/* Flashcard */}
      <div className={`w-full h-44 sm:h-64 rounded-xl border-4 cursor-pointer transition-all duration-300 hover:shadow-lg mb-4 ${lc.bg} ${lc.border}`} onClick={flipCard}>
        <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6">
          {!showAnswer ? (
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">{card.cat}</div>
              <div className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">{card.english}</div>
              <div className="text-xs sm:text-sm text-gray-500">Tap to see translation</div>
            </div>
          ) : (
            <div className="text-center space-y-1.5 sm:space-y-3">
              <div className="text-2xl sm:text-5xl font-bold text-gray-800 break-words">{card[selectedLanguage]}</div>
              <div className="text-sm sm:text-xl text-gray-600">{card.romanization[selectedLanguage]}</div>
              <div className="text-xs sm:text-lg text-gray-500">({card.english})</div>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      {showAnswer && (
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-4">
          <button onClick={() => playSound(card[selectedLanguage], selectedLanguage)} disabled={isPlaying}
            className="w-full sm:w-auto px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-wait text-white rounded-lg text-sm sm:text-lg font-semibold shadow-lg transition-colors inline-flex items-center justify-center gap-2">
            {isPlaying ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading…
              </>
            ) : (
              <>🔊 PLAY SOUND</>
            )}
          </button>
          <button onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full sm:w-auto px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm sm:text-lg font-semibold shadow-lg transition-colors">
            {showBreakdown ? '📚 Hide Breakdown' : '🔍 Show Breakdown'}
          </button>
          {isKanjiCard && (
            <button onClick={() => { setShowKanjiVersion(!showKanjiVersion); setShowKanjiDetails(false); }}
              className="w-full sm:w-auto px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm sm:text-lg font-semibold shadow-lg transition-colors">
              {showKanjiVersion ? '✏️ Hide Kanji' : '✏️ Show Kanji'}
            </button>
          )}
        </div>
      )}

      {/* Kanji Version */}
      {showAnswer && showKanjiVersion && isKanjiCard && (
        <div className="mb-4 p-3 sm:p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
          <div className="text-center">
            <div className="text-sm sm:text-lg text-blue-800 font-bold mb-2">✏️ Kanji Version (For Calligraphy!)</div>
            <div className="text-3xl sm:text-5xl font-bold text-blue-900 mb-3 tracking-wider">誕生日おめでとう</div>
            <div className="text-xs sm:text-sm text-blue-700 mb-3">Perfect for calligraphy practice!</div>
            <button onClick={() => setShowKanjiDetails(!showKanjiDetails)}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors">
              {showKanjiDetails ? '📖 Hide Kanji Meanings' : '🔍 Show Kanji Meanings'}
            </button>
            {showKanjiDetails && (
              <div className="mt-3 p-3 bg-white rounded-lg border">
                <div className="text-xs sm:text-sm text-gray-800 font-semibold mb-3">Individual Kanji Meanings:</div>
                <div className="flex justify-center gap-4 sm:gap-8">
                  {[{ char: '誕', rom: 'tan', meaning: 'birth/be born' },{ char: '生', rom: 'jou', meaning: 'life/living' },{ char: '日', rom: 'bi', meaning: 'day/sun' }].map((k, i) => (
                    <div key={i} className="text-center">
                      <div className="text-3xl sm:text-5xl font-bold mb-1">{k.char}</div>
                      <div className="text-xs sm:text-sm text-blue-700 font-medium">{k.rom}</div>
                      <div className="text-xs text-gray-600">{k.meaning}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-3 p-2 bg-gray-50 rounded italic">
                  誕生日 = "birth" + "life" + "day" = birthday! 🎂
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Character Breakdown */}
      {showAnswer && showBreakdown && (
        <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg border">
          <div className="text-center mb-3">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800">Character Breakdown:</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {card.breakdown[selectedLanguage].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-2 sm:p-3 text-center min-w-[40px] sm:min-w-[55px] border shadow-sm">
                <div className="text-lg sm:text-2xl font-bold mb-1">{item.char}</div>
                <div className="text-xs sm:text-sm text-blue-600 font-medium">{item.rom}</div>
                {item.meaning && (
                  <div className={`text-xs mt-1 italic ${item.meaning === '(sound)' ? 'text-gray-400' : 'text-gray-600'}`}>({item.meaning})</div>
                )}
              </div>
            ))}
          </div>
          {selectedLanguage === 'japanese' && (
            <div className="mt-3 text-xs text-gray-500 text-center">
              <p><strong>Note:</strong> "(sound)" = hiragana (just sounds). Other characters are kanji (have meanings).</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevCard} className="flex items-center px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm sm:text-base">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" /> Prev
        </button>
        <span className="text-sm sm:text-base text-gray-600 font-medium">{currentCard + 1} / {filtered.length}</span>
        <button onClick={nextCard} className="flex items-center px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm sm:text-base">
          Next <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
        </button>
      </div>

      {/* Instructions */}
      <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 p-3 rounded-lg space-y-1">
        <p className="font-semibold text-gray-700 mb-1">How to use:</p>
        <p>1. Pick a language, then filter by category or browse all {flashcards.length} cards</p>
        <p>2. Tap the card to reveal the translation</p>
        <p>3. 🔊 Play Sound → 🔍 Show Breakdown → ✏️ Show Kanji (when available)</p>
      </div>
    </div>
  );
};

export default MultilingualFlashcards;