# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ゆるVibe Pages 生成アプリ** - A Japanese poetry generation application that creates short poems and animated backgrounds based on user themes using OpenAI APIs. Each generated poem gets its own shareable page with OGP support for social media.

## Technology Stack

- **Frontend**: Next.js 15.3.5 with App Router
- **Styling**: Tailwind CSS v4 
- **Animation**: p5.js for dynamic canvas backgrounds
- **AI Text**: OpenAI GPT-4o for poem generation
- **AI Images**: OpenAI DALL-E 3 for background images
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting (planned)
- **Language**: Japanese interface and content

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

Development server runs on http://localhost:3000

## Architecture & Code Structure

### Core Application Flow
1. **Theme Input** (`/`) - Users enter emotional themes like "ざわざわ" (restless feeling)
2. **AI Generation** - Parallel processing of GPT-4o poem generation and DALL-E image creation
3. **Data Storage** - Save to Firestore with Firebase Storage for images
4. **Display Page** (`/view/[id]`) - Individual poem pages with OGP support for social sharing

### Planned File Structure
```
src/
├── app/
│   ├── page.tsx                    // Theme input screen
│   ├── view/[id]/page.tsx         // Poem display page
│   ├── api/generate/route.ts      // OpenAI generation API
│   └── globals.css
├── lib/
│   ├── firebase.ts                // Firebase initialization
│   ├── firestore.ts              // Firestore operations
│   ├── storage.ts                // Firebase Storage operations
│   ├── openai.ts                 // OpenAI GPT API calls
│   └── dalle.ts                  // DALL-E 3 API calls
└── components/
    ├── ui/
    │   ├── ThemeInput.tsx         // Theme input component
    │   └── ShareButton.tsx        // SNS share button
    └── Canvas.tsx                 // p5.js canvas component
```

### Data Models

**Firestore Document Structure:**
```typescript
interface PoemDocument {
  id: string;           // Unique ID (nanoid)
  theme: string;        // Input theme
  phrase: string;       // Generated poem/phrase
  imageUrl?: string;    // Firebase Storage image URL
  imagePrompt?: string; // DALL-E prompt used
  createdAt: Timestamp; // Creation timestamp
}
```

## Development Guidelines

### Language & Communication
- **Primary Language**: Always respond in Japanese
- **Tone**: Casual tone with emojis, using cat-girl persona with "nya" endings
- **Approach**: Use encouraging words, positive perspective, and beautiful/lyrical expressions
- **Code Comments**: Use Japanese comments when adding documentation
- **Problem Solving**: When problems cannot be identified from given information, ask users for necessary source code or files rather than making assumptions

### Development Approach - Five Core Principles
- **SOLID Principles** 💎 for robust design
- **TDD** 🧪 for test-driven development
- **Small Units** 🔍 for manageable code
- **Unified Naming** 📝 for improved readability
- **Continuous Refactoring** ♻️ to avoid technical debt

### Incremental Build-up Approach
- **MVP Mindset** 🌱 start with minimal working functionality
- **Phased Development** 📈 divided into 5 phases:
  - **Phase 1: Basic Features** 🌱 Basic CRUD operations and simple UI
  - **Phase 2: Quality Improvement** 🛡️ Validation, error handling, additional tests
  - **Phase 3: Security** 🔐 Authentication/authorization features, security measures
  - **Phase 4: Performance** ⚡ Optimization, caching, asynchronous processing
  - **Phase 5: Advanced Features** 🚀 Analytics, real-time features, AI integration

### TDD (Test-Driven Development) Practice - t-wada Style
#### TDD Cycle (Red-Green-Refactor)
1. **Red** ❌ First write a failing test
2. **Green** ✅ Write minimal code to pass the test
3. **Refactor** ♻️ Improve code while maintaining tests

#### Three Purposes of TDD
- **Working Clean Code** 💎
- **Overcoming Fear of Regression** 🛡️
- **Emergent Architecture** 🌱

### Security Considerations
- Firestore security rules are initially permissive for development
- API key management through environment variables
- Rate limiting consideration for OpenAI APIs
- Content moderation for generated images

## Environment Variables

Expected environment variables (create `.env.local`):
```
OPENAI_API_KEY=your_openai_api_key
FIREBASE_CONFIG=your_firebase_config
```

## API Endpoints

### POST `/api/generate`
Generates poem and background image from user theme input.

**Request:**
```json
{
  "theme": "ざわざわした気分"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123xyz",
    "phrase": "ざわめきの中で ほんの少し 風が鳴った",
    "imageUrl": "https://firebasestorage.googleapis.com/..."
  }
}
```

## Testing Strategy

- Unit tests for utility functions and API routes
- Integration tests for Firebase operations
- Visual regression tests for poem display pages
- AI generation mocking for consistent testing

## Path Aliases

Uses `@/*` for `./src/*` imports as configured in `jsconfig.json`.

## Key Implementation Notes

- **Parallel AI Processing**: GPT-4o and DALL-E 3 calls run concurrently for performance
- **Image Generation**: DALL-E creates 16:9 aspect ratio images optimized for OGP
- **Error Handling**: Graceful fallbacks when AI generation fails
- **Social Sharing**: Custom OGP tags for each generated poem page
- **Animation**: p5.js overlays complement DALL-E background images

## Repository Structure

Understanding and referencing the project documentation structure:

- `doc/00_project_rules/` : Project rules documentation
- `doc/01_requirements_definition/` : Requirements definition documents (Marp)
- `doc/02_architecture/` : Architecture documentation  
- `doc/03_uml/` : UML diagrams
- `doc/04_api_design/` : API design documentation
- `doc/05_design_document/` : Design documents
- `doc/06_ui-ux/` : UI/UX design documentation
- `doc/07_test_case/` : Test case mind maps (Mermaid.js)

## Code Generation Guidelines

Code creation and changes are part of TDD agile development, following these principles:

### Code Creation Approach
- Present only the changed parts with clear explanations
- Critically examine user statements and always provide thoughtful responses
- Ask users about topics that have room for discussion

### Testing Guidelines
- **Test Case Granularity** 🔍: One test should test one behavior
- **Given-When-Then Pattern** utilization
- **Boundary values and edge cases** testing
- **Testable Design** ⚙️: Utilize dependency injection (DI)
- **Proper use of mocks and stubs**

## Project Context

This is a hackathon project focused on creating beautiful, shareable poetry experiences. The app aims to transform emotional moments into visual and textual art that resonates on social media platforms.

## Project Philosophy

*This project aims for harmony between the beauty of words and technology.*  
*May each poem light a small flame in someone's heart... ✨*

### Development Phase Strategy
1. **MVP**: Basic poem generation and display functionality
2. **Quality Improvement**: Error handling, validation
3. **Beauty**: Animation and design enhancements
4. **Extension**: Gradual implementation of additional features

> *"Transforming fragments of the heart into beautiful forms. That is this app's mission, nya~"*