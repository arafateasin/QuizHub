// MongoDB seeding has been deprecated - now using Firestore
// TODO: Create Firestore seeding script or use frontend seed-firestore-admin.ts
// import { DifficultyLevel, QuestionType } from "@quizhub/shared";
import dotenv from "dotenv";

dotenv.config();

async function seedDatabase() {
  try {
    console.log("⚠️  MongoDB seeding is deprecated.");
    console.log(
      "📝 Please use Firestore seeding scripts in frontend/src/scripts/"
    );

    // All seeding logic has been moved to Firestore
    // See: apps/frontend/src/scripts/seed-firestore-admin.ts
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
