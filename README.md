# Space Explorer: A Web Application for Exploring NASA's Image Archive

## Introduction

Space Explorer is a sophisticated, full-stack web application designed for exploring the vast and fascinating world of space imagery. It provides a seamless, responsive, and engaging user experience for searching, viewing, and discovering stunning images from NASA's extensive archives. This project showcases a modern, robust, and scalable architecture, making it an excellent demonstration of advanced web development skills.

## Features

- **Intuitive Search:** A powerful, debounced search bar allows users to quickly and efficiently find images.
- **Dynamic Image Gallery:** A beautiful, responsive image gallery displays search results and initial images in a clean, scroll-free grid.
- **Detailed Image Modal:** Clicking on an image opens a detailed modal view with a high-resolution image and comprehensive metadata.
- **Search History:** A persistent search history allows users to easily revisit previous searches.
- **Robust Error Handling:** The application gracefully handles API errors and provides clear feedback to the user.
- **CORS and Retry Logic:** A resilient API client with automatic retries and a properly configured backend ensure a smooth user experience.

## Technical Stack

### Backend

- **Framework:** FastAPI
- **Language:** Python 3
- **Server:** Uvicorn
- **Key Libraries:**
  - Pydantic for data validation
  - aiofiles for asynchronous file operations
  - httpx for making asynchronous requests

### Frontend

- **Framework:** React 19 with Vite
- **Language:** TypeScript
- **Styling:** SCSS Modules
- **Key Libraries:**
  - @tanstack/react-query for data fetching and state management
  - react-toastify for notifications
  - react-window for efficient rendering of large lists (in the search history)

## Architecture

The project is structured as a monorepo with a clear separation between the `client` and `server` directories.

- **`server/`**: The FastAPI backend, which is responsible for serving the API, fetching data from external sources, and managing the search history.
- **`client/`**: The React frontend, which provides the user interface and interacts with the backend API.

This separation of concerns allows for independent development and deployment of the frontend and backend, which is a common practice in modern web development.

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Set up the backend:**
    ```bash
    cd server
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

3.  **Set up the frontend:**
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd server
    uvicorn app:app --reload
    ```
    The server will be running at `http://localhost:8000`.

2.  **Start the frontend development server:**
    ```bash
    cd ../client
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

## API Documentation

The backend API is documented using FastAPI's automatic Swagger and ReDoc documentation.

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Key Endpoints

- **`GET /api/v1/sources`**: Fetches the initial set of images to display in the gallery.
- **`POST /api/v1/search`**: Performs a search for images based on a query.
- **`GET /api/v1/history`**: Retrieves the user's search history.
- **`DELETE /api/v1/history/{search_id}`**: Deletes a specific entry from the search history.

## Future Improvements

- **User Authentication:** Implement user accounts to allow for personalized search history and saved images.
- **Advanced Filtering:** Add more advanced filtering options, such as filtering by date, camera, or mission.
- **Pagination:** Implement pagination for the main image gallery to improve performance with very large datasets.
- **Testing:** Add a comprehensive suite of unit and integration tests for both the frontend and backend.

## Conclusion

Space Explorer is a robust and feature-rich application that demonstrates a strong understanding of modern web development principles and practices. Its clean architecture, thoughtful user experience, and solid technical foundation make it an excellent project for showcasing advanced skills in a professional setting.
