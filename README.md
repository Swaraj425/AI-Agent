# FoundrAI - Your AI Startup Strategist

FoundrAI is an intelligent AI agent designed to guide early-stage founders, solopreneurs, and small business owners through the startup journey. Built using FastAPI (Python) for the backend and a responsive React.js + Tailwind CSS frontend, FoundrAI acts like a virtual co-founder — helping users validate ideas, plan MVPs, strategize launches, and more.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features
FoundrAI provides the following features to help users build and scale their startups:

### 🧠 What FoundrAI Can Do
1. **/idea-validate**:
   - Helps users assess the feasibility and market fit of their startup idea.
   - Checks practicality, market demand, differentiation, and competition.
   - Suggests ways to improve or pivot weak ideas.

2. **/mvp-planner**:
   - Guides users to build a Minimum Viable Product (MVP).
   - Recommends essential features, tools, and MVP goals.
   - Outputs a lean and testable product plan.

3. **/go-to-market**:
   - Creates a custom go-to-market (GTM) plan.
   - Defines target users, marketing channels, and partnerships.
   - Suggests effective launch tactics.

4. **/pitch-deck**:
   - Auto-generates content and structure for a startup pitch deck.
   - Slide-by-slide guidance for problem, solution, market, team, etc.
   - Includes visual/design tips.

5. **/financial-forecast**:
   - Estimates basic financials.
   - Revenue, costs (infra/team/marketing), profit margins, and assumptions.

6. **/competitive-analysis**:
   - Provides an overview of competitors and strategies to stand out.
   - Highlights market gaps and positioning techniques.

7. **/investor-email**:
   - Generates professional cold emails to pitch investors.
   - Includes founder intro, startup vision, ask, and call-to-action.

8. **/tagline-name-generator**:
   - Suggests brand names and taglines.
   - Checks for uniqueness and domain friendliness.

---

## Tech Stack
### Frontend
- React.js
- Tailwind CSS
- React Icons (for UI components)

### Backend
- FastAPI
- MongoDB (via PyMongo)
- SQLAlchemy (for database interactions)
- HTTPX (for async API requests)

### APIs Used
- **OpenRouter API**: For AI chat responses.
- **GNews API**: For fetching relevant news articles.

---

## Installation

### Prerequisites
- Node.js and npm
- Python 3.9+
- MongoDB

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/startup-copilot.git
   cd startup-copilot

2. Install backend dependencies:
    ```bash
    cd backend
    pip install -r requirements.txt

3. Install frontend dependencies: 
    ```bash
    cd ../frontend
    npm install

4. Setup MongoDB : 

    Ensure MongoDB is running locally or provide a connection string in the environment variables.

5. Set up environment variables:

    Create a .env file in the backend directory with the required variables (e.g., API keys, database URI).

6. Start the backend server : 

    ```bash
    cd ../backend
    uvicorn app.main:app --reload
    
7. Start the frontend development server : 
    ```bash
    cd ../frontend
    npm run dev
