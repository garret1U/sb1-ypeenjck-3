# Cursor Rules for Project

## Project Overview

**Project Name:** Gun Club Scoring Web Application\
**Description:** A modern web application designed to streamline score tracking and management for shooting clubs. It offers solutions to traditional record-keeping challenges by providing real-time statistics, efficient club management, and field setup functionalities.\
**Tech Stack:**

*   **Frontend:** React.js
*   **Backend:** Node.js
*   **Database:** Supabase
*   **AI Tools:** Bolt, Claude, ChatGPT, Cursor.

### Key Features

*   User Authentication and Role Management.
*   Club and Shooter Management with Real-Time Scoring.
*   Comprehensive Field Management with Maintenance Scheduling.
*   Advanced Statistics and Analytics for Shooting Performance.

## Project Structure

### Root Directory

Contains the main configuration files and documentation such as README.md and configuration settings.

### /frontend

Contains all frontend-related code, following React.js structure.

*   **/components**

    *   Header
    *   Dashboard
    *   ScoreEntry
    *   UserProfile
    *   ClubManagement
    *   FieldConfiguration

*   **/assets**

    *   Images (e.g., logos, illustrations)
    *   Icons

*   **/styles**

    *   Global.css
    *   Layout.css
    *   Components.css

### /backend

Contains all backend-related code, with Node.js handling server operations.

*   **/controllers**

    *   ScoreController.js
    *   UserController.js
    *   ClubController.js

*   **/models**

    *   UserModel.js
    *   ScoreModel.js
    *   ClubModel.js
    *   FieldModel.js

*   **/routes**

    *   index.js
    *   userRoutes.js
    *   scoreRoutes.js
    *   clubRoutes.js

*   **/config**

    *   db.js (Database connection setup)
    *   auth.js (Authentication setup)

### /tests

Contains unit and integration tests for both frontend and backend.

## Development Guidelines

**Coding Standards:**

*   Follow JavaScript ES6+ standards.
*   Use functional components with hooks in React.

**Component Organization:**

*   Ensure components are reusable and well-documented.
*   Adhere to a modular structure separating logic and presentation.

## Cursor IDE Integration

**Setup Instructions:**

1.  Clone the repository.
2.  Navigate to the project root directory.
3.  Install dependencies using `npm install`.
4.  Start the development server with `npm start` for frontend and backend.

**Key Commands:**

*   `npm test` to run test suites.
*   `npm run build` to compile the production build.

## Additional Context

**User Roles:**

*   **Club Manager:** Full access to manage clubs, shooters, and scores.
*   **Shooter:** Limited access to record scores and manage personal information.

**Accessibility Considerations:**

*   Ensure all components are keyboard navigable and screen reader compatible.
*   Follow WCAG guidelines for color contrast and text visibility.
