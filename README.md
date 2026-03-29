# inVision U - Intelligent Candidate Selection Support System

This project is submitted for the **AI inDrive** track of Decentrathon 5.0. It is a web-based, AI-driven dashboard designed to facilitate the initial screening of candidates for inVision U.

## Overivew
The solution aims to evaluate candidates based on skills, experience, motivation, and potential, significantly reducing the manual workload of the admissions committee while maintaining transparency (Explainable AI) and keeping a "human-in-the-loop."

It provides a gamified, multilingual dashboard for applicants to complete an AI interview, upload their CV, and submit a motivation letter.

## Live Demo (Local)
This is a [Next.js](https://nextjs.org) 16 application.

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```

3. **View the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
*   **Framework:** Next.js 16 (React 19)
*   **Styling:** Custom CSS Modules (Dark mode/Neon UI themes)
*   **State Management:** Zustand (with local storage persistence)
*   **Localization:** Built-in exact i18n support (English, Russian, Kazakh)
*   **AI Engine (Mocked):** Custom NLP keyword-based heuristic scoring (for Stage 1 prototype purposes, to be replaced by actual LLMs).

## Features
*   **Interactive AI Interview:** Real-time conversational interface where the user answers specific questions, evaluated across 4 dimensions: Motivation, Experience, Skills, Potential.
*   **Gamified Applicant Dashboard:** Earn XP, level up (e.g., from "Applicant" to "Visionary"), and unlock achievements based on application progress.
*   **Multilingual Support:** Seamlessly switch between English, Russian, and Kazakh throughout the entire platform.
*   **Holographic Profile ID:** A visual verification badge for candidates.
*   **Admin Panel (Committee View):** `/admin` route for the admissions committee to view all candidates, analyze score distributions, and make final decisions (Approve, Reject, Waitlist).
*   **Explainable Scoring:** The mock scoring engine provides feedback on *why* a particular score was assigned (e.g., "Good response with relevant points. Consider adding specific examples.").

## Data Description
For the Stage 1 prototype, no real personal data is collected or stored on a backend.
*   **User Data:** Stored locally in the browser via `localStorage` (Zustand persist).
*   **Mock Candidates:** Pre-populated list of simulated candidates (with names, regions, scores, and XP) is loaded from `/src/data/mockData.js` to demonstrate the Leaderboard and Admin panel.
*   **Interview Questions:** Pre-defined sets of questions across 3 languages are also stored in `/src/data/mockData.js`.

## Limitations & Future Directions
*   **Current Limitations:** The AI evaluations (Interview, CV, Motivation Letter) currently utilize simulated processing delays and keyword-based NLP rules rather than a live LLM integration due to prototype constraints.
*   **Future Development:**
    *   Integrate directly with an OpenAI API or fine-tuned LLM for deep semantic analysis of essays and interview responses.
    *   Implement real backend databases (e.g., PostgreSQL + Prisma) for secure applicant data storage.
    *   Add multimodal assessment (video interview analysis).

For system architecture, please view `ARCHITECTURE.md`.
