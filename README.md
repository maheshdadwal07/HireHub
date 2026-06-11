# HireHub

![HireHub Preview](./screenshots/homepage.png)
Live Demo: https://www.hire-hub.dev/

HireHub is a full-stack web application designed to connect job seekers with recruiters. It provides a platform for companies to post job opportunities and for professionals to discover and apply for roles. The system features role-based access control, ensuring a secure and tailored experience for both applicants and employers.

Built with a modern JavaScript stack, HireHub is designed for scalability and performance. It utilizes a relational database for robust data integrity and a dedicated cloud storage solution for efficient media management.

## Key Features

- **Role-Based Workflows**: Distinct interfaces and permissions for Job Seekers and Recruiters.
- **Company Management**: Recruiters can create and manage company profiles, including verified employer badges and team members.
- **Job Board & Applications**: Comprehensive job posting system with advanced filtering (location, work type, experience level) and a streamlined application process.
- **Profile Management**: Job seekers can upload resumes (PDF/DOC) and profile images, and track their application statuses.
- **Secure Authentication**: JWT-based authentication with secure password hashing.

## Core Functionality

### For Job Seekers
- Create and manage profiles
- Upload resumes and profile images
- Browse and apply for jobs
- Track application status

### For Recruiters
- Create and manage companies
- Post and update jobs
- Review applicants
- Manage company team members

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js 
- **ORM**: Sequelize 
- **Database**: PostgreSQL (Hosted on Neon)
- **Cloud Storage**: Cloudinary (For profile images, company logos, and resumes)
- **Authentication**: JSON Web Tokens (JWT), bcryptjs

## System Architecture

- React frontend communicates with the backend through REST APIs.
- Express.js handles authentication, business logic, and file uploads.
- Sequelize ORM manages PostgreSQL database operations.
- Cloudinary stores uploaded assets such as resumes, profile images, and company logos.

## Environment Variables

To run this project, you will need to add the following environment variables to your respective `.env` files.

### Backend (`backend/.env`)
```env
# Server Configuration
PORT=5001
JWT_SECRET=your_jwt_secret_key_here

# PostgreSQL Database Connection
DATABASE_URL=postgres://username:password@hostname:5432/dbname?sslmode=require

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

## Local Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/maheshdadwal07/HireHub.git
   cd HireHub
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**
   Create a `.env` file in both the `backend` and `frontend` directories using the templates provided in the section above.

5. **Run the Application**
   Open two terminal windows:
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

## API Overview

The REST API is structured into the following primary modules:

- `/api/auth`: User registration, login, and session management.
- `/api/users`: Profile viewing and updating (including resume/photo uploads).
- `/api/companies`: Creating companies, updating details, and fetching company directories.
- `/api/jobs`: Posting jobs, searching, filtering, and fetching job details.
- `/api/applications`: Submitting applications and fetching application status.
- `/api/company-members`: Managing recruiter access to specific company profiles.

## Deployment

The application supports deployment across common cloud platforms.

- Frontend: Vercel, Netlify, Render
- Backend: Render, Railway
- Database: Neon PostgreSQL
- File Storage: Cloudinary

## Project Structure

```text
HireHub/
├── backend/
│   ├── config/         # Database and Cloudinary configurations
│   ├── controllers/    # API endpoint logic
│   ├── middleware/     # Auth, error handling, and upload middlewares
│   ├── models/         # Sequelize schemas
│   ├── routes/         # Express route definitions
│   └── server.js       # Entry point
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI elements
    │   ├── pages/      # Route-level components
    │   └── services/   # API integration (Axios calls)
    └── vite.config.js  # Vite bundler configuration
```

## Future Improvements

- Real-time messaging between recruiters and applicants
- Email notifications for application updates
- Analytics and reporting dashboard

## License

This project is licensed under the ISC License.
