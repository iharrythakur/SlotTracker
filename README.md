# BookMySlot – Fullstack Hiring Challenge for New Grads

Welcome to the WizCommerce Fullstack Hiring Challenge! This challenge is designed to assess your frontend and backend skills in building a simple, real-world application. Good luck, and have fun!

> 🧠 **Note:** This challenge is ideal for SD1 candidates applying for either frontend or backend roles — but the best candidates will attempt both parts. We'll evaluate you on your strengths, but fullstack attempts are highly appreciated.

---

## 🔄 Project Overview

Build a simple scheduling application where users can create events and let others book available time slots. Think of it as a mini-Calendly.

---

## 🚀 Core Features

### ✏️ 1. Create Event (Private User)

- Input: Event title, description
- List of available time slots (ISO 8601 format: `2025-06-20T10:00`)
- Max bookings per slot

### 📋 2. Public Event Listing

- List of all created events with titles and basic info
- Click to see event details + available time slots

### ⏰ 3. Booking Interface

- Visitors can enter name + email to book a slot
- Slot becomes unavailable after booking
- Prevent double booking for same user + slot

### 🌍 4. Time Zone Support

- Users should be able to view and book slots in **their local time zone**
- Time slots should auto-convert to user's browser or selected time zone
- Store data in UTC and convert client-side using libraries like `date-fns-tz` or `luxon`

### 📅 5. View My Bookings (optional)

- User can see all their past bookings (filter by email)

---

## 🖥 Suggested Frontend Screens

### 1. **Home Page (Event Listing)**

- Displays all upcoming public events
- Basic event metadata: name, creator, number of slots

### 2. **Event Details Page**

- Shows:

  - Event name and description
  - Available slots in user's local time
  - Booking form with name + email input

### 3. **Create Event Page**

- Form to input event name, description, and slots (date + time)
- Time zone awareness on the input

### 4. **My Bookings Page (Optional)**

- Displays list of bookings by current user (using email as identifier)

### 5. **Success/Feedback Screens**

- Post-booking confirmation
- Error/failure states (e.g. already booked, slot full)

---

## 📊 API Specification (Suggested)

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| POST   | `/events`                | Create an event          |
| GET    | `/events`                | List all events          |
| GET    | `/events/:id`            | Get event + slots        |
| POST   | `/events/:id/bookings`   | Book a slot              |
| GET    | `/users/:email/bookings` | View bookings (optional) |

---

## 📚 Tech Stack (Suggestions)

- **Frontend**: React (Vite) + TailwindCSS
- **Backend**: FastAPI
- **Database**: PostgreSQL
- **Deployment**: Vercel (frontend) + Render / Railway (backend)

---

## 🚗 Deployment Instructions

### 🌐 Example Hosting Platforms

Here are some services you can use to deploy your frontend and backend:

#### Frontend (Static Hosting)

