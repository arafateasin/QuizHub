import mongoose from "mongoose";
import dotenv from "dotenv";
import { Quiz } from "../models/quiz.model";
import { connectDatabase } from "../config/database";
import { logger } from "../utils/logger";
import { QUIZ_CATEGORIES } from "@quizhub/shared";

dotenv.config();

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

// Helper to create question objects
const q = (type: string, question: string, correctAnswer: string, options?: string[], explanation?: string) => ({
  type,
  question,
  options,
  correctAnswer,
  explanation,
  points: 10
});

const QUESTIONS_BY_CATEGORY: Record<string, Record<string, any[]>> = {
  "Mathematics": {
    "EASY": [
      q("SHORT_ANSWER", "What is 5 + 7?", "12", undefined, "Basic addition."),
      q("MULTIPLE_CHOICE", "Which number is even?", "4", ["1", "3", "4", "5"]),
      q("TRUE_FALSE", "A square has 4 sides.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What is 10 - 3?", "7"),
      q("MULTIPLE_CHOICE", "What is 3 x 3?", "9", ["6", "9", "12", "15"]),
    ],
    "MEDIUM": [
      q("SHORT_ANSWER", "What is 12 x 12?", "144"),
      q("MULTIPLE_CHOICE", "What is the square root of 81?", "9", ["7", "8", "9", "10"]),
      q("TRUE_FALSE", "Pi is a rational number.", "False", ["True", "False"], "Pi is irrational."),
      q("SHORT_ANSWER", "Solve for x: 3x + 5 = 20", "5"),
      q("MULTIPLE_CHOICE", "What is 15% of 200?", "30", ["20", "30", "40", "50"]),
    ],
    "HARD": [
      q("SHORT_ANSWER", "What is the derivative of x^2?", "2x"),
      q("MULTIPLE_CHOICE", "What is the value of sin(30) degrees?", "0.5", ["0.5", "1", "0", "0.866"]),
      q("TRUE_FALSE", "The sum of angles in a triangle is 180 degrees.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What is the binary representation of 10?", "1010"),
      q("MULTIPLE_CHOICE", "What is the next prime number after 7?", "11", ["9", "10", "11", "13"]),
    ]
  },
  "Science": {
    "EASY": [
      q("TRUE_FALSE", "The sun is a star.", "True", ["True", "False"]),
      q("MULTIPLE_CHOICE", "What do humans breathe to survive?", "Oxygen", ["Helium", "Oxygen", "Carbon", "Nitrogen"]),
      q("SHORT_ANSWER", "How many legs does a spider have?", "8"),
      q("MULTIPLE_CHOICE", "Which planet is known as the Red Planet?", "Mars", ["Venus", "Mars", "Jupiter", "Saturn"]),
      q("TRUE_FALSE", "Ice is hot.", "False", ["True", "False"]),
    ],
    "MEDIUM": [
      q("MULTIPLE_CHOICE", "What is the chemical symbol for Gold?", "Au", ["Au", "Ag", "Fe", "Cu"]),
      q("TRUE_FALSE", "Sound travels faster in water than in air.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What is the powerhouse of the cell?", "Mitochondria"),
      q("MULTIPLE_CHOICE", "Which gas is most abundant in Earth's atmosphere?", "Nitrogen", ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"]),
      q("SHORT_ANSWER", "What is the boiling point of water in Celsius?", "100"),
    ],
    "HARD": [
      q("MULTIPLE_CHOICE", "What is the speed of light?", "299,792,458 m/s", ["300,000 km/s", "299,792,458 m/s", "150,000 km/s", "Unknown"]),
      q("TRUE_FALSE", "Electrons have a positive charge.", "False", ["True", "False"], "Protons are positive, electrons are negative."),
      q("SHORT_ANSWER", "What is the heaviest naturally occurring element?", "Uranium"),
      q("MULTIPLE_CHOICE", "Who proposed the theory of relativity?", "Einstein", ["Newton", "Einstein", "Tesla", "Hawking"]),
      q("SHORT_ANSWER", "What is the pH of pure water?", "7"),
    ]
  },
  "History": {
    "EASY": [
      q("MULTIPLE_CHOICE", "Who was the first US President?", "Washington", ["Lincoln", "Washington", "Jefferson", "Adams"]),
      q("TRUE_FALSE", "The Titanic sank.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "In which country are the Pyramids?", "Egypt"),
      q("MULTIPLE_CHOICE", "Who discovered America?", "Columbus", ["Columbus", "Magellan", "Cook", "Vespucci"]),
      q("TRUE_FALSE", "Dinosaurs are still alive.", "False", ["True", "False"]),
    ],
    "MEDIUM": [
      q("SHORT_ANSWER", "In which year did WWII end?", "1945"),
      q("MULTIPLE_CHOICE", "Which empire built the Colosseum?", "Roman", ["Greek", "Roman", "Ottoman", "British"]),
      q("TRUE_FALSE", "The Berlin Wall fell in 1989.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "Who wrote the Declaration of Independence?", "Thomas Jefferson"),
      q("MULTIPLE_CHOICE", "Which war was fought between North and South USA?", "Civil War", ["WWI", "WWII", "Civil War", "Revolutionary War"]),
    ],
    "HARD": [
      q("MULTIPLE_CHOICE", "Who was the first Emperor of Rome?", "Augustus", ["Julius Caesar", "Augustus", "Nero", "Trajan"]),
      q("TRUE_FALSE", "The Magna Carta was signed in 1215.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "Who was the British Prime Minister during WWII?", "Winston Churchill"),
      q("MULTIPLE_CHOICE", "Which revolution started in 1789?", "French Revolution", ["American", "French", "Russian", "Industrial"]),
      q("SHORT_ANSWER", "What was the name of the ship that brought the Pilgrims to America?", "Mayflower"),
    ]
  },
  "Geography": {
    "EASY": [
      q("MULTIPLE_CHOICE", "What is the capital of France?", "Paris", ["London", "Berlin", "Paris", "Madrid"]),
      q("TRUE_FALSE", "The Earth is round.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "Which continent is the USA in?", "North America"),
      q("MULTIPLE_CHOICE", "What is the largest ocean?", "Pacific", ["Atlantic", "Indian", "Arctic", "Pacific"]),
      q("TRUE_FALSE", "Antarctica is hot.", "False", ["True", "False"]),
    ],
    "MEDIUM": [
      q("SHORT_ANSWER", "What is the capital of Japan?", "Tokyo"),
      q("MULTIPLE_CHOICE", "Which is the longest river in the world?", "Nile", ["Amazon", "Nile", "Yangtze", "Mississippi"]),
      q("TRUE_FALSE", "Australia is both a country and a continent.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "Which country has the most people?", "China"), // Or India depending on data, but usually China in quizzes
      q("MULTIPLE_CHOICE", "What is the smallest country in the world?", "Vatican City", ["Monaco", "Vatican City", "Malta", "San Marino"]),
    ],
    "HARD": [
      q("MULTIPLE_CHOICE", "What is the capital of Australia?", "Canberra", ["Sydney", "Melbourne", "Canberra", "Perth"]),
      q("TRUE_FALSE", "The Amazon River flows into the Pacific Ocean.", "False", ["True", "False"], "It flows into the Atlantic."),
      q("SHORT_ANSWER", "Which mountain range separates Europe and Asia?", "Ural"),
      q("MULTIPLE_CHOICE", "Which African country was formerly known as Abyssinia?", "Ethiopia", ["Ethiopia", "Sudan", "Kenya", "Nigeria"]),
      q("SHORT_ANSWER", "What is the deepest point in the ocean?", "Mariana Trench"),
    ]
  },
  "Literature": {
    "EASY": [
      q("MULTIPLE_CHOICE", "Who wrote 'Romeo and Juliet'?", "Shakespeare", ["Dickens", "Shakespeare", "Austen", "Twain"]),
      q("TRUE_FALSE", "Harry Potter is a wizard.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What kind of animal is Moby Dick?", "Whale"),
      q("MULTIPLE_CHOICE", "Who wrote 'The Cat in the Hat'?", "Dr. Seuss", ["Dr. Seuss", "Roald Dahl", "JK Rowling", "Disney"]),
      q("TRUE_FALSE", "Batman is a Marvel character.", "False", ["True", "False"]),
    ],
    "MEDIUM": [
      q("SHORT_ANSWER", "Who wrote '1984'?", "George Orwell"),
      q("MULTIPLE_CHOICE", "Who wrote 'Pride and Prejudice'?", "Austen", ["Bronte", "Austen", "Woolf", "Shelley"]),
      q("TRUE_FALSE", "Sherlock Holmes lived at 221B Baker Street.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "Who is the author of 'The Great Gatsby'?", "F. Scott Fitzgerald"),
      q("MULTIPLE_CHOICE", "Which book features a character named Scout Finch?", "To Kill a Mockingbird", ["1984", "The Great Gatsby", "To Kill a Mockingbird", "Catcher in the Rye"]),
    ],
    "HARD": [
      q("MULTIPLE_CHOICE", "Who wrote 'War and Peace'?", "Tolstoy", ["Dostoevsky", "Tolstoy", "Chekhov", "Pushkin"]),
      q("TRUE_FALSE", "Mary Shelley wrote Frankenstein.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What is the pen name of Samuel Clemens?", "Mark Twain"),
      q("MULTIPLE_CHOICE", "In which century was 'Don Quixote' published?", "17th", ["15th", "16th", "17th", "18th"]),
      q("SHORT_ANSWER", "Who wrote the epic poem 'The Odyssey'?", "Homer"),
    ]
  },
  "Programming": {
    "EASY": [
      q("MULTIPLE_CHOICE", "What does HTML stand for?", "Hyper Text Markup Language", ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tabular Markup Language", "None"]),
      q("TRUE_FALSE", "Computers use binary code.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "Which language is used for styling web pages?", "CSS"),
      q("MULTIPLE_CHOICE", "Which is a programming language?", "Python", ["HTML", "CSS", "Python", "MP3"]),
      q("TRUE_FALSE", "A mouse is an output device.", "False", ["True", "False"]),
    ],
    "MEDIUM": [
      q("SHORT_ANSWER", "What does SQL stand for?", "Structured Query Language"),
      q("MULTIPLE_CHOICE", "Which symbol is used for comments in Python?", "#", ["//", "#", "/*", "--"]),
      q("TRUE_FALSE", "Java is the same as JavaScript.", "False", ["True", "False"]),
      q("SHORT_ANSWER", "What is the main language for Android development?", "Kotlin"),
      q("MULTIPLE_CHOICE", "Which company created React?", "Facebook", ["Google", "Facebook", "Microsoft", "Apple"]),
    ],
    "HARD": [
      q("MULTIPLE_CHOICE", "What is the time complexity of binary search?", "O(log n)", ["O(n)", "O(log n)", "O(n^2)", "O(1)"]),
      q("TRUE_FALSE", "Rust is a garbage-collected language.", "False", ["True", "False"]),
      q("SHORT_ANSWER", "What does REST stand for in API?", "Representational State Transfer"),
      q("MULTIPLE_CHOICE", "Which design pattern ensures a class has only one instance?", "Singleton", ["Factory", "Singleton", "Observer", "Strategy"]),
      q("SHORT_ANSWER", "What is the default port for HTTP?", "80"),
    ]
  },
  "General Knowledge": {
    "EASY": [
      q("MULTIPLE_CHOICE", "How many days are in a week?", "7", ["5", "6", "7", "8"]),
      q("TRUE_FALSE", "The sun rises in the East.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What color is the sky?", "Blue"),
      q("MULTIPLE_CHOICE", "Which animal says 'Moo'?", "Cow", ["Dog", "Cat", "Cow", "Pig"]),
      q("TRUE_FALSE", "Fish live in water.", "True", ["True", "False"]),
    ],
    "MEDIUM": [
      q("MULTIPLE_CHOICE", "How many days are in a leap year?", "366", ["365", "366", "364", "367"]),
      q("TRUE_FALSE", "Honey never spoils.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What is the largest mammal?", "Blue Whale"),
      q("MULTIPLE_CHOICE", "Which color starts first in chess?", "White", ["Black", "White", "Red", "Blue"]),
      q("SHORT_ANSWER", "How many legs does an insect have?", "6"),
    ],
    "HARD": [
      q("MULTIPLE_CHOICE", "Which element has the atomic number 1?", "Hydrogen", ["Helium", "Hydrogen", "Lithium", "Carbon"]),
      q("TRUE_FALSE", "The unicorn is the national animal of Scotland.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What is the currency of Japan?", "Yen"),
      q("MULTIPLE_CHOICE", "Who painted 'The Scream'?", "Edvard Munch", ["Van Gogh", "Munch", "Picasso", "Dali"]),
      q("SHORT_ANSWER", "What is the capital of Canada?", "Ottawa"),
    ]
  },
  "Languages": {
    "EASY": [
      q("MULTIPLE_CHOICE", "What is 'Hello' in Spanish?", "Hola", ["Hola", "Bonjour", "Ciao", "Hallo"]),
      q("TRUE_FALSE", "English is spoken in the USA.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What language do they speak in France?", "French"),
      q("MULTIPLE_CHOICE", "Which is a vowel?", "A", ["B", "C", "A", "D"]),
      q("TRUE_FALSE", "Cat is a verb.", "False", ["True", "False"]),
    ],
    "MEDIUM": [
      q("SHORT_ANSWER", "What language is spoken in Brazil?", "Portuguese"),
      q("MULTIPLE_CHOICE", "Which language has the most native speakers?", "Mandarin", ["English", "Spanish", "Mandarin", "Hindi"]),
      q("TRUE_FALSE", "German is a Romance language.", "False", ["True", "False"]),
      q("SHORT_ANSWER", "What is 'Thank you' in German?", "Danke"),
      q("MULTIPLE_CHOICE", "Which script is used for Russian?", "Cyrillic", ["Latin", "Cyrillic", "Arabic", "Devanagari"]),
    ],
    "HARD": [
      q("MULTIPLE_CHOICE", "How many official languages does Switzerland have?", "4", ["2", "3", "4", "5"]),
      q("TRUE_FALSE", "Esperanto is a constructed language.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What is the study of language called?", "Linguistics"),
      q("MULTIPLE_CHOICE", "Which language family does English belong to?", "Germanic", ["Romance", "Germanic", "Slavic", "Celtic"]),
      q("SHORT_ANSWER", "What is the official language of Iran?", "Persian"),
    ]
  },
  "Arts": {
    "EASY": [
      q("MULTIPLE_CHOICE", "Which color is mixed with red to make orange?", "Yellow", ["Blue", "Green", "Yellow", "Purple"]),
      q("TRUE_FALSE", "The Mona Lisa is a painting.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What do you use to paint?", "Brush"),
      q("MULTIPLE_CHOICE", "Which is a primary color?", "Blue", ["Green", "Orange", "Blue", "Purple"]),
      q("TRUE_FALSE", "Statues are made of stone.", "True", ["True", "False"]),
    ],
    "MEDIUM": [
      q("MULTIPLE_CHOICE", "Who painted the Mona Lisa?", "Da Vinci", ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"]),
      q("TRUE_FALSE", "Picasso is known for Cubism.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What is the art of folding paper called?", "Origami"),
      q("MULTIPLE_CHOICE", "Who painted the Sistine Chapel ceiling?", "Michelangelo", ["Raphael", "Michelangelo", "Donatello", "Leonardo"]),
      q("SHORT_ANSWER", "What tool do painters use to hold paints?", "Palette"),
    ],
    "HARD": [
      q("MULTIPLE_CHOICE", "Who sculpted David?", "Michelangelo", ["Bernini", "Rodin", "Donatello", "Michelangelo"]),
      q("TRUE_FALSE", "Frida Kahlo was Mexican.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "Which art movement is Salvador Dali associated with?", "Surrealism"),
      q("MULTIPLE_CHOICE", "Who painted 'The Starry Night'?", "Van Gogh", ["Monet", "Manet", "Van Gogh", "Degas"]),
      q("SHORT_ANSWER", "What is the technique of painting on wet plaster called?", "Fresco"),
    ]
  },
  "Sports": {
    "EASY": [
      q("MULTIPLE_CHOICE", "Which sport uses a shuttlecock?", "Badminton", ["Tennis", "Badminton", "Squash", "Ping Pong"]),
      q("TRUE_FALSE", "Soccer is played with a ball.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "How many players are on a soccer team?", "11"),
      q("MULTIPLE_CHOICE", "In which sport do you score a touchdown?", "American Football", ["Soccer", "Rugby", "American Football", "Hockey"]),
      q("TRUE_FALSE", "Golf is played on a court.", "False", ["True", "False"]),
    ],
    "MEDIUM": [
      q("SHORT_ANSWER", "What is the national sport of Japan?", "Sumo"),
      q("MULTIPLE_CHOICE", "Which country won the 2018 World Cup?", "France", ["Brazil", "Germany", "France", "Spain"]),
      q("TRUE_FALSE", "The Olympics are held every 4 years.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "How many innings are in a baseball game?", "9"),
      q("MULTIPLE_CHOICE", "Which sport is played at Wimbledon?", "Tennis", ["Cricket", "Tennis", "Rugby", "Golf"]),
    ],
    "HARD": [
      q("MULTIPLE_CHOICE", "Who has won the most Olympic gold medals?", "Michael Phelps", ["Bolt", "Phelps", "Lewis", "Spitz"]),
      q("TRUE_FALSE", "A marathon is 42.195 kilometers.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "Which country hosted the 2008 Summer Olympics?", "China"),
      q("MULTIPLE_CHOICE", "In bowling, what is it called when you knock down all pins?", "Strike", ["Spare", "Strike", "Turkey", "Split"]),
      q("SHORT_ANSWER", "What is the diameter of a basketball hoop in inches?", "18"),
    ]
  },
  "Technology": {
    "EASY": [
      q("MULTIPLE_CHOICE", "Who makes the iPhone?", "Apple", ["Samsung", "Google", "Apple", "Sony"]),
      q("TRUE_FALSE", "You can touch a touchscreen.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What do you use to type on a computer?", "Keyboard"),
      q("MULTIPLE_CHOICE", "Which is a social media app?", "Instagram", ["Excel", "Instagram", "Word", "Photoshop"]),
      q("TRUE_FALSE", "The internet is a physical place.", "False", ["True", "False"]),
    ],
    "MEDIUM": [
      q("MULTIPLE_CHOICE", "Who founded Microsoft?", "Gates", ["Jobs", "Gates", "Musk", "Zuckerberg"]),
      q("TRUE_FALSE", "RAM stands for Random Access Memory.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What does CPU stand for?", "Central Processing Unit"),
      q("MULTIPLE_CHOICE", "What does USB stand for?", "Universal Serial Bus", ["Universal Serial Bus", "United Serial Bus", "Universal System Bus", "None"]),
      q("SHORT_ANSWER", "Who is the CEO of Tesla?", "Elon Musk"),
    ],
    "HARD": [
      q("MULTIPLE_CHOICE", "What year was the first iPhone released?", "2007", ["2005", "2006", "2007", "2008"]),
      q("TRUE_FALSE", "HTTP uses port 443 by default.", "False", ["True", "False"], "HTTP uses 80, HTTPS uses 443."),
      q("SHORT_ANSWER", "What does GPU stand for?", "Graphics Processing Unit"),
      q("MULTIPLE_CHOICE", "Which company owns Android?", "Google", ["Apple", "Microsoft", "Google", "Samsung"]),
      q("SHORT_ANSWER", "What is the programming language used for Ethereum smart contracts?", "Solidity"),
    ]
  },
  "Business": {
    "EASY": [
      q("MULTIPLE_CHOICE", "What do you use to buy things?", "Money", ["Money", "Rocks", "Leaves", "Sand"]),
      q("TRUE_FALSE", "Banks keep money safe.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What is the currency of the USA?", "Dollar"),
      q("MULTIPLE_CHOICE", "Where do you buy stocks?", "Stock Market", ["Supermarket", "Stock Market", "Fish Market", "Flea Market"]),
      q("TRUE_FALSE", "A boss is an employee.", "True", ["True", "False"]),
    ],
    "MEDIUM": [
      q("MULTIPLE_CHOICE", "What does CEO stand for?", "Chief Executive Officer", ["Chief Executive Officer", "Chief Everything Officer", "Central Executive Officer", "None"]),
      q("TRUE_FALSE", "A bear market means prices are rising.", "False", ["True", "False"]),
      q("SHORT_ANSWER", "What do you call a person who starts a business?", "Entrepreneur"),
      q("MULTIPLE_CHOICE", "Which company is the largest by market cap?", "Apple", ["Apple", "Amazon", "Google", "Microsoft"]),
      q("SHORT_ANSWER", "What is a plan for spending money called?", "Budget"),
    ],
    "HARD": [
      q("MULTIPLE_CHOICE", "What does IPO stand for?", "Initial Public Offering", ["Initial Private Offering", "Initial Public Offering", "International Public Offering", "Internal Public Offering"]),
      q("TRUE_FALSE", "Assets = Liabilities + Equity.", "True", ["True", "False"]),
      q("SHORT_ANSWER", "What is the term for rising prices?", "Inflation"),
      q("MULTIPLE_CHOICE", "Which index tracks the top 500 US companies?", "S&P 500", ["Dow Jones", "Nasdaq", "S&P 500", "Russell 2000"]),
      q("SHORT_ANSWER", "Who is the Oracle of Omaha?", "Warren Buffett"),
    ]
  }
};

const generateQuiz = (category: string, difficulty: string, index: number) => {
  // Get questions for the specific category and difficulty
  const categoryData = QUESTIONS_BY_CATEGORY[category] || QUESTIONS_BY_CATEGORY["General Knowledge"];
  const difficultyQuestions = categoryData[difficulty] || categoryData["MEDIUM"];
  
  // Shuffle questions
  const questions = [...difficultyQuestions].sort(() => 0.5 - Math.random());
  
  return {
    title: `${category} Quiz ${index + 1} - ${difficulty}`,
    description: `A ${difficulty.toLowerCase()} level quiz to test your knowledge in ${category}.`,
    category,
    difficulty,
    questions,
    createdBy: "system_admin",
    isPublic: true,
    timeLimit: difficulty === "EASY" ? 5 : difficulty === "MEDIUM" ? 10 : 15,
    passingScore: difficulty === "EASY" ? 60 : difficulty === "MEDIUM" ? 70 : 80,
    totalAttempts: Math.floor(Math.random() * 100),
    averageScore: Math.floor(Math.random() * 40) + 60,
  };
};

const seedDatabase = async () => {
  try {
    await connectDatabase();
    
    logger.info("🗑️  Cleaning existing quizzes...");
    await Quiz.deleteMany({});
    
    logger.info("🌱 Seeding quizzes...");
    
    const quizzes = [];
    
    // Generate 3 quizzes for each category and difficulty combination
    for (const category of QUIZ_CATEGORIES) {
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < 3; i++) {
          quizzes.push(generateQuiz(category, difficulty, i));
        }
      }
    }
    
    await Quiz.insertMany(quizzes);
    
    logger.info(`✅ Successfully seeded ${quizzes.length} quizzes!`);
    logger.info("Categories covered:");
    QUIZ_CATEGORIES.forEach(cat => logger.info(`- ${cat}`));
    
    process.exit(0);
  } catch (error) {
    logger.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
