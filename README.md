# Southern Province Road Development Authority - Employee Management & Water Supply Estimations

This project is built for the Southern Province Road Development Authority, focusing on employee management and water supply estimations for road development. The system is developed with a modern tech stack using **React** for the frontend, **Laravel** for the backend, and **MySQL** as the database.

## Features

- **Employee Management**  
  Manage employee data for better project oversight.

- **Water Supply Estimation**  
  Efficiently estimate the required water supply for road development projects.

- **User Roles**  
  - Chief Engineer
  - Accountant
  - Assistant Engineer

## Tech Stack

- **Frontend**: React.js
- **Backend**: Laravel (PHP)
- **Database**: MySQL
- **Authentication**: JWT-based authentication

## Installation

### Prerequisites

- **Node.js** (v14.x or later)
- **Composer** (for Laravel dependencies)
- **MySQL** (v8.x or later)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kavindi-Rajasingha27/RDA_SOUTHERN.git
   cd RDA_SOUTHERN

2. **Install frontend dependencies**
   ```bash
    cd frontend
    npm install
    npm run dev

3. **Install backend dependencies**
   ```bash
    cd ../backend
    composer install
    php artisan migrate
    php artisan db:seed
    php artisan serve
   