- [Vercel](https://vercel.com/) – Fast CI/CD with GitHub integration
- [Netlify](https://www.netlify.com/) – Great for React/Vite apps
- [Cloudflare Pages](https://pages.cloudflare.com/) – Free and fast
- [GitHub Pages](https://pages.github.com/) – Works for static SPAs

#### Backend (API + Database Hosting)

- [Render](https://render.com/) – Easy FastAPI
- [Railway](https://railway.app/) – Great for fullstack apps with PostgreSQL
- [Fly.io](https://fly.io/) – Edge deployment with Docker support
- [Replit](https://replit.com/) – Quick backend demos
- [Supabase](https://supabase.com/) – For database + lightweight backend APIs

### 📤 Submission Form

To officially submit your solution, please fill out this short [Google Form](https://forms.gle/bY9UeufzBpUhiyU5A) with the following details:

- Your Full Name
- Email Address
- GitHub repository link (private repo with access granted)
- Frontend deployment URL (e.g., Vercel)
- Backend deployment URL (e.g., Render)
- Any notes or context you want us to know

This helps us track all submissions in one place and ensures nothing gets missed.

1. Fork this repo
2. Build the frontend and backend
3. Deploy (if possible) and include URLs in your README
4. Submit GitHub link with live demo or local instructions

---

## ✨ Bonus Features (Optional)

- Email confirmation on booking
- Realtime booking updates
- Event branding with image upload
- Google Calendar sync (mocked is fine)

---

## 🔍 Evaluation Rubric

| Area             | What We're Looking For                        |
| ---------------- | --------------------------------------------- |
| ✅ Functionality | All core features implemented, no major bugs  |
| 📚 Code Quality  | Clear structure, modular design, comments     |
| 🎨 UI/UX         | Responsive design, form feedback, good layout |
| ⚙️ API Design    | RESTful, validation, edge-case handling       |
| 🚁 Deployment    | Working links, good README, .env support      |
| 📣 Communication | Commit hygiene, comments, README clarity      |

---

## 📄 Submission Checklist

- [x] Working backend with all relevant routes and validations
- [x] Functional frontend with event listing, detail view, and booking
- [x] Clear GitHub repository with meaningful commit history
- [x] Frontend deployment URL (e.g., Vercel)
- [x] Backend deployment URL (e.g., Render, Railway)
- [x] Local setup instructions (with `.env.example`)
- [x] Well-written README explaining tech choices, folder structure, and approach
- [x] Bonus features (if implemented) clearly listed in README
- [x] Short write-up on assumptions made and areas for improvement

---

## 🚀 Quick Start (Implementation)

This repository contains a complete implementation of the BookMySlot application. Here's how to get started:

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:

   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

5. Run the backend:
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your backend `.env` file
3. The tables will be created automatically when you run the backend

---

## 🏗️ Project Structure

```
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application
│   │   ├── database.py      # Database configuration
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   └── crud.py          # Database operations
│   ├── requirements.txt
│   ├── env.example
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API service layer
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ✨ Features Implemented

### ✅ Core Features

- [x] Create events with multiple time slots
- [x] Public event listing with slot availability
- [x] Booking interface with name/email validation
- [x] Timezone support using date-fns-tz
- [x] View bookings by email
- [x] Prevent double bookings
- [x] Slot availability management

### ✅ Technical Features

- [x] RESTful API with proper validation
- [x] Responsive React frontend with TailwindCSS
- [x] Real-time form validation and error handling
- [x] Loading states and user feedback
- [x] CORS configuration for development
- [x] Environment variable management

### 🎨 UI/UX Features

- [x] Modern, clean design with TailwindCSS
- [x] Responsive layout for mobile and desktop
- [x] Interactive booking modal
- [x] Toast notifications for user feedback
- [x] Loading spinners and disabled states
- [x] Intuitive navigation

---

## 🔧 API Endpoints

| Method | Endpoint                  | Description       |
| ------ | ------------------------- | ----------------- |
| GET    | `/`                       | API health check  |
| POST   | `/events`                 | Create new event  |
| GET    | `/events`                 | List all events   |
| GET    | `/events/{id}`            | Get event details |
| POST   | `/events/{id}/bookings`   | Book a time slot  |
| GET    | `/users/{email}/bookings` | Get user bookings |

---

## 🚀 Deployment

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from your `.env` file

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL` pointing to your backend URL

---

## 🧪 Testing

The application includes comprehensive error handling and validation:

- Form validation on both frontend and backend
- Database constraint validation
- API error responses with meaningful messages
- User-friendly error notifications

---

## 📝 Assumptions & Design Decisions

### Assumptions

1. **No Authentication**: Users can create events and book slots without authentication
2. **Email as Identifier**: Email is used to identify users for booking management
3. **UTC Storage**: All dates are stored in UTC and converted client-side
4. **Single Booking per Slot**: Users can only book one slot per event (can be extended)

### Design Decisions

1. **FastAPI + SQLAlchemy**: Modern Python stack with automatic API documentation
2. **React + Vite**: Fast development experience with modern React patterns
3. **TailwindCSS**: Utility-first CSS for rapid UI development
4. **date-fns-tz**: Lightweight timezone handling library
5. **UUID Primary Keys**: Scalable ID system for distributed environments

### Areas for Improvement

1. **Authentication**: Add user authentication and authorization
2. **Email Notifications**: Send confirmation emails for bookings
3. **Real-time Updates**: WebSocket integration for live booking updates
4. **Event Categories**: Add event categorization and filtering
5. **Recurring Events**: Support for recurring time slots
6. **Calendar Integration**: Google Calendar sync functionality
7. **Admin Panel**: Event management interface for creators

---

## 👊 Good Luck!

We're excited to see your submission. Think creatively, structure your code well, and showcase your ability to work across the stack. Happy coding!
