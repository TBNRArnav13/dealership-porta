# Best Cars Dealership Portal

A full-stack web application that allows customers to browse national car dealerships by state and read/write reviews.

## Tech Stack

- **Backend**: Django 6 + Django REST Framework
- **Microservice**: Node.js + Express + MongoDB (with in-memory fallback)
- **Frontend**: React 18 + Vite + Bootstrap 5
- **CI/CD**: GitHub Actions
- **Database**: SQLite (Django) + MongoDB (reviews/dealers)

## Project Structure

```
dealership-portal/
├── server/                  # Django backend
│   ├── djangoproj/          # Django settings & URLs
│   ├── dealerships/         # Main app (models, views, templates, tests)
│   └── database/            # Node.js microservice (dealers + reviews)
├── client/                  # React frontend (Vite)
│   └── src/components/      # All React components
├── .github/workflows/       # GitHub Actions CI
└── README.md
```

## Setup & Run

### 1. Django Backend

```bash
cd server
pip install django djangorestframework django-cors-headers requests pymongo
python manage.py migrate
python manage.py seed_cars
python manage.py createsuperuser   # or use root / root1234
python manage.py runserver
```

### 2. Node.js Microservice

```bash
cd server/database
npm install
node index.js        # runs on port 3030, falls back to in-memory if no MongoDB
```

### 3. React Frontend

```bash
cd client
npm install
npm run dev          # dev server on port 5173 (proxies API to Django)
```

## Admin Access

- URL: `http://localhost:8000/admin/`
- Username: `root`
- Password: `root1234`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login/` | Login |
| GET | `/api/logout/` | Logout |
| POST | `/api/register/` | Register |
| GET | `/api/get_dealers/` | All dealers |
| GET | `/api/get_dealers/<state>/` | Dealers by state |
| GET | `/api/get_dealer/<id>/` | Single dealer |
| GET | `/api/get_reviews/<id>/` | Reviews for dealer |
| POST | `/api/add_review/` | Add review (auth required) |
| GET | `/api/get_cars/` | Car makes |
| GET | `/api/get_car_models/` | Car models |
| GET | `/api/analyze_review/?text=...` | Sentiment analysis |

## Features

- Browse dealerships with state filter
- Customer reviews with sentiment analysis
- User registration and login
- Admin panel for managing car makes/models
- Responsive Bootstrap 5 UI
- GitHub Actions CI pipeline
