# inVision U - Intelligent Candidate Selection System Architecture

## Overview
This project is an AI/data-driven solution designed for the initial screening of candidates for inVision U. It provides a gamified, interactive web dashboard for applicants and a comprehensive evaluation panel for the admissions committee.

The system is built to significantly reduce the manual workload of the admissions committee while providing a transparent, explainable support tool.

## System Components

1.  **Frontend Web Dashboard (Applicant Portal):**
    *   **Technology:** Next.js 16 (React 19), Zustand for state management, CSS Modules for styling.
    *   **Features:**
        *   Multilingual Support (EN, RU, KZ).
        *   Gamified progress tracking (XP, Levels, Achievements).
        *   Interactive AI Interview interface.
        *   CV and Motivation Letter upload/input portals.
        *   Profile and acceptance status viewing.

2.  **Admins & Evaluation Panel:**
    *   **Technology:** Next.js (Admin routes).
    *   **Features:**
        *   List of all candidates with aggregate scores.
        *   Detailed view of individual applicant performance across dimensions (Motivation, Experience, Skills, Potential).
        *   Tools to approve, waitlist, or reject candidates.
        *   Score distribution analytics.

3.  **AI Evaluation Engine (Mocked API Layer for Prototype):**
    *   **Technology:** JavaScript utility functions (`src/utils/scoring.js`).
    *   **Features:**
        *   **Interview Scoring:** Evaluates text responses based on keyword density, sentence variety, and specific examples, providing explainable scoring (0-100) across predefined categories (motivation, experience, skills, potential).
        *   **CV Analysis:** Simulates extracting skills, experience years, and education level, providing actionable suggestions.
        *   **Motivation Letter Analysis:** Assesses authenticity, writing quality, relevance, and impact, identifying key themes.
    *   *Note: In the production version, this layer will be replaced with actual LLM endpoints (e.g., OpenAI API or custom models).*

4.  **Data Management:**
    *   **Local State:** Zustand with `persist` middleware for retaining applicant session data and progress (Theme, Language, XP, Application State).
    *   **Mock Data:** Hardcoded candidate profiles and interview questions stored in `/src/data/mockData.js` to demonstrate the platform's capabilities without needing a live backend database for the Stage 1 prototype.

## Data Flow
1.  **Candidate Input:** The user registers and submits data via the text fields (Interview, Motivation Letter) or simulated file uploads (CV).
2.  **Processing:** The data is sent to the AI Evaluate Engine functions.
3.  **Scoring & Feedback:** The engine processes the text, calculates scores based on defined heuristics, and generates explanatory feedback.
4.  **State Update:** The results are saved to the Zustand store, updating the user's progress, XP, and enabling new dashboard elements (achievements).
5.  **Admin Review:** The simulated backend data is accessible via the Admin panel, allowing committee members to review the generated scores and make final "human-in-the-loop" decisions.

## Explainability (XAI)
The system is designed with algorithmic transparency. Scores are not just raw numbers; they are accompanied by:
*   Breakdowns of performance across specific criteria (e.g., Leadership, Communication).
*   Feedback text explaining *why* a particular score was given (e.g., "Good response with relevant points. Consider adding specific examples.").
*   Visualizations (Radar charts, progress bars) to make the evaluation instantly comprehensible to the committee.
