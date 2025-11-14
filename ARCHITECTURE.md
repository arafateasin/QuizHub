# QuizHub - Microservices Architecture Documentation

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Microservices Overview](#microservices-overview)
3. [Sequence Diagrams](#sequence-diagrams)
4. [Activity Diagrams](#activity-diagrams)
5. [Class Diagrams](#class-diagrams)
6. [User Journey](#user-journey)
7. [Database Architecture](#database-architecture)

---

## System Architecture

### Complete QuizHub Microservices Architecture

```mermaid
graph TB
    subgraph "External Users"
        STU[Students]
        TEACH[Teachers]
        ADMIN[Administrators]
    end

    subgraph "Client Layer - Next.js Frontend :3006"
        UI[UI Components<br/>React + TailwindCSS]
        AUTH_UI[Authentication Pages<br/>Login/Signup/OAuth]
        QUIZ_UI[Quiz Pages<br/>Browse/Take/Results]
        DASH_UI[Dashboard<br/>Stats/Profile/Leaderboard]
        ADMIN_UI[Admin Panel<br/>Quiz/Course Management]
    end

    subgraph "API Gateway :3000"
        GW[API Gateway<br/>Express + Proxy]
        RATE[Rate Limiter]
        CORS[CORS Handler]
        ROUTES[Route Handler<br/>/api/auth/*<br/>/api/users/*<br/>/api/quizzes/*<br/>/api/attempts/*<br/>/api/courses/*]
    end

    subgraph "Microservices Layer"
        subgraph "Auth Service :3001"
            AUTH_CTRL[Auth Controller<br/>Signup/Login/OAuth]
            USER_CTRL[User Controller<br/>Profile/CRUD]
            USER_SVC[User Service<br/>Firestore Operations]
            JWT[JWT Utils<br/>Token Generation]
        end

        subgraph "Quiz Service :3002"
            QUIZ_CTRL[Quiz Controller<br/>CRUD Operations]
            ATTEMPT_CTRL[Attempt Controller<br/>Start/Submit/Complete]
            COURSE_CTRL[Course Hierarchy<br/>Courses/Programs/Subjects/Chapters]
            LEADER_CTRL[Leaderboard<br/>Rankings/XP System]
        end
    end

    subgraph "Firebase Backend as a Service"
        FA[Firebase Authentication<br/>Google OAuth + Email/Password]
        FS[Cloud Firestore<br/>NoSQL Database]
        FSTORAGE[Firebase Storage<br/>File Storage]
        ANALYTICS[Firebase Analytics<br/>User Tracking]
        DC[Firebase Data Connect<br/>PostgreSQL + GraphQL]
    end

    subgraph "Data Storage"
        subgraph "Firestore Collections"
            USERS_COL[(users)]
            QUIZ_COL[(quizzes)]
            ATTEMPT_COL[(attempts)]
            COURSE_COL[(courses/programs<br/>subjects/chapters)]
        end

        subgraph "PostgreSQL via Data Connect"
            PG_USERS[(Users Table)]
            PG_QUIZ[(Quiz Data)]
            PG_ATTEMPTS[(Quiz Attempts)]
        end
    end

    STU --> UI
    TEACH --> UI
    ADMIN --> UI

    UI --> AUTH_UI
    UI --> QUIZ_UI
    UI --> DASH_UI
    UI --> ADMIN_UI

    AUTH_UI -->|REST API| GW
    QUIZ_UI -->|REST API| GW
    DASH_UI -->|REST API| GW
    ADMIN_UI -->|REST API| GW

    AUTH_UI -.->|Direct SDK| FA
    ANALYTICS -.->|Track Events| UI

    GW --> RATE
    RATE --> CORS
    CORS --> ROUTES

    ROUTES -->|/api/auth/*<br/>/api/users/*| AUTH_CTRL
    ROUTES -->|/api/quizzes/*<br/>/api/attempts/*| QUIZ_CTRL
    ROUTES -->|/api/courses/*| COURSE_CTRL

    AUTH_CTRL --> USER_SVC
    AUTH_CTRL --> JWT
    USER_CTRL --> USER_SVC

    USER_SVC -->|Firebase Admin SDK| FA
    USER_SVC -->|CRUD Operations| FS

    QUIZ_CTRL -->|CRUD| FS
    ATTEMPT_CTRL -->|Track Progress| FS
    COURSE_CTRL -->|Hierarchy Management| FS
    LEADER_CTRL -->|Rankings| FS

    FS --> USERS_COL
    FS --> QUIZ_COL
    FS --> ATTEMPT_COL
    FS --> COURSE_COL

    DC --> PG_USERS
    DC --> PG_QUIZ
    DC --> PG_ATTEMPTS

    FSTORAGE -.->|Profile Images<br/>Quiz Media| UI

    style STU fill:#3498db
    style TEACH fill:#9b59b6
    style ADMIN fill:#e74c3c
    style UI fill:#61dafb,stroke:#333,stroke-width:3px
    style GW fill:#68a063,stroke:#333,stroke-width:3px
    style AUTH_CTRL fill:#f39c12,stroke:#333,stroke-width:2px
    style QUIZ_CTRL fill:#e74c3c,stroke:#333,stroke-width:2px
    style FS fill:#ffa611,stroke:#333,stroke-width:3px
    style FA fill:#ff6b35,stroke:#333,stroke-width:2px
    style DC fill:#2ecc71,stroke:#333,stroke-width:2px
```

### Complete System Component Architecture with Data Flow

```mermaid
graph TB
    subgraph "User Interface Layer"
        BROWSER[Web Browser]
        MOBILE[Mobile Browser]
    end

    subgraph "Frontend Application - Next.js 14 :3006"
        PAGES[Pages Router<br/>Auth/Dashboard/Quiz/Admin]
        COMPONENTS[React Components<br/>UI Library]
        CONTEXTS[Context Providers<br/>Auth/Theme/State]
        HOOKS[Custom Hooks<br/>useAuth/useQuiz]
        API_CLIENT[API Client Layer<br/>Axios + Interceptors]
        FB_CLIENT[Firebase Client SDK<br/>Auth/Analytics/Storage]
    end

    subgraph "API Gateway Layer :3000"
        ENTRY[Entry Point]
        MIDDLEWARE[Middleware Stack]
        SECURITY[Security Layer<br/>Helmet/CORS/Rate Limit]
        ROUTER[Route Dispatcher]
        PROXY_AUTH[Auth Service Proxy]
        PROXY_QUIZ[Quiz Service Proxy]
        ERROR_HANDLER[Global Error Handler]
    end

    subgraph "Auth Microservice :3001"
        AUTH_ROUTES[Auth Routes<br/>/signup /login /refresh]
        USER_ROUTES[User Routes<br/>/profile /users]
        AUTH_MW[Auth Middleware<br/>JWT Verification]
        AUTH_CONTROLLER[Controllers Layer]
        AUTH_SERVICE[Business Logic Layer]
        AUTH_UTILS[Utilities<br/>JWT/Bcrypt/Validation]
        FB_ADMIN_AUTH[Firebase Admin SDK]
    end

    subgraph "Quiz Microservice :3002"
        QUIZ_ROUTES[Quiz Routes<br/>/quizzes /attempts /courses]
        QUIZ_MW[Middleware<br/>Auth/Validation]
        QUIZ_CONTROLLERS[Controllers Layer<br/>Quiz/Attempt/Course/Chapter]
        QUIZ_SERVICES[Business Logic<br/>Score Calculation/XP System]
        QUIZ_UTILS[Utilities<br/>Validators/Helpers]
        FB_ADMIN_QUIZ[Firebase Admin SDK]
    end

    subgraph "Firebase Services"
        FB_AUTH[Firebase Authentication]
        FIRESTORE[Cloud Firestore<br/>Main Database]
        FB_STORAGE[Cloud Storage<br/>Media Files]
        FB_ANALYTICS[Analytics]
        FB_DC[Data Connect<br/>PostgreSQL + GraphQL]
    end

    subgraph "Database Layer"
        FS_COLLECTIONS[Firestore Collections<br/>users/quizzes/attempts<br/>courses/programs/subjects/chapters]
        PG_TABLES[PostgreSQL Tables<br/>via Data Connect<br/>Relational Data]
        INDEXES[Composite Indexes<br/>Query Optimization]
    end

    BROWSER --> PAGES
    MOBILE --> PAGES

    PAGES --> COMPONENTS
    COMPONENTS --> CONTEXTS
    COMPONENTS --> HOOKS
    CONTEXTS --> API_CLIENT
    CONTEXTS --> FB_CLIENT

    API_CLIENT -->|HTTP/REST| ENTRY
    FB_CLIENT -->|Direct SDK| FB_AUTH
    FB_CLIENT --> FB_ANALYTICS

    ENTRY --> MIDDLEWARE
    MIDDLEWARE --> SECURITY
    SECURITY --> ROUTER

    ROUTER -->|/api/auth/*| PROXY_AUTH
    ROUTER -->|/api/users/*| PROXY_AUTH
    ROUTER -->|/api/quizzes/*| PROXY_QUIZ
    ROUTER -->|/api/attempts/*| PROXY_QUIZ
    ROUTER -->|/api/courses/*| PROXY_QUIZ

    PROXY_AUTH --> AUTH_ROUTES
    AUTH_ROUTES --> AUTH_MW
    AUTH_MW --> AUTH_CONTROLLER
    AUTH_CONTROLLER --> AUTH_SERVICE
    AUTH_SERVICE --> AUTH_UTILS
    AUTH_SERVICE --> FB_ADMIN_AUTH

    PROXY_QUIZ --> QUIZ_ROUTES
    QUIZ_ROUTES --> QUIZ_MW
    QUIZ_MW --> QUIZ_CONTROLLERS
    QUIZ_CONTROLLERS --> QUIZ_SERVICES
    QUIZ_SERVICES --> QUIZ_UTILS
    QUIZ_SERVICES --> FB_ADMIN_QUIZ

    FB_ADMIN_AUTH --> FB_AUTH
    FB_ADMIN_AUTH --> FIRESTORE
    FB_ADMIN_QUIZ --> FIRESTORE

    FIRESTORE --> FS_COLLECTIONS
    FS_COLLECTIONS --> INDEXES

    FB_DC --> PG_TABLES

    FB_STORAGE -.->|Media Upload/Download| COMPONENTS

    ERROR_HANDLER -.->|Error Response| API_CLIENT

    style PAGES fill:#61dafb,stroke:#333,stroke-width:3px
    style ENTRY fill:#68a063,stroke:#333,stroke-width:3px
    style AUTH_CONTROLLER fill:#f39c12,stroke:#333,stroke-width:2px
    style QUIZ_CONTROLLERS fill:#e74c3c,stroke:#333,stroke-width:2px
    style FIRESTORE fill:#ffa611,stroke:#333,stroke-width:3px
    style FB_DC fill:#2ecc71,stroke:#333,stroke-width:2px
```

---

## Microservices Overview

### Service Breakdown

```mermaid
mindmap
  root((QuizHub<br/>Microservices))
    Frontend
      Next.js 14
      React Query
      TailwindCSS
      Firebase Client SDK
    API Gateway
      Express.js
      HTTP Proxy Middleware
      Rate Limiting
      CORS & Security
    Auth Service
      User Registration
      Login/Logout
      Token Management
      Firebase OAuth Exchange
      JWT Generation
    Quiz Service
      Quiz CRUD
      Attempt Tracking
      Course Hierarchy
      Leaderboard
      XP System
    Firebase Backend
      Firestore Database
      Firebase Auth
      Firebase Analytics
      Firebase Storage
```

---

## Complete System Sequence Diagrams

### End-to-End User Journey: Registration → Quiz → Results

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant Frontend[Frontend :3006]
    participant Gateway[Gateway :3000]
    participant Auth[Auth Service :3001]
    participant Quiz[Quiz Service :3002]
    participant Firebase[Firebase Auth]
    participant Firestore[Firestore DB]

    %% PHASE 1: Authentication
    rect rgb(220, 240, 255)
    Note over User,Firestore: Authentication Phase
    User->>Browser: Navigate to /auth/signup
    Browser->>Frontend: Load registration page
    User->>Browser: Enter credentials
    Browser->>Frontend: Submit form
    Frontend->>Frontend: Client validation
    Frontend->>Gateway: POST /api/auth/signup
    Gateway->>Gateway: Rate limit + CORS
    Gateway->>Auth: Proxy request
    Auth->>Auth: Validate & hash password
    Auth->>Firestore: Create user document
    Firestore-->>Auth: User ID
    Auth->>Auth: Generate JWT tokens
    Auth-->>Gateway: {user, accessToken, refreshToken}
    Gateway-->>Frontend: Return response
    Frontend->>Browser: Store tokens & redirect
    end

    %% PHASE 2: Dashboard & Quiz Browse
    rect rgb(240, 255, 240)
    Note over User,Firestore: Quiz Discovery Phase
    Browser->>Frontend: Load /dashboard
    Frontend->>Gateway: GET /api/users/profile<br/>Authorization: Bearer {token}
    Gateway->>Auth: Verify & proxy
    Auth->>Auth: Validate JWT
    Auth->>Firestore: Fetch user profile
    Firestore-->>Auth: User data + stats
    Auth-->>Gateway: User profile
    Gateway-->>Frontend: Profile data
    Frontend->>Browser: Display dashboard

    User->>Browser: Navigate to /quizzes
    Browser->>Frontend: Load quiz list
    Frontend->>Gateway: GET /api/quizzes
    Gateway->>Quiz: Proxy request
    Quiz->>Firestore: Query quizzes collection
    Firestore-->>Quiz: Quiz documents
    Quiz-->>Gateway: Quiz array
    Gateway-->>Frontend: Quiz list
    Frontend->>Browser: Display quizzes
    end

    %% PHASE 3: Quiz Attempt
    rect rgb(255, 240, 255)
    Note over User,Firestore: Quiz Taking Phase
    User->>Browser: Select quiz & start
    Browser->>Frontend: Navigate to /quiz/{id}
    Frontend->>Gateway: POST /api/attempts/start
    Gateway->>Quiz: Create attempt
    Quiz->>Firestore: Insert attempt document
    Firestore-->>Quiz: Attempt ID
    Quiz->>Firestore: Fetch questions
    Quiz-->>Gateway: {attemptId, questions}
    Gateway-->>Frontend: Attempt data
    Frontend->>Browser: Display questions

    loop Answer questions
        User->>Browser: Select answers
        Browser->>Frontend: Update state
    end

    User->>Browser: Submit quiz
    Browser->>Frontend: Confirm submission
    Frontend->>Gateway: POST /api/attempts/{id}/submit
    Gateway->>Quiz: Submit answers
    Quiz->>Firestore: Get correct answers
    Quiz->>Quiz: Calculate score & XP
    Quiz->>Firestore: Update attempt + user stats
    Quiz-->>Gateway: {score, xpEarned, results}
    Gateway-->>Frontend: Results data
    Frontend->>Browser: Show results page
    end

    %% PHASE 4: Token Refresh
    rect rgb(255, 220, 220)
    Note over Frontend,Firestore: Token Refresh (Continuous)
    Frontend->>Gateway: Request with expired token
    Gateway->>Auth: Validate token
    Auth-->>Gateway: 401 Unauthorized
    Gateway-->>Frontend: 401 response
    Frontend->>Gateway: POST /api/auth/refresh
    Gateway->>Auth: Validate refresh token
    Auth->>Firestore: Check refresh token
    Firestore-->>Auth: Token valid
    Auth->>Auth: Generate new access token
    Auth-->>Gateway: New token
    Gateway-->>Frontend: {accessToken}
    Frontend->>Gateway: Retry original request
    end

    Note over User,Firestore: Complete microservices interaction flow
```

### Google OAuth Alternative Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend
    participant GoogleAuth[Google OAuth]
    participant Firebase[Firebase Auth]
    participant Gateway
    participant Auth[Auth Service]
    participant Firestore

    User->>Frontend: Click "Sign in with Google"
    Frontend->>GoogleAuth: Open OAuth popup
    User->>GoogleAuth: Grant permissions
    GoogleAuth-->>Firebase: Authorization code
    Firebase->>Firebase: Exchange for ID token
    Firebase-->>Frontend: Firebase ID token
    Frontend->>Gateway: POST /api/auth/firebase-exchange
    Gateway->>Auth: Forward token
    Auth->>Firebase: verifyIdToken() via Admin SDK
    Firebase-->>Auth: Decoded user claims
    Auth->>Firestore: Check user by email

    alt User exists
        Firestore-->>Auth: Existing user
        Auth->>Firestore: Update profile (avatar, name)
    else New user
        Auth->>Firestore: Create user with Firebase UID
        Firestore-->>Auth: New user created
    end

    Auth->>Auth: Generate JWT tokens
    Auth-->>Gateway: {user, tokens}
    Gateway-->>Frontend: Authentication response
    Frontend->>Frontend: Store tokens
    Frontend->>User: Redirect to dashboard


    AS-->>GW: 401 Unauthorized
    GW-->>FE: 401 Error

    FE->>FE: Get refreshToken from localStorage
    FE->>GW: POST /api/auth/refresh
    GW->>AS: Forward refreshToken
    AS->>AS: Verify refreshToken
    AS->>FS: Find user by ID
    FS-->>AS: Return user
    AS->>AS: Compare stored refreshToken
    AS->>AS: Generate new tokens
    AS->>FS: Update user refreshToken
    AS-->>GW: Return new tokens
    GW-->>FE: Return tokens
    FE->>FE: Update localStorage
    FE->>GW: Retry original request
```

---

## Complete System Activity Diagrams

### End-to-End User Activity Flow: Registration → Quiz → Leaderboard

```mermaid
flowchart TD
    Start([User Accesses QuizHub]) --> CheckAuth{Has Valid<br/>JWT Token?}

    %% Authentication Flow
    CheckAuth -->|No| LoginPage[Show Login/Signup Page]
    CheckAuth -->|Yes| ValidateToken{Token Valid<br/>& Not Expired?}
    ValidateToken -->|No| RefreshToken[Attempt Token Refresh]
    ValidateToken -->|Yes| LoadDash
    RefreshToken -->|Success| LoadDash[Load Dashboard]
    RefreshToken -->|Failed| LoginPage

    LoginPage --> AuthChoice{User Choice}
    AuthChoice -->|Sign Up| SignupForm[Fill Registration Form]
    AuthChoice -->|Login| LoginForm[Fill Login Form]
    AuthChoice -->|Google OAuth| GoogleOAuth[Initiate Google OAuth]

    %% Signup Flow
    SignupForm --> ValidateSignup{Frontend<br/>Validation}
    ValidateSignup -->|Invalid| ShowSignupErr[Show Validation Errors]
    ShowSignupErr --> SignupForm
    ValidateSignup -->|Valid| SendSignup[POST /api/auth/signup]
    SendSignup --> GatewaySignup[Gateway: Rate Limit + CORS]
    GatewaySignup --> AuthServiceSignup[Auth Service Processing]
    AuthServiceSignup --> CheckUserExists{User<br/>Exists?}
    CheckUserExists -->|Yes| ShowExists[Show "Email exists" error]
    ShowExists --> LoginPage
    CheckUserExists -->|No| HashPassword[Hash Password with bcrypt]
    HashPassword --> CreateUserDoc[Create User in Firestore]
    CreateUserDoc --> GenJWT[Generate JWT Tokens]
    GenJWT --> SaveRefreshToken[Save Refresh Token to DB]
    SaveRefreshToken --> ReturnTokens[Return Access + Refresh Tokens]
    ReturnTokens --> StoreTokens[Frontend: Store Tokens]
    StoreTokens --> LoadDash

    %% Login Flow
    LoginForm --> ValidateLogin{Form<br/>Valid?}
    ValidateLogin -->|No| ShowLoginErr[Show Errors]
    ShowLoginErr --> LoginForm
    ValidateLogin -->|Yes| SendLogin[POST /api/auth/login]
    SendLogin --> GatewayLogin[Gateway Processing]
    GatewayLogin --> AuthServiceLogin[Auth Service Verification]
    AuthServiceLogin --> FindUser[Query Firestore by Email]
    FindUser -->|Not Found| ShowNoUser[Show "User not found"]
    ShowNoUser --> LoginPage
    FindUser -->|Found| ComparePass[Compare Password Hashes]
    ComparePass -->|Mismatch| ShowWrongPass[Show "Wrong password"]
    ShowWrongPass --> LoginPage
    ComparePass -->|Match| GenJWT

    %% Google OAuth Flow
    GoogleOAuth --> OpenPopup[Open Google Consent Screen]
    OpenPopup --> UserGrant{User Grants<br/>Permission?}
    UserGrant -->|Denied| ShowOAuthErr[Show OAuth Error]
    ShowOAuthErr --> LoginPage
    UserGrant -->|Granted| GetFirebaseToken[Get Firebase ID Token]
    GetFirebaseToken --> ExchangeToken[POST /api/auth/firebase-exchange]
    ExchangeToken --> VerifyFirebaseToken[Auth Service: Verify Token]
    VerifyFirebaseToken --> FindOAuthUser{User Exists<br/>by Email?}
    FindOAuthUser -->|Yes| UpdateProfile[Update Profile Photo/Name]
    FindOAuthUser -->|No| CreateOAuthUser[Create User with Firebase UID]
    UpdateProfile --> GenJWT
    CreateOAuthUser --> GenJWT

    %% Dashboard & Quiz Browse
    LoadDash --> ShowDashboard[Display User Stats<br/>XP, Level, Progress]
    ShowDashboard --> DashAction{User<br/>Action}
    DashAction -->|View Profile| ShowProfile[Show Profile Page]
    DashAction -->|Browse Quizzes| BrowseQuizzes[Navigate to /quizzes]
    DashAction -->|View Leaderboard| ShowLeaderboard

    ShowProfile --> DashAction

    %% Quiz Browsing & Taking
    BrowseQuizzes --> LoadQuizList[GET /api/quizzes<br/>via Gateway]
    LoadQuizList --> QueryFirestore[Quiz Service:<br/>Query Firestore quizzes collection]
    QueryFirestore --> DisplayQuizzes[Display Quiz Cards<br/>with Metadata]
    DisplayQuizzes --> QuizAction{User<br/>Action}
    QuizAction -->|Select Quiz| ViewQuizDetail[View Quiz Details Page]
    QuizAction -->|Filter| ApplyFilter[Apply Category/Difficulty Filter]
    QuizAction -->|Back| ShowDashboard

    ApplyFilter --> LoadQuizList

    ViewQuizDetail --> ShowQuizInfo[Show:<br/>Questions Count, Time Limit<br/>Difficulty, XP Reward]
    ShowQuizInfo --> StartDecision{Start<br/>Quiz?}
    StartDecision -->|No| DisplayQuizzes
    StartDecision -->|Yes| CreateAttempt[POST /api/attempts/start]

    CreateAttempt --> QuizServiceAttempt[Quiz Service:<br/>Create Attempt Document]
    QuizServiceAttempt --> ValidateAttempts{User Has<br/>Attempts Left?}
    ValidateAttempts -->|No| ShowMaxAttempts[Show "Max attempts reached"]
    ShowMaxAttempts --> DisplayQuizzes
    ValidateAttempts -->|Yes| InsertAttempt[Insert Attempt in Firestore]
    InsertAttempt --> FetchQuestions[Fetch Quiz Questions]
    FetchQuestions --> ShuffleQuestions[Shuffle Questions if Enabled]
    ShuffleQuestions --> DisplayFirstQ[Display First Question<br/>Start Timer]

    DisplayFirstQ --> AnswerLoop{User Answering<br/>Questions}
    AnswerLoop -->|Select Answer| RecordAnswer[Record Answer Locally]
    RecordAnswer --> NextQ{More<br/>Questions?}
    NextQ -->|Yes| DisplayNextQ[Display Next Question]
    DisplayNextQ --> AnswerLoop
    NextQ -->|No| ReviewAnswers[Show Review Page]

    ReviewAnswers --> SubmitDecision{Submit<br/>Quiz?}
    SubmitDecision -->|No| ChangeAnswer[Change Answer]
    ChangeAnswer --> ReviewAnswers
    SubmitDecision -->|Yes| SubmitQuiz[POST /api/attempts/:id/submit]

    SubmitQuiz --> QuizServiceSubmit[Quiz Service Processing]
    QuizServiceSubmit --> FetchCorrectAnswers[Fetch Correct Answers]
    FetchCorrectAnswers --> CalculateScore[Calculate Score:<br/>correct / total * 100]
    CalculateScore --> CalculateXP[Calculate XP Earned:<br/>baseXP * scoreMultiplier]
    CalculateXP --> UpdateAttempt[Update Attempt Document<br/>status: 'completed']
    UpdateAttempt --> UpdateUserStats[Update User:<br/>totalXP, quizzesTaken]
    UpdateUserStats --> CheckLevelUp{XP Threshold<br/>Crossed?}
    CheckLevelUp -->|Yes| IncrementLevel[Increment User Level]
    CheckLevelUp -->|No| ReturnResults
    IncrementLevel --> ReturnResults[Return Results + XP]

    ReturnResults --> DisplayResults[Display Results Page<br/>Score, XP, Level Up Animation]
    DisplayResults --> ResultAction{User<br/>Action}
    ResultAction -->|Retry| ViewQuizDetail
    ResultAction -->|Browse More| BrowseQuizzes
    ResultAction -->|View Leaderboard| ShowLeaderboard
    ResultAction -->|Dashboard| ShowDashboard

    %% Leaderboard
    ShowLeaderboard --> FetchLeaderboard[GET /api/users/leaderboard]
    FetchLeaderboard --> QueryTopUsers[Auth Service:<br/>Query top 100 by totalXP]
    QueryTopUsers --> DisplayRankings[Display Rankings<br/>with User Rank Highlighted]
    DisplayRankings --> LeaderboardAction{User<br/>Action}
    LeaderboardAction -->|Back to Dashboard| ShowDashboard
    LeaderboardAction -->|View Profile| ShowProfile
    LeaderboardAction -->|Challenge| ViewQuizDetail

    %% Token Refresh (Happens Throughout)
    AnswerLoop -.->|Token Expired| AutoRefresh[Axios Interceptor:<br/>Auto Refresh Token]
    AutoRefresh -.->|Success| AnswerLoop
    AutoRefresh -.->|Failed| ForceLogout[Clear Tokens & Redirect to Login]
    ForceLogout -.-> LoginPage

    %% Styling
    style Start fill:#2ecc71,stroke:#27ae60,stroke-width:3px
    style LoadDash fill:#3498db,stroke:#2980b9,stroke-width:2px
    style CreateAttempt fill:#e74c3c,stroke:#c0392b,stroke-width:2px
    style SubmitQuiz fill:#e67e22,stroke:#d35400,stroke-width:2px
    style DisplayResults fill:#9b59b6,stroke:#8e44ad,stroke-width:2px
    style ShowLeaderboard fill:#f39c12,stroke:#e67e22,stroke-width:2px
    style AutoRefresh fill:#95a5a6,stroke:#7f8c8d,stroke-width:1px,stroke-dasharray: 5 5
    ShowIncorrect --> MoreQuestions

    MoreQuestions -->|Yes| NextQ[Next Question]
    NextQ --> LoadQuestion
    MoreQuestions -->|No| CalculateScore[Calculate Final Score]

    CalculateScore --> CheckPassing{Score >= Passing?}
    CheckPassing -->|Yes| AwardXP[Award XP Points]
    CheckPassing -->|No| NoXP[No XP Awarded]

    AwardXP --> UpdateStats[Update User Statistics]
    NoXP --> UpdateStats
    UpdateStats --> ShowResults[Show Results Page]
    ShowResults --> UserAction{User Action}

    UserAction -->|Retry| CreateAttempt
    UserAction -->|View Leaderboard| ShowLeaderboard[Show Leaderboard]
    UserAction -->|Back to Quizzes| ViewQuizzes
    UserAction -->|Dashboard| End([Go to Dashboard])

    ShowLeaderboard --> End
```

### Admin Management Activity Flow

```mermaid
flowchart TD
    AdminStart([Admin Logs In]) --> AdminAuth[POST /api/auth/login<br/>role: 'admin']
    AdminAuth --> VerifyRole{User Role<br/>= Admin?}
    VerifyRole -->|No| Forbidden[403 Forbidden]
    Forbidden --> End([Access Denied])
    VerifyRole -->|Yes| AdminDash[Load Admin Dashboard]

    AdminDash --> AdminAction{Admin<br/>Action}
    AdminAction -->|Manage Courses| CourseHierarchy[View Course Hierarchy<br/>Program → Subject → Chapter]
    AdminAction -->|Manage Quizzes| QuizManagement
    AdminAction -->|View Users| UserManagement[GET /api/users<br/>View All Users]
    AdminAction -->|Analytics| ViewAnalytics[View System Analytics]

    CourseHierarchy --> HierarchyAction{CRUD<br/>Action}
    HierarchyAction -->|Create Course| CreateCourseForm[Fill Course Form]
    HierarchyAction -->|Create Program| CreateProgramForm[Fill Program Form]
    HierarchyAction -->|Create Subject| CreateSubjectForm[Fill Subject Form]
    HierarchyAction -->|Create Chapter| CreateChapterForm[Fill Chapter Form]
    HierarchyAction -->|Edit| EditHierarchy[Edit Existing Item]
    HierarchyAction -->|Delete| DeleteHierarchy[Delete Item]

    CreateCourseForm --> ValidateCourse{Valid<br/>Data?}
    ValidateCourse -->|No| ShowCourseError[Show Validation Errors]
    ShowCourseError --> CreateCourseForm
    ValidateCourse -->|Yes| SaveCourse[POST /api/courses<br/>via Gateway → Quiz Service]
    SaveCourse --> FirestoreSave[Save to courses Collection]
    FirestoreSave --> SuccessCourse[Show Success Message]
    SuccessCourse --> AdminDash

    QuizManagement --> QuizAction{Quiz<br/>Action}
    QuizAction -->|Create New| CreateQuizForm[Fill Quiz Metadata<br/>Title, Description, Difficulty]
    QuizAction -->|Edit Existing| EditQuizForm[Modify Quiz]
    QuizAction -->|Delete| DeleteQuiz[Delete Quiz]
    QuizAction -->|View Attempts| ViewAttempts[View All Attempts for Quiz]

    CreateQuizForm --> AddQuestionsFlow[Add Questions Flow]
    AddQuestionsFlow --> QuestionNum[Question #N]
    QuestionNum --> QuestionData[Enter Question Text]
    QuestionData --> QuestionType{Question<br/>Type}
    QuestionType -->|MCQ| AddMCQOptions[Add 4 Options]
    QuestionType -->|True/False| AddTFOptions[Add T/F Options]
    QuestionType -->|Multi-Select| AddMultiOptions[Add Multiple Options]

    AddMCQOptions --> MarkCorrect[Mark Correct Answer(s)]
    AddTFOptions --> MarkCorrect
    AddMultiOptions --> MarkCorrect

    MarkCorrect --> MoreQuestions{Add More<br/>Questions?}
    MoreQuestions -->|Yes| QuestionNum
    MoreQuestions -->|No| SetQuizSettings[Set Quiz Settings<br/>Time Limit, XP, Max Attempts]
    SetQuizSettings --> AssignChapter[Assign to Chapter]
    AssignChapter --> SaveQuiz[POST /api/quizzes]
    SaveQuiz --> FirestoreQuizSave[Save to quizzes Collection]
    FirestoreQuizSave --> SuccessQuiz[Show Success]
    SuccessQuiz --> AdminDash

    UserManagement --> UserAction{User<br/>Action}
    UserAction -->|View Details| UserProfile[View User Profile & Stats]
    UserAction -->|Change Role| ChangeRole[Update User Role]
    UserAction -->|Ban/Unban| ToggleBan[Toggle User Ban Status]

    ChangeRole --> UpdateUser[PUT /api/users/:id]
    ToggleBan --> UpdateUser
    UpdateUser --> FirestoreUserUpdate[Update users Collection]
    FirestoreUserUpdate --> AdminDash

    ViewAnalytics --> AnalyticsType{View<br/>What?}
    AnalyticsType -->|User Stats| UserStats[Total Users, Active Users<br/>Signup Trends]
    AnalyticsType -->|Quiz Stats| QuizStats[Total Quizzes, Attempts<br/>Completion Rate]
    AnalyticsType -->|Leaderboard| TopPerformers[Top 100 Users by XP]

    UserStats --> AdminDash
    QuizStats --> AdminDash
    TopPerformers --> AdminDash

    style AdminStart fill:#e74c3c,stroke:#c0392b,stroke-width:3px
    style AdminDash fill:#3498db,stroke:#2980b9,stroke-width:2px
    style SaveQuiz fill:#2ecc71,stroke:#27ae60,stroke-width:2px
    style Forbidden fill:#95a5a6,stroke:#7f8c8d,stroke-width:2px
```

---

## Complete System Class Diagrams

### Cross-Service Domain Model with Relationships

```mermaid
classDiagram
    %% User & Authentication Domain
    class User {
        +String id
        +String email
        +String username
        +String passwordHash
        +UserRole role
        +Boolean isVerified
        +String firebaseUid
        +String displayName
        +UserProfile profile
        +UserStats stats
        +String refreshToken
        +Date lastLogin
        +Date createdAt
        +Date updatedAt
        +login(password) boolean
        +updateProfile(data) void
        +addXP(amount) void
        +checkLevelUp() boolean
    }

    class UserProfile {
        +String firstName
        +String lastName
        +String avatar
        +String bio
        +String institution
        +String grade
    }

    class UserStats {
        +Number totalXP
        +Number level
        +Number totalQuizzesTaken
        +Number totalQuizzesPassed
        +Number totalQuestionsAnswered
        +Number correctAnswers
        +Number currentStreak
        +Number longestStreak
        +Date lastQuizDate
        +calculateAccuracy() Number
        +calculatePassRate() Number
    }

    %% Course Hierarchy Domain
    class Course {
        +String id
        +String name
        +String description
        +String code
        +Boolean isActive
        +Date createdAt
        +String createdBy
        +addProgram(program) void
        +getPrograms() Program[]
    }

    class Program {
        +String id
        +String courseId
        +String name
        +String description
        +Number order
        +Boolean isActive
        +addSubject(subject) void
        +getSubjects() Subject[]
    }

    class Subject {
        +String id
        +String programId
        +String name
        +String description
        +Number order
        +Boolean isActive
        +addChapter(chapter) void
        +getChapters() Chapter[]
    }

    class Chapter {
        +String id
        +String subjectId
        +String name
        +String description
        +Number order
        +Boolean isActive
        +getQuizzes() Quiz[]
    }

    %% Quiz Domain
    class Quiz {
        +String id
        +String title
        +String description
        +String chapterId
        +Difficulty difficulty
        +Number timeLimit
        +Number passingScore
        +Number xpReward
        +Number maxAttempts
        +Boolean shuffleQuestions
        +Boolean isActive
        +Question[] questions
        +String createdBy
        +Date createdAt
        +Date updatedAt
        +addQuestion(question) void
        +validateQuiz() boolean
        +calculateScore(answers) Number
    }

    class Question {
        +String id
        +String quizId
        +String questionText
        +QuestionType type
        +Option[] options
        +String[] correctAnswers
        +Number points
        +String explanation
        +Number order
        +validateAnswer(answer) boolean
    }

    class Option {
        +String id
        +String text
        +Boolean isCorrect
    }

    %% Attempt Domain
    class QuizAttempt {
        +String id
        +String userId
        +String quizId
        +AttemptStatus status
        +Answer[] answers
        +Number score
        +Number xpEarned
        +Date startedAt
        +Date completedAt
        +Number timeSpent
        +calculateFinalScore() Number
        +submit(answers) void
        +isCompleted() boolean
    }

    class Answer {
        +String questionId
        +String[] selectedOptions
        +Boolean isCorrect
        +Date answeredAt
    }

    %% Service Layer Classes
    class UserService {
        -Firestore firestore
        +createUser(data) User
        +findByEmail(email) User
        +findById(id) User
        +updateUser(id, data) User
        +comparePassword(plain, hash) boolean
        +updateStats(userId, stats) void
        +getLeaderboard(limit) User[]
    }

    class QuizService {
        -Firestore firestore
        +createQuiz(data) Quiz
        +getQuizById(id) Quiz
        +getAllQuizzes(filters) Quiz[]
        +updateQuiz(id, data) Quiz
        +deleteQuiz(id) void
        +validateQuiz(quiz) boolean
    }

    class AttemptService {
        -Firestore firestore
        +startAttempt(userId, quizId) QuizAttempt
        +submitAttempt(attemptId, answers) Result
        +getAttemptById(id) QuizAttempt
        +getUserAttempts(userId) QuizAttempt[]
        +calculateScore(quiz, answers) Number
        +calculateXP(score, difficulty) Number
    }

    class CourseService {
        -Firestore firestore
        +createCourse(data) Course
        +getHierarchy() Course[]
        +createProgram(courseId, data) Program
        +createSubject(programId, data) Subject
        +createChapter(subjectId, data) Chapter
        +getChapterQuizzes(chapterId) Quiz[]
    }

    %% Controllers
    class AuthController {
        -UserService userService
        -JWTUtils jwtUtils
        +signup(req, res) void
        +login(req, res) void
        +exchangeFirebaseToken(req, res) void
        +refreshToken(req, res) void
        +logout(req, res) void
    }

    class QuizController {
        -QuizService quizService
        +getAllQuizzes(req, res) void
        +getQuizById(req, res) void
        +createQuiz(req, res) void
        +updateQuiz(req, res) void
        +deleteQuiz(req, res) void
    }

    class AttemptController {
        -AttemptService attemptService
        -QuizService quizService
        -UserService userService
        +startAttempt(req, res) void
        +submitAttempt(req, res) void
        +getAttempt(req, res) void
        +getUserAttempts(req, res) void
    }

    %% Relationships
    User "1" --> "1" UserProfile : has
    User "1" --> "1" UserStats : has
    User "1" --> "*" QuizAttempt : takes

    Course "1" --> "*" Program : contains
    Program "1" --> "*" Subject : contains
    Subject "1" --> "*" Chapter : contains
    Chapter "1" --> "*" Quiz : contains

    Quiz "1" --> "*" Question : contains
    Question "1" --> "*" Option : has
    Quiz "1" --> "*" QuizAttempt : generates

    QuizAttempt "1" --> "*" Answer : contains
    Answer "*" --> "1" Question : answers

    UserService ..> User : manages
    QuizService ..> Quiz : manages
    AttemptService ..> QuizAttempt : manages
    CourseService ..> Course : manages
    CourseService ..> Program : manages
    CourseService ..> Subject : manages
    CourseService ..> Chapter : manages

    AuthController ..> UserService : uses
    QuizController ..> QuizService : uses
    AttemptController ..> AttemptService : uses
    AttemptController ..> QuizService : uses
    AttemptController ..> UserService : uses

    %% Enums
    class UserRole {
        <<enumeration>>
        ADMIN
        TEACHER
        STUDENT
    }

    class Difficulty {
        <<enumeration>>
        EASY
        MEDIUM
        HARD
    }

    class QuestionType {
        <<enumeration>>
        MULTIPLE_CHOICE
        TRUE_FALSE
        MULTI_SELECT
    }

    class AttemptStatus {
        <<enumeration>>
        IN_PROGRESS
        COMPLETED
        ABANDONED
    }

    User --> UserRole
    Quiz --> Difficulty
    Question --> QuestionType
    QuizAttempt --> AttemptStatus
```

---

## Microservices Communication Patterns

### Inter-Service Communication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Gateway as API Gateway<br/>:3000
    participant Auth as Auth Service<br/>:3001
    participant Quiz as Quiz Service<br/>:3002
    participant Firestore as Firestore<br/>Database
    participant Firebase as Firebase<br/>Admin SDK

    Note over Client,Firestore: Request Flow with Service Isolation

    %% Authentication Flow
    rect rgb(220, 240, 255)
    Client->>Gateway: POST /api/auth/login
    Gateway->>Gateway: Rate limiting check
    Gateway->>Gateway: CORS validation
    Gateway->>Auth: Proxy to http://localhost:3001
    Auth->>Auth: Validate credentials
    Auth->>Firebase: Initialize Admin SDK
    Auth->>Firestore: Query users collection
    Firestore-->>Auth: User document
    Auth->>Auth: Generate JWT tokens
    Auth-->>Gateway: Response with tokens
    Gateway-->>Client: Forward response
    end

    %% Authenticated Request to Quiz Service
    rect rgb(240, 255, 240)
    Client->>Gateway: GET /api/quizzes<br/>Authorization: Bearer {token}
    Gateway->>Gateway: Extract JWT from header
    Gateway->>Auth: Validate token (optional)
    Auth->>Auth: Verify JWT signature
    Auth-->>Gateway: Token valid
    Gateway->>Quiz: Proxy to http://localhost:3002
    Quiz->>Quiz: Extract user from token
    Quiz->>Firebase: Initialize Admin SDK
    Quiz->>Firestore: Query quizzes collection
    Firestore-->>Quiz: Quiz documents
    Quiz-->>Gateway: Quiz array
    Gateway-->>Client: Forward quizzes
    end

    %% Cross-Service Data Access
    rect rgb(255, 240, 255)
    Client->>Gateway: POST /api/attempts/submit
    Gateway->>Quiz: Proxy to quiz service
    Quiz->>Firestore: Get attempt document
    Quiz->>Firestore: Get quiz document
    Quiz->>Quiz: Calculate score & XP
    Quiz->>Firestore: Update attempt (quizzes db)
    Quiz->>Firestore: Update user stats (users db)
    Note over Quiz,Firestore: Cross-collection transaction
    Firestore-->>Quiz: Transaction success
    Quiz-->>Gateway: Results
    Gateway-->>Client: Display results
    end

    Note over Client,Firestore: Services communicate via Gateway (no direct service-to-service calls)
        +Number order
        +Boolean isActive
        +Date createdAt
    }

    class Quiz {
        +String id
        +String chapterId
        +String title
        +String description
        +String difficulty
        +Number passingScore
        +Number timeLimit
        +Number xpReward
        +Question[] questions
        +Number totalAttempts
        +Number averageScore
        +Boolean isActive
        +Date createdAt
    }

    class Question {
        +String id
        +String type
        +String text
        +String[] options
        +String correctAnswer
        +Number points
        +String explanation
    }

    class Attempt {
        +String id
        +String userId
        +String quizId
        +Answer[] answers
        +Number score
        +Number percentage
        +Boolean isPassed
        +Number xpEarned
        +Number timeSpent
        +Date startedAt
        +Date completedAt
        +Date createdAt
    }

    class Answer {
        +String questionId
        +String userAnswer
        +Boolean isCorrect
        +Number pointsEarned
        +Number timeSpent
    }

    class QuizController {
        +createQuiz(req, res, next) void
        +getQuizById(req, res, next) void
        +getAllQuizzes(req, res, next) void
        +updateQuiz(req, res, next) void
        +deleteQuiz(req, res, next) void
    }

    class AttemptController {
        +startAttempt(req, res, next) void
        +submitAttempt(req, res, next) void
        +getAttempt(req, res, next) void
        +getUserAttempts(req, res, next) void
    }

    Course "1" --> "*" Program : contains
    Program "1" --> "*" Subject : contains
    Subject "1" --> "*" Chapter : contains
    Chapter "1" --> "*" Quiz : contains
    Quiz "1" --> "*" Question : contains
    Quiz "1" --> "*" Attempt : has
    Attempt "1" --> "*" Answer : contains

    QuizController ..> Quiz : manages
    AttemptController ..> Attempt : manages
    AttemptController ..> Quiz : reads
```

---

## Complete User Journey Map

### End-to-End User Journey: From Visitor to Active Learner

```mermaid
journey
    title Complete QuizHub User Experience (All Roles)

    section Initial Discovery
      Visit QuizHub website: 5: Visitor
      View landing page features: 4: Visitor
      Browse public quiz catalog: 4: Visitor
      See leaderboard preview: 3: Visitor
      Decide to sign up: 5: Visitor

    section Registration & Onboarding
      Click "Get Started": 5: Student
      Choose auth method: 4: Student
      Sign up with Google OAuth: 5: Student
      Grant permissions: 4: Student
      Profile auto-created: 5: Student
      See welcome dashboard: 5: Student
      View tutorial overlay: 3: Student

    section Profile Setup
      Navigate to profile page: 4: Student
      Upload avatar image: 4: Student
      Fill bio and institution: 3: Student
      Select preferred subjects: 4: Student
      Set learning goals: 4: Student
      Save profile: 5: Student

    section Course Exploration
      Browse course hierarchy: 5: Student
      Select "Computer Science": 5: Student
      Explore "Data Structures" program: 4: Student
      Choose "Arrays" subject: 4: Student
      View "Sorting Algorithms" chapter: 5: Student
      See 5 available quizzes: 5: Student

    section Quiz Selection & Start
      Read quiz details: 4: Student
      Check difficulty (Medium): 4: Student
      See XP reward (50 XP): 5: Student
      Note time limit (15 min): 4: Student
      Click "Start Quiz": 5: Student
      Attempt created in DB: 5: System
      Timer starts: 5: Student

    section Quiz Taking
      Read question 1/10: 5: Student
      Analyze options: 4: Student
      Select answer A: 5: Student
      Submit answer: 5: Student
      See correct feedback: 5: Student
      Progress to question 2: 5: Student
      Answer questions 2-9: 4: Student
      Reach final question 10: 4: Student
      Review all answers: 4: Student
      Submit quiz: 5: Student

    section Results & Rewards
      See loading animation: 4: Student
      View score 80%: 5: Student
      See XP earned +40: 5: Student
      Level up notification: 5: Student
      View correct answers: 5: Student
      Read explanations: 4: Student
      See new rank position: 5: Student
      Updated profile stats: 5: Student

    section Social Engagement
      Navigate to leaderboard: 5: Student
      Find position #45/500: 4: Student
      Compare XP with peers: 4: Student
      See friend's progress: 5: Student
      Get motivated to improve: 5: Student

    section Continued Learning
      Return to dashboard: 5: Student
      View achievement badges: 5: Student
      Check current streak: 4: Student
      Select next quiz: 5: Student
      Try harder difficulty: 4: Student
      Build 7-day streak: 5: Student

    section Admin Experience
      Admin logs in: 5: Admin
      Access admin panel: 5: Admin
      View system analytics: 5: Admin
      Check user engagement: 4: Admin
      Create new quiz: 5: Admin
      Add 10 questions: 4: Admin
      Assign to chapter: 5: Admin
      Set XP reward: 5: Admin
      Publish quiz: 5: Admin
      Monitor attempts: 5: Admin
      Review feedback: 4: Admin
      Adjust difficulty: 4: Admin

    section Teacher Experience
      Teacher logs in: 5: Teacher
      Create class group: 5: Teacher
      Assign quizzes: 5: Teacher
      Track student progress: 5: Teacher
      View class analytics: 5: Teacher
      Identify struggling students: 4: Teacher
      Provide feedback: 5: Teacher

    section System Processes
      Token refresh occurs: 5: System
      Firebase sync: 5: System
      Firestore write: 5: System
      XP calculation: 5: System
      Leaderboard update: 5: System
      Analytics tracking: 5: System
```

---

---

## Database Architecture & Schema

### Complete Firestore Data Model

```mermaid
erDiagram
    USERS ||--o{ ATTEMPTS : creates
    USERS {
        string id PK
        string email UK
        string username UK
        string password
        string role
        boolean isVerified
        string firebaseUid
        string displayName
        object profile
        string refreshToken
        timestamp lastLogin
        timestamp createdAt
        timestamp updatedAt
    }

    COURSES ||--o{ PROGRAMS : contains
    COURSES {
        string id PK
        string name UK
        string description
        string icon
        number order
        boolean isActive
        timestamp createdAt
        timestamp updatedAt
    }

    PROGRAMS ||--o{ SUBJECTS : contains
    PROGRAMS {
        string id PK
        string courseId FK
        string name
        string description
        number order
        boolean isActive
        timestamp createdAt
    }

    SUBJECTS ||--o{ CHAPTERS : contains
    SUBJECTS {
        string id PK
        string programId FK
        string name
        string description
        number order
        boolean isActive
        timestamp createdAt
    }

    CHAPTERS ||--o{ QUIZZES : contains
    CHAPTERS {
        string id PK
        string subjectId FK
        string name
        string description
        number order
        boolean isActive
        timestamp createdAt
    }

    QUIZZES ||--o{ ATTEMPTS : has
    QUIZZES {
        string id PK
        string chapterId FK
        string title
        string description
        string difficulty
        number passingScore
        number timeLimit
        number xpReward
        array questions
        number totalAttempts
        number averageScore
        boolean isActive
        timestamp createdAt
        timestamp updatedAt
    }

    ATTEMPTS {
        string id PK
        string userId FK
        string quizId FK
        array answers
        number score
        number percentage
        boolean isPassed
        number xpEarned
        number timeSpent
        timestamp startedAt
        timestamp completedAt
        timestamp createdAt
    }
```

### Firestore Indexes

```mermaid
graph TB
    subgraph "Composite Indexes"
        IDX1[programs: courseId + isActive + order]
        IDX2[subjects: programId + isActive + order]
        IDX3[chapters: subjectId + isActive + order]
        IDX4[quizzes: chapterId + isActive]
        IDX5[attempts: userId + createdAt DESC]
        IDX6[attempts: quizId + completedAt]
    end

    subgraph "Single Field Indexes"
        SIDX1[users: email]
        SIDX2[users: username]
        SIDX3[users: firebaseUid]
        SIDX4[quizzes: difficulty]
        SIDX5[attempts: isPassed]
    end

    style IDX1 fill:#3498db
    style IDX2 fill:#3498db
    style IDX3 fill:#3498db
    style IDX4 fill:#3498db
    style IDX5 fill:#3498db
    style IDX6 fill:#3498db
```

---

---

## Complete System Data Flow Diagram

### Unified Request/Response Flow Across All Components

```mermaid
flowchart TD
    Start([User Opens App]) --> HasToken{Has Valid<br/>Access Token?}
    HasToken -->|Yes| VerifyToken[Verify Token]
    HasToken -->|No| ShowAuth[Show Auth Page]

    VerifyToken --> TokenValid{Token Valid?}
    TokenValid -->|Yes| LoadApp[Load Application]
    TokenValid -->|No| HasRefresh{Has Refresh<br/>Token?}

    HasRefresh -->|Yes| RefreshFlow[Refresh Token Flow]
    HasRefresh -->|No| ShowAuth

    RefreshFlow --> RefreshValid{Refresh<br/>Successful?}
    RefreshValid -->|Yes| LoadApp
    RefreshValid -->|No| ClearTokens[Clear All Tokens]
    ClearTokens --> ShowAuth

    ShowAuth --> AuthMethod{Authentication<br/>Method}
    AuthMethod -->|Email/Password| EmailAuth[Email Auth Flow]
    AuthMethod -->|Google OAuth| GoogleAuth[Google OAuth Flow]

    EmailAuth --> ValidateInput{Valid Input?}
    ValidateInput -->|No| ShowError[Show Error]
    ShowError --> ShowAuth
    ValidateInput -->|Yes| SendToBackend[Send to Backend]

    GoogleAuth --> OpenPopup[Open Google Popup]
    OpenPopup --> UserAuthorize{User<br/>Authorizes?}
    UserAuthorize -->|No| ShowAuth
    UserAuthorize -->|Yes| GetFirebaseToken[Get Firebase Token]
    GetFirebaseToken --> SendToBackend

    SendToBackend --> BackendProcess[Backend Processing]
    BackendProcess --> AuthSuccess{Auth<br/>Successful?}
    AuthSuccess -->|No| ShowAuthError[Show Auth Error]
    ShowAuthError --> ShowAuth
    AuthSuccess -->|Yes| ReceiveTokens[Receive JWT Tokens]

    ReceiveTokens --> StoreLocal[Store in localStorage]
    StoreLocal --> LoadApp
    LoadApp --> End([Application Ready])
```

### 2. API Gateway Request Flow

```mermaid
flowchart LR
    Client[Client Request] --> Gateway[API Gateway :3000]

    Gateway --> RateLimit{Rate Limit<br/>Check}
    RateLimit -->|Exceeded| Return429[Return 429]
    RateLimit -->|OK| CORS{CORS<br/>Check}

    CORS -->|Invalid| Return403[Return 403]
    CORS -->|Valid| RouteMatch{Route<br/>Match}

    RouteMatch -->|/api/auth/*| AuthProxy[Proxy to Auth Service]
    RouteMatch -->|/api/users/*| AuthProxy
    RouteMatch -->|/api/quizzes/*| QuizProxy[Proxy to Quiz Service]
    RouteMatch -->|/api/attempts/*| QuizProxy
    RouteMatch -->|/api/courses/*| QuizProxy
    RouteMatch -->|No Match| Return404[Return 404]

    AuthProxy --> AuthService[Auth Service :3001]
    QuizProxy --> QuizService[Quiz Service :3002]

    AuthService --> AuthResponse[Process Request]
    QuizService --> QuizResponse[Process Request]

    AuthResponse --> ReturnAuth[Return Response]
    QuizResponse --> ReturnQuiz[Return Response]

    ReturnAuth --> Client
    ReturnQuiz --> Client
    Return429 --> Client
    Return403 --> Client
    Return404 --> Client

    style Gateway fill:#68a063
    style AuthService fill:#f39c12
    style QuizService fill:#e74c3c
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Frontend Hosting"
            VERCEL[Vercel/Netlify<br/>Next.js App]
        end

        subgraph "Backend Services"
            GW_PROD[API Gateway<br/>Docker Container]
            AS_PROD[Auth Service<br/>Docker Container]
            QS_PROD[Quiz Service<br/>Docker Container]
        end

        subgraph "Firebase Production"
            FA_PROD[Firebase Auth]
            FS_PROD[Firestore Production]
            FC_PROD[Firebase Analytics]
            FST_PROD[Firebase Storage]
        end

        subgraph "Monitoring & Logging"
            LOG[Logging Service]
            MON[Monitoring Dashboard]
        end
    end

    USERS[Users] -->|HTTPS| VERCEL
    VERCEL -->|API Calls| GW_PROD
    GW_PROD --> AS_PROD
    GW_PROD --> QS_PROD

    AS_PROD --> FA_PROD
    AS_PROD --> FS_PROD
    QS_PROD --> FS_PROD

    VERCEL --> FA_PROD
    VERCEL --> FC_PROD
    VERCEL --> FST_PROD

    GW_PROD -.->|Logs| LOG
    AS_PROD -.->|Logs| LOG
    QS_PROD -.->|Logs| LOG

    LOG --> MON
    FS_PROD -.->|Metrics| MON

    style VERCEL fill:#61dafb
    style GW_PROD fill:#68a063
    style AS_PROD fill:#f39c12
    style QS_PROD fill:#e74c3c
```

---

## Technology Stack

```mermaid
mindmap
  root((Technology<br/>Stack))
    Frontend
      Next.js 14
        App Router
        Server Components
        Client Components
      React 18
      TypeScript
      TailwindCSS
      React Query
      React Hook Form
      Zod Validation
      Axios
    Backend
      Node.js
      Express.js
      TypeScript
      ts-node
      Nodemon
    Microservices
      Auth Service
        JWT
        bcryptjs
        Firebase Admin SDK
      Quiz Service
        Firebase Admin SDK
        Express
      API Gateway
        http-proxy-middleware
        express-rate-limit
    Database
      Firestore
        NoSQL
        Real-time
        Scalable
        Serverless
    Authentication
      Firebase Auth
        Google OAuth
        Email/Password
        Token Management
    DevOps
      Docker
      Git
      npm workspaces
      concurrently
    Quality
      ESLint
      Prettier
      TypeScript
```

---

## Summary

QuizHub follows a **microservices architecture** with the following key characteristics:

### ✅ Service Independence

- **Auth Service**: Handles all authentication, user management, and JWT token operations
- **Quiz Service**: Manages quizzes, attempts, courses, and hierarchical content
- **API Gateway**: Central routing, rate limiting, and security

### ✅ Scalability

- Each service can be scaled independently
- Firestore provides serverless, auto-scaling database
- Stateless services enable horizontal scaling

### ✅ Technology Flexibility

- Services use shared TypeScript/Express stack but can adopt different technologies
- Firebase integration provides managed authentication and database
- Docker containers enable consistent deployment

### ✅ Fault Isolation

- Failure in one service doesn't crash the entire system
- API Gateway handles service unavailability gracefully
- Token refresh mechanism provides resilient authentication

### ✅ Development Efficiency

- Independent service development and deployment
- npm workspaces for code sharing
- Clear separation of concerns

---

## Microservices Architecture Principles Demonstrated

### 1. Service Independence & Autonomy

- **Auth Service** (Port 3001) and **Quiz Service** (Port 3002) operate independently
- Each service has its own deployment lifecycle, scaling policies, and failure domain
- Services can be updated, deployed, or restarted without affecting others

### 2. Single Responsibility Principle (SRP)

- **Auth Service**: Authentication, authorization, user management, JWT tokens
- **Quiz Service**: Quiz CRUD, attempts, scoring, XP system, course hierarchy
- **API Gateway**: Routing, rate limiting, CORS, security headers
- **Frontend**: User interface, state management, client-side logic

### 3. API-First & Contract-Based Design

- All services expose RESTful APIs with clear contracts
- Swagger/OpenAPI documentation available at `/api-docs` endpoints
- Standardized response formats: `{success, data?, error?}`

### 4. Decentralized Data Management

- Each service manages its own data access via Firebase Admin SDK
- No direct inter-service database calls
- Services communicate via APIs (through Gateway), not shared databases

### 5. Technology Stack Flexibility

- Current: TypeScript/Node.js/Express for all services (consistency)
- Future: Can replace any service with different tech (Python, Go, Java)
- Database: Firestore NoSQL allows schema flexibility per service

### 6. Gateway Pattern Implementation

- **Centralized Entry Point**: All client requests go through port 3000
- **Cross-Cutting Concerns**: CORS, rate limiting (100 req/15min), Helmet security
- **Service Discovery**: Gateway knows service locations, clients don't
- **Load Balancing**: Can distribute requests across multiple service instances

### 7. Stateless Service Design

- No session state stored in services
- JWT tokens carry all necessary user context
- Enables horizontal scaling without session affinity

### 8. Fault Isolation & Resilience

- If Quiz Service crashes, users can still login (Auth Service independent)
- Token refresh mechanism prevents complete logout during service restarts
- Gateway returns appropriate errors when services unavailable

### 9. Independent Scalability

- Can scale Quiz Service during exam periods
- Auth Service scaling independent of quiz load
- Frontend served via CDN, scales automatically

### 10. Containerization & Orchestration Ready

- Dockerfiles for each service
- docker-compose.yml for local orchestration
- Production-ready for Kubernetes, Cloud Run, ECS

---

## Quality Attributes & Non-Functional Requirements

### Performance

- **Response Time**: <500ms for API calls (Firebase global network)
- **Throughput**: Handles concurrent quiz attempts across distributed services
- **Caching**: JWT tokens reduce DB queries, Browser caching for static assets
- **CDN**: Next.js static files served from edge locations

### Scalability

- **Horizontal Scaling**: Add service replicas behind load balancer
- **Vertical Scaling**: Increase container CPU/memory per service
- **Database Scaling**: Firestore auto-scales, no manual sharding needed
- **Load Distribution**: API Gateway distributes requests evenly

### Security

- **Authentication**: Multi-factor (Firebase OAuth + Email/Password)
- **Authorization**: Role-based access control (Admin, Teacher, Student)
- **Data Protection**: HTTPS only, Firestore security rules, JWT token expiration
- **CORS**: Configured for specific origins, blocks unauthorized access
- **Rate Limiting**: Prevents brute force attacks and API abuse
- **Input Validation**: Joi schemas, middleware validation

### Availability

- **Service Redundancy**: Multiple service instances possible
- **Database HA**: Firestore 99.95% SLA with multi-region replication
- **Token Refresh**: Automatic renewal prevents session timeout
- **Graceful Degradation**: Services return 503 when dependencies fail

### Maintainability

- **Modular Codebase**: Each service is self-contained
- **Shared Code**: Common utilities in `packages/shared`
- **Type Safety**: TypeScript prevents runtime errors
- **API Documentation**: Swagger auto-generated from code
- **Logging**: Winston structured logging per service

### Testability

- **Unit Tests**: Services tested in isolation with mocked dependencies
- **Integration Tests**: Test service interactions via API contracts
- **End-to-End Tests**: Test complete user flows across all services
- **Contract Testing**: OpenAPI specs validate request/response formats

---

## Architecture Decision Records (ADR)

### ADR-001: Firebase/Firestore over MongoDB Atlas

**Status**: Accepted  
**Context**: MongoDB Atlas IP whitelist blocking development access  
**Decision**: Migrate to Firebase/Firestore for database and authentication  
**Consequences**:

- ✅ No IP restrictions, accessible from any network
- ✅ Built-in authentication (Firebase Auth)
- ✅ Global CDN and replication
- ✅ Generous free tier
- ❌ Learning curve for team (NoSQL query patterns)
- ❌ Vendor lock-in to Google Cloud

### ADR-002: API Gateway Pattern

**Status**: Accepted  
**Context**: Need centralized routing, security, and rate limiting  
**Decision**: Implement Express-based API Gateway on port 3000  
**Consequences**:

- ✅ Single entry point for all clients
- ✅ Consistent CORS, rate limiting, security headers
- ✅ Services hidden from direct client access
- ❌ Additional network hop (slight latency)
- ❌ Single point of failure (mitigate with multiple gateway instances)

### ADR-003: JWT + Firebase Authentication Hybrid

**Status**: Accepted  
**Context**: Need secure auth with Google OAuth support  
**Decision**: Firebase OAuth → Exchange for backend JWT tokens  
**Consequences**:

- ✅ Google OAuth popup authentication
- ✅ Custom JWT with user roles for backend
- ✅ Token refresh mechanism for long sessions
- ❌ Token exchange adds complexity
- ❌ Two token systems to maintain

### ADR-004: Monorepo with npm Workspaces

**Status**: Accepted  
**Context**: Need to share types, utilities, configs between services  
**Decision**: Use monorepo structure with npm workspaces  
**Consequences**:

- ✅ Code sharing via `packages/shared`
- ✅ Consistent dependencies and versions
- ✅ Single command to start all services
- ❌ More complex build process
- ❌ Longer CI/CD pipelines

### ADR-005: Next.js for Frontend

**Status**: Accepted  
**Context**: Need SEO, fast initial load, modern React features  
**Decision**: Next.js 14 with App Router and Server Components  
**Consequences**:

- ✅ Server-side rendering for better SEO
- ✅ Automatic code splitting and optimization
- ✅ Built-in API routes (not used, backend services instead)
- ❌ Steeper learning curve than plain React
- ❌ Requires Node.js server (can't deploy to static hosting)

---

## System Architecture Justification (For SRS Document)

### Why Microservices Over Monolith?

| Criterion                  | Monolithic Architecture        | Microservices Architecture (✅ Chosen) |
| -------------------------- | ------------------------------ | -------------------------------------- |
| **Initial Complexity**     | Lower (simpler deployment)     | Higher (multiple services, Gateway)    |
| **Scalability**            | Scale entire app (inefficient) | ✅ Scale services independently        |
| **Fault Isolation**        | One bug crashes entire app     | ✅ Services fail independently         |
| **Technology Flexibility** | Single tech stack              | ✅ Polyglot possibilities              |
| **Development Speed**      | Slower (merge conflicts)       | ✅ Parallel team development           |
| **Deployment**             | All-or-nothing                 | ✅ Deploy services independently       |
| **Data Consistency**       | Easier (single database)       | Eventual consistency challenges        |
| **Operational Overhead**   | Lower (one app to monitor)     | Higher (multiple services)             |
| **Team Size**              | Better for small teams         | ✅ Better for larger teams             |
| **Testing**                | Simpler (single codebase)      | More complex (integration tests)       |

**Justification**: QuizHub uses microservices because:

1. **Educational Requirement**: Demonstrates modern distributed systems for BSE 2053
2. **Real-World Pattern**: Most large-scale web apps use microservices
3. **Scalability**: Can handle growth from 100 to 100,000 users by scaling quiz service
4. **Maintainability**: Clear service boundaries make code easier to understand
5. **Resilience**: Auth service failure doesn't prevent quiz taking (with cached tokens)

---

## Deployment & Operations

### Local Development Setup

```bash
# Install all dependencies
npm install

# Start all services concurrently
npm run dev
# Gateway: http://localhost:3000
# Auth Service: http://localhost:3001
# Quiz Service: http://localhost:3002
# Frontend: http://localhost:3006
```

### Docker Compose Deployment

```bash
# Build all service images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Production Deployment Recommendations

**Frontend** → Vercel/Netlify

- Next.js optimized hosting
- Automatic SSL/CDN
- Git-based deployments

**Backend Services** → Google Cloud Run / AWS ECS / Azure Container Apps

- Auto-scaling containers
- Pay-per-request pricing
- Built-in load balancing

**API Gateway** → Cloud Load Balancer / NGINX

- High availability
- SSL termination
- DDoS protection

**Database** → Firebase/Firestore Production Project

- Configure security rules
- Set up backup policies
- Enable monitoring

---

## Monitoring & Observability

### Logging

- Winston structured logging in all services
- Log levels: error, warn, info, debug
- Centralized logging to Cloud Logging / Elasticsearch

### Metrics (Proposed)

- Request rate per endpoint
- Response time percentiles (p50, p95, p99)
- Error rates by service
- Database query performance

### Tracing (Proposed)

- OpenTelemetry for distributed tracing
- Track requests across Gateway → Auth/Quiz → Firestore
- Identify bottlenecks in request flow

### Health Checks

```bash
# Gateway health
curl http://localhost:3000/health

# Auth service health
curl http://localhost:3001/health

# Quiz service health
curl http://localhost:3002/health
```

---

## Future Enhancements & Roadmap

### Phase 1: Core Features (✅ Current State)

- ✅ User authentication (Email + Google OAuth)
- ✅ Quiz CRUD operations
- ✅ Quiz attempt tracking
- ✅ XP and leveling system
- ✅ Leaderboard

### Phase 2: Enhanced Features (Planned)

- [ ] Real-time notifications (WebSockets)
- [ ] Advanced analytics dashboard
- [ ] Quiz scheduling and deadlines
- [ ] Peer-to-peer quiz challenges
- [ ] Badge system and achievements

### Phase 3: Scalability (Planned)

- [ ] GraphQL Gateway (replace REST)
- [ ] Redis caching layer
- [ ] Message queue (RabbitMQ/Cloud Pub/Sub)
- [ ] Search service (Elasticsearch)
- [ ] CDN for media files

### Phase 4: Advanced Architecture (Future)

- [ ] Service mesh (Istio)
- [ ] CQRS pattern for read/write separation
- [ ] Event sourcing for audit trails
- [ ] Kubernetes deployment with Helm charts
- [ ] Multi-region deployment

---

## Conclusion

**QuizHub successfully demonstrates microservices architecture with:**

✅ **Multiple Independent Services**: Auth, Quiz, Gateway, Frontend  
✅ **API Gateway Pattern**: Centralized routing, security, rate limiting  
✅ **Service Isolation**: Each service can fail, deploy, scale independently  
✅ **Distributed Database**: Firestore accessed independently by services  
✅ **Containerization**: Docker for consistent deployments  
✅ **Stateless Design**: JWT tokens enable horizontal scaling  
✅ **Security**: OAuth, RBAC, CORS, rate limiting, input validation  
✅ **Observability**: Structured logging, API documentation  
✅ **Technology Stack**: TypeScript, Node.js, Express, Next.js, Firebase

**Educational Value**: This architecture is ideal for a Software Engineering assignment because it demonstrates:

- Modern distributed systems design
- Real-world industry patterns
- Scalability considerations
- Security best practices
- Quality attribute trade-offs

**Production Readiness**: The system can handle:

- Thousands of concurrent users
- Independent service scaling
- Graceful degradation under load
- Continuous deployment pipelines

This architecture supports the educational requirements for demonstrating microservices patterns while providing a production-ready quiz application.

---

**Document Version**: 2.0  
**Last Updated**: November 14, 2025  
**Course**: BSE 2053 - Software Engineering  
**Institution**: City University Malaysia  
**Authors**: QuizHub Development Team
