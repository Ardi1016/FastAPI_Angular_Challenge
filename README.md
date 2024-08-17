# Course Management System

This project is a Course Management System built with FastAPI (backend) and Angular (frontend). It allows users to manage and search for courses across various universities.

## Features

- View a list of courses with pagination
- Search courses by various criteria (university, city, country, course name, description)
- Add, edit, and delete courses
- Responsive design for desktop and mobile devices

## Tech Stack

- Backend: FastAPI, MongoDB
- Frontend: Angular, Angular Material
- Data Source: Mock data from Mockaroo API

## Prerequisites

- Python 3.12+
- Node.js 20+
- npm 10+
- MongoDB Atlas account

## Setup

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/Ardi1016/FastAPI_Angular_Challenge
   cd FastAPI_Angular_Challenge/backend
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with the following content:
   ```
   MONGODB_URL=mongodb+srv://username:password@course.r3sfk.mongodb.net/
   DATABASE_NAME=courses_db
   COLLECTION_NAME=courses
   CSV_URL=****
   ```

   Note: Make sure to keep your MongoDB credentials and API keys secure.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ../frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

## Running the Application

### Running the Backend

1. From the backend directory, run:
   ```
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Running the Frontend

1. From the frontend directory, run:
   ```
   ng serve
   ```
   The application will be available at `http://localhost:4200`.

## API Documentation

Once the backend is running, you can access the API documentation at `http://localhost:8000/docs`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
