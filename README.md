## 🚀 Implementation

This repository contains a complete implementation of the BookMySlot application. Here's how to get started:

### Prerequisites

- Python 3.8+
- React + TailwindCss
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

## ⚡️ Vercel Deployment Note

When deploying to Vercel, make sure to set the **Root Directory** to `frontend` during project import. This ensures Vercel uses the correct build and output settings for your React app.

- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:** `VITE_API_URL` (your backend URL)

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
