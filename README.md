# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


Carbonetrix Project Documentation
This documentation will guide you on how to set up and run the Carbonetrix project, 
which is built using React (Frontend) and Django REST Framework (Backend). Follow 
these steps to get the project up and running on your local machine.

Admin site

https://carbonetrix-todo.netlify.app/admin-login

username: aadmin@gmail.com
password: aadmin

Prerequisites
Make sure you have the following installed on your system:

Node.js (v16 or later) and npm – Download Here https://nodejs.org/
Python (v3.8 or later) – Download Here https://www.python.org/downloads/
Pip (Python package manager)
Mysql (Optional, if using a Mysql database)


 Getting Started
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/Lilsadiq8345/Todo.git
cd Todo
⚙️ Backend Setup (Django)
1. Navigate to the Backend Directory
bash
Copy
Edit
cd backend
2. Create a Virtual Environment
bash
Copy
Edit
python -m venv venv
Activate the virtual environment:

On Windows:
bash
Copy
Edit
.\venv\Scripts\activate
On MacOS/Linux:
bash
Copy
Edit
source venv/bin/activate
3. Install Dependencies
bash
Copy
Edit
pip install -r requirements.txt
4. Environment Configuration
Create a .env file in the backend directory and add the following:

5. Run Migrations
bash
Copy
Edit
python manage.py makemigrations
python manage.py migrate
6. Create Superuser
bash
Copy
Edit
python manage.py createsuperuser
7. Run the Django Server
bash
Copy
Edit
python manage.py runserver
The Django API will be running at: http://localhost:8000

Frontend Setup (React)
1. Navigate to the Frontend Directory
bash
Copy
Edit
cd ../frontend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Environment Configuration
Create a .env file in the frontend directory and add the following:

env
Copy
Edit
REACT_APP_API_URL=http://localhost:8000/api
4. Run the React Development Server
bash
Copy
Edit
npm start
The React app will be running at: http://localhost:3000

Connecting Frontend and Backend
Ensure both the Django and React servers are running.
Make sure CORS settings in Django allow requests from http://localhost:3000.
The frontend will use REACT_APP_API_URL to make API calls to the backend.

Key Features
User Registration and Authentication (JWT)
Task Management:
Create, Edit, Delete Tasks
Mark Tasks as Completed
Real-Time Search and Filter by Status
Responsive UI for Mobile, Tablet, and Desktop
Sidebar Navigation with Expand/Collapse feature
Dashboard with Task Overview

Tech Stack
Frontend:
React.js (Vite)
React Router
Zustand (State Management)
Axios (API Requests)
Tailwind CSS (UI Styling)
Backend:
Django REST Framework (API)
Django Simple JWT (Authentication)
PostgreSQL (Database, Optional)
Django Filters (Search and Filtering)
