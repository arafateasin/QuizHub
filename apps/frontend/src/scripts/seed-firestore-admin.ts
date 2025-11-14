/**
 * Admin Script to Seed Firestore
 * Uses Firebase Admin SDK with elevated permissions
 * Run with: npm run seed:firestore:admin
 */

import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp({
  projectId: "quizhub-98649",
});

const db = admin.firestore();

async function seedFirestore() {
  console.log("🌱 Starting Firestore seeding with Admin SDK...");

  try {
    // 1. Create Course
    console.log("📚 Creating course...");
    const courseRef = await db.collection("courses").add({
      name: "Computer Science",
      description: "Comprehensive computer science curriculum",
      icon: "💻",
      isActive: true,
      order: 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const courseId = courseRef.id;
    console.log(`✅ Created course: Computer Science (${courseId})`);

    // 2. Create Program
    console.log("🎓 Creating program...");
    const programRef = await db.collection("programs").add({
      courseId,
      name: "Software Engineering",
      description: "Professional software development track",
      icon: "⚙️",
      isActive: true,
      order: 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const programId = programRef.id;
    console.log(`✅ Created program: Software Engineering (${programId})`);

    // 3. Create Subjects
    console.log("📖 Creating subjects...");
    const subjects = [
      {
        name: "App Development",
        description: "Mobile and web application development",
        icon: "📱",
      },
      {
        name: "Java Programming",
        description: "Object-oriented programming with Java",
        icon: "☕",
      },
      {
        name: "System Architecture",
        description: "Software architecture and design patterns",
        icon: "🏗️",
      },
    ];

    const subjectIds: string[] = [];
    for (let i = 0; i < subjects.length; i++) {
      const subjectRef = await db.collection("subjects").add({
        programId,
        courseId,
        name: subjects[i].name,
        description: subjects[i].description,
        icon: subjects[i].icon,
        isActive: true,
        order: i + 1,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      subjectIds.push(subjectRef.id);
      console.log(`✅ Created subject: ${subjects[i].name}`);
    }

    // 4. Create Chapters
    console.log("📑 Creating chapters...");
    const chapters = [
      {
        subjectId: subjectIds[0],
        name: "Introduction to App Development",
        description: "Basics of mobile app development",
        icon: "🚀",
      },
      {
        subjectId: subjectIds[0],
        name: "UI/UX Design Principles",
        description: "User interface and experience design",
        icon: "🎨",
      },
      {
        subjectId: subjectIds[1],
        name: "Java Fundamentals",
        description: "Basic syntax and concepts in Java",
        icon: "📝",
      },
      {
        subjectId: subjectIds[1],
        name: "Object-Oriented Programming",
        description: "OOP principles in Java",
        icon: "🎯",
      },
      {
        subjectId: subjectIds[2],
        name: "Architectural Patterns",
        description: "Common software architecture patterns",
        icon: "🏛️",
      },
      {
        subjectId: subjectIds[2],
        name: "Design Principles",
        description: "SOLID and other design principles",
        icon: "📐",
      },
      {
        subjectId: subjectIds[2],
        name: "Scalability and Performance",
        description: "Building scalable systems",
        icon: "📈",
      },
    ];

    const chapterIds: string[] = [];
    for (let i = 0; i < chapters.length; i++) {
      const chapterRef = await db.collection("chapters").add({
        subjectId: chapters[i].subjectId,
        programId,
        courseId,
        name: chapters[i].name,
        description: chapters[i].description,
        icon: chapters[i].icon,
        isActive: true,
        order: i + 1,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      chapterIds.push(chapterRef.id);
      console.log(`✅ Created chapter: ${chapters[i].name}`);
    }

    // 5. Create Default Quizzes
    console.log("❓ Creating default quizzes...");
    const quizzes = [
      {
        chapterId: chapterIds[4], // Architectural Patterns
        subjectId: subjectIds[2],
        programId,
        courseId,
        title: "Architectural Patterns: MVC vs MVVM",
        description: "Test your knowledge of MVC and MVVM patterns",
        difficulty: "MEDIUM",
        timeLimit: 600,
        passingScore: 70,
        isDefault: true,
        questions: [
          {
            question: "What does MVC stand for?",
            type: "MULTIPLE_CHOICE",
            options: [
              "Model-View-Controller",
              "Model-Visual-Component",
              "Module-View-Controller",
              "Model-View-Component",
            ],
            correctAnswer: 0,
            points: 10,
            explanation:
              "MVC stands for Model-View-Controller, a software design pattern.",
          },
          {
            question: "In MVC, which component handles user input?",
            type: "MULTIPLE_CHOICE",
            options: ["Model", "View", "Controller", "Router"],
            correctAnswer: 2,
            points: 10,
            explanation:
              "The Controller handles user input and updates the Model and View accordingly.",
          },
          {
            question: "What is the main difference between MVC and MVVM?",
            type: "MULTIPLE_CHOICE",
            options: [
              "MVVM has a ViewModel instead of Controller",
              "MVC is newer than MVVM",
              "MVVM doesn't use Models",
              "MVC is only for web applications",
            ],
            correctAnswer: 0,
            points: 15,
            explanation:
              "MVVM introduces a ViewModel layer that provides data binding between View and Model.",
          },
        ],
      },
      {
        chapterId: chapterIds[3], // OOP in Java
        subjectId: subjectIds[1],
        programId,
        courseId,
        title: "Object-Oriented Programming Basics",
        description: "Fundamental OOP concepts in Java",
        difficulty: "EASY",
        timeLimit: 300,
        passingScore: 60,
        isDefault: true,
        questions: [
          {
            question: "What is encapsulation?",
            type: "MULTIPLE_CHOICE",
            options: [
              "Hiding implementation details",
              "Creating multiple objects",
              "Inheriting from parent class",
              "Running code in parallel",
            ],
            correctAnswer: 0,
            points: 10,
            explanation:
              "Encapsulation is the bundling of data and methods that operate on that data within a single unit.",
          },
          {
            question: "Which keyword is used for inheritance in Java?",
            type: "MULTIPLE_CHOICE",
            options: ["implements", "extends", "inherits", "derives"],
            correctAnswer: 1,
            points: 10,
            explanation:
              "The 'extends' keyword is used for class inheritance in Java.",
          },
        ],
      },
      {
        chapterId: chapterIds[1], // UI/UX Design
        subjectId: subjectIds[0],
        programId,
        courseId,
        title: "UI/UX Design Fundamentals",
        description: "Basic principles of user interface design",
        difficulty: "EASY",
        timeLimit: 400,
        passingScore: 65,
        isDefault: true,
        questions: [
          {
            question: "What does UX stand for?",
            type: "MULTIPLE_CHOICE",
            options: [
              "User Experience",
              "User Extension",
              "Universal Exchange",
              "User Expert",
            ],
            correctAnswer: 0,
            points: 10,
            explanation:
              "UX stands for User Experience, focusing on how users interact with a product.",
          },
          {
            question:
              "Which principle states that similar items should be grouped together?",
            type: "MULTIPLE_CHOICE",
            options: ["Proximity", "Alignment", "Contrast", "Repetition"],
            correctAnswer: 0,
            points: 10,
            explanation:
              "The Proximity principle states that related items should be placed close together.",
          },
        ],
      },
    ];

    for (const quiz of quizzes) {
      await db.collection("quizzes").add({
        ...quiz,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ Created quiz: ${quiz.title}`);
    }

    console.log("\n🎉 Firestore seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - 1 Course`);
    console.log(`   - 1 Program`);
    console.log(`   - ${subjects.length} Subjects`);
    console.log(`   - ${chapters.length} Chapters`);
    console.log(`   - ${quizzes.length} Default Quizzes`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Firestore:", error);
    process.exit(1);
  }
}

// Run the seed function
seedFirestore();
