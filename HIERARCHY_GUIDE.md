# Hierarchical Quiz System - Implementation Guide

## 🎯 What's New

Your QuizHub now has a **hierarchical course structure**:

```
Course → Program → Subject → Chapter/Topic → Quiz
```

### Example Structure:

- **Computer Science** (Course)
  - **Software Engineering** (Program)
    - **App Development** (Subject)
      - UI/UX Design Principles (Chapter)
        - ✅ Platform Default Quizzes
        - ✅ Admin Custom Quizzes
    - **System Architecture and Design** (Subject)
      - Architectural Patterns (Chapter)
        - MVC vs MVVM Quiz ✅
    - **Introduction to Computer Programming in Java** (Subject)
      - Java Fundamentals (Chapter)
      - Object-Oriented Programming (Chapter)
        - OOP Basics Quiz ✅

---

## 🚀 Quick Start

### Step 1: Setup MongoDB Connection

You need MongoDB running before backend services can work.

**Option A: MongoDB Atlas (Cloud - Recommended)**

1. Open `apps/auth-service/.env`
2. Replace line 2 with:
   ```
   MONGO_URI=mongodb+srv://easinarafatbn_db_user:YOUR_PASSWORD@quizhub.cu2kxvn.mongodb.net/quizhub_auth?appName=QuizHub
   ```
3. Open `apps/quiz-service/.env`
4. Replace line 2 with:
   ```
   MONGO_URI=mongodb+srv://easinarafatbn_db_user:YOUR_PASSWORD@quizhub.cu2kxvn.mongodb.net/quizhub_quiz?appName=QuizHub
   ```
5. Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password

**Option B: Local MongoDB**

1. Download: https://www.mongodb.com/try/download/community
2. Install and start MongoDB on port 27017
3. The .env files are already configured for localhost

### Step 2: Seed the Database

Once MongoDB is connected, run this command to populate with example data:

```powershell
cd apps/quiz-service
npm run seed
```

This will create:

- ✅ 1 Course (Computer Science)
- ✅ 1 Program (Software Engineering)
- ✅ 3 Subjects (App Dev, Java Programming, System Architecture)
- ✅ 7 Chapters (Intro, UI/UX, Java Basics, OOP, Arch Patterns, Design Principles, Scalability)
- ✅ 3 Platform Default Quizzes

### Step 3: Add Seed Script to package.json

Add this to `apps/quiz-service/package.json` scripts:

```json
"scripts": {
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "seed": "ts-node src/scripts/seed.ts"
}
```

---

## 📡 New API Endpoints

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (auth required)
- `PUT /api/courses/:id` - Update course (auth required)
- `DELETE /api/courses/:id` - Delete course (auth required)

### Programs

- `GET /api/programs?courseId=xxx` - Get programs by course
- `GET /api/programs/:id` - Get program by ID
- `POST /api/programs` - Create program (auth required)
- `PUT /api/programs/:id` - Update program (auth required)
- `DELETE /api/programs/:id` - Delete program (auth required)

### Subjects

- `GET /api/subjects?programId=xxx` - Get subjects by program
- `GET /api/subjects?courseId=xxx` - Get subjects by course
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create subject (auth required)
- `PUT /api/subjects/:id` - Update subject (auth required)
- `DELETE /api/subjects/:id` - Delete subject (auth required)

### Chapters

- `GET /api/chapters?subjectId=xxx` - Get chapters by subject
- `GET /api/chapters?programId=xxx` - Get chapters by program
- `GET /api/chapters?courseId=xxx` - Get chapters by course
- `GET /api/chapters/:id` - Get chapter by ID
- `POST /api/chapters` - Create chapter (auth required)
- `PUT /api/chapters/:id` - Update chapter (auth required)
- `DELETE /api/chapters/:id` - Delete chapter (auth required)

### Quizzes (Updated)

- `GET /api/quizzes?courseId=xxx&programId=xxx&subjectId=xxx&chapterId=xxx`
- `GET /api/quizzes?isDefault=true` - Get only platform default quizzes
- `GET /api/quizzes?isDefault=false` - Get only custom admin quizzes
- `POST /api/quizzes` - Create quiz (requires courseId, programId, subjectId, chapterId)

---

## 🎨 Frontend Implementation (Next Steps)

### 1. Create API Client Functions

Add to `apps/frontend/src/lib/api/hierarchy.ts`:

```typescript
export const hierarchyApi = {
  getCourses: () => apiClient.get("/courses"),
  getPrograms: (courseId: string) =>
    apiClient.get(`/programs?courseId=${courseId}`),
  getSubjects: (programId: string) =>
    apiClient.get(`/subjects?programId=${programId}`),
  getChapters: (subjectId: string) =>
    apiClient.get(`/chapters?subjectId=${subjectId}`),
  getQuizzesByHierarchy: (params: {
    courseId?: string;
    programId?: string;
    subjectId?: string;
    chapterId?: string;
    isDefault?: boolean;
  }) => apiClient.get("/quizzes", { params }),
};
```

### 2. Create Hierarchy Selector Component

Create `apps/frontend/src/components/course-hierarchy-selector.tsx`:

```typescript
'use client';

export default function CourseHierarchySelector({ onSelectionChange }) {
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  // Fetch courses on mount
  useEffect(() => {
    hierarchyApi.getCourses().then(res => setCourses(res.data.data));
  }, []);

  // Cascading dropdowns...
  // When course selected, fetch programs
  // When program selected, fetch subjects
  // When subject selected, fetch chapters

  return (
    <div className="space-y-4">
      <select onChange={handleCourseChange}>
        <option value="">Select Course</option>
        {courses.map(course => (
          <option key={course._id} value={course._id}>
            {course.icon} {course.name}
          </option>
        ))}
      </select>

      {selectedCourse && (
        <select onChange={handleProgramChange}>
          <option value="">Select Program</option>
          {programs.map(program => (...))}
        </select>
      )}

      {/* Similar for Subject and Chapter */}
    </div>
  );
}
```

### 3. Update Quiz Browse Page

Replace the simple category filter in `apps/frontend/src/app/quizzes/page.tsx` with:

```typescript
import CourseHierarchySelector from "@/components/course-hierarchy-selector";

export default function QuizzesPage() {
  const [hierarchyFilter, setHierarchyFilter] = useState({});
  const [quizzes, setQuizzes] = useState([]);

  const handleHierarchyChange = (selection) => {
    setHierarchyFilter(selection);
    // Fetch quizzes with hierarchy filter
    hierarchyApi.getQuizzesByHierarchy(selection).then((res) => {
      setQuizzes(res.data.data.items);
    });
  };

  return (
    <div>
      <h1>Browse Quizzes</h1>
      <CourseHierarchySelector onSelectionChange={handleHierarchyChange} />

      {/* Display breadcrumb */}
      <div className="breadcrumb">
        {selection.courseName} → {selection.programName} →
        {selection.subjectName} → {selection.chapterName}
      </div>

      {/* Quiz cards with isDefault badge */}
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz._id}
          quiz={quiz}
          showDefaultBadge={quiz.isDefault}
        />
      ))}
    </div>
  );
}
```

### 4. Create Admin Quiz Creation Page

Create `apps/frontend/src/app/admin/create-quiz/page.tsx`:

```typescript
'use client';

export default function CreateQuizPage() {
  const [quizData, setQuizData] = useState({
    courseId: '',
    programId: '',
    subjectId: '',
    chapterId: '',
    title: '',
    description: '',
    difficulty: 'BEGINNER',
    isDefault: false,
    questions: [],
  });

  const handleSubmit = async () => {
    await apiClient.post('/quizzes', quizData);
    router.push('/admin/quizzes');
  };

  return (
    <form onSubmit={handleSubmit}>
      <CourseHierarchySelector onSelectionChange={handleHierarchyChange} />

      <input
        type="text"
        placeholder="Quiz Title"
        value={quizData.title}
        onChange={e => setQuizData({...quizData, title: e.target.value})}
      />

      <textarea
        placeholder="Description"
        value={quizData.description}
        onChange={e => setQuizData({...quizData, description: e.target.value})}
      />

      <select value={quizData.difficulty} onChange={...}>
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={quizData.isDefault}
          onChange={e => setQuizData({...quizData, isDefault: e.target.checked})}
        />
        Mark as Platform Default Quiz
      </label>

      {/* Add questions builder */}

      <button type="submit">Create Quiz</button>
    </form>
  );
}
```

---

## 🗂️ Database Schema

### Course

```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  icon: string,
  isActive: boolean,
  order: number
}
```

### Program

```typescript
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course),
  name: string,
  description: string,
  icon: string,
  isActive: boolean,
  order: number
}
```

### Subject

```typescript
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course),
  programId: ObjectId (ref: Program),
  name: string,
  description: string,
  icon: string,
  isActive: boolean,
  order: number
}
```

### Chapter

```typescript
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course),
  programId: ObjectId (ref: Program),
  subjectId: ObjectId (ref: Subject),
  name: string,
  description: string,
  icon: string,
  isActive: boolean,
  order: number
}
```

### Quiz (Updated)

```typescript
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course) REQUIRED,
  programId: ObjectId (ref: Program),
  subjectId: ObjectId (ref: Subject),
  chapterId: ObjectId (ref: Chapter),

  title: string,
  description: string,
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',

  isDefault: boolean,  // true = platform default, false = admin/user created
  createdBy: ObjectId,

  questions: [...],
  tags: string[],
  // ... other fields
}
```

---

## ✅ Testing the Implementation

1. **Start MongoDB** (Atlas or Local)
2. **Run seed script**: `npm run seed` in quiz-service
3. **Start backend services**:

   ```powershell
   # Terminal 1: Gateway
   cd apps/gateway
   npm run dev

   # Terminal 2: Auth Service
   cd apps/auth-service
   npm run dev

   # Terminal 3: Quiz Service
   cd apps/quiz-service
   npm run dev

   # Terminal 4: Frontend
   cd apps/frontend
   npm run dev
   ```

4. **Test API endpoints**:

   ```powershell
   # Get all courses
   curl http://localhost:3000/api/courses

   # Get programs for a course
   curl http://localhost:3000/api/programs?courseId=<COURSE_ID>

   # Get quizzes for a specific chapter
   curl http://localhost:3000/api/quizzes?chapterId=<CHAPTER_ID>

   # Get only default platform quizzes
   curl http://localhost:3000/api/quizzes?isDefault=true
   ```

---

## 🎓 Features Implemented

✅ **Hierarchical Course Structure** - 4 levels (Course → Program → Subject → Chapter)
✅ **Platform Default Quizzes** - Marked with `isDefault: true`
✅ **Admin Custom Quizzes** - Can be created at any hierarchy level
✅ **Cascading Filters** - Query by any level (courseId, programId, subjectId, chapterId)
✅ **Seed Data** - Computer Science example with 7 chapters and 3 quizzes
✅ **RESTful APIs** - Full CRUD for all hierarchy levels
✅ **Database Indexes** - Optimized queries for hierarchical filtering
✅ **Backward Compatible** - Legacy `category` field still works

---

## 📋 Remaining Tasks (Frontend)

- [ ] Create hierarchy selector component with cascading dropdowns
- [ ] Update quiz browse page to use hierarchy navigation
- [ ] Add breadcrumb navigation (Course > Program > Subject > Chapter)
- [ ] Create admin quiz creation page with hierarchy selection
- [ ] Add "Default Quiz" vs "Custom Quiz" visual badges
- [ ] Display quiz count at each hierarchy level
- [ ] Add filter toggle: "Show only default quizzes" / "Show all quizzes"

---

## 🔧 Admin Features

Admins can now:

1. **Create new courses** via `POST /api/courses`
2. **Add programs** to courses via `POST /api/programs`
3. **Create subjects** within programs via `POST /api/subjects`
4. **Add chapters/topics** to subjects via `POST /api/chapters`
5. **Launch custom quizzes** at any hierarchy level via `POST /api/quizzes`
6. **Mark quizzes as platform defaults** by setting `isDefault: true`

---

## 🚀 Next Steps

1. Setup MongoDB connection (see Step 1 above)
2. Run seed script to populate database
3. Test backend APIs with the provided curl commands
4. Implement frontend hierarchy selector component
5. Update quiz browse page with hierarchical navigation
6. Create admin quiz creation interface

Your hierarchical quiz system backend is complete! 🎉
