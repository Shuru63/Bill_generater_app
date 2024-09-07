# BillGeneration Application

## Overview

The BillGeneration application is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) for generating and managing bills. This application allows users to create, view, and manage bills with features such as dynamic data filling, PDF generation, and more.

## Features

- **User Authentication**: Secure login and registration.
- **Bill Management**: Create, view, and edit bills.
- **PDF Generation**: Generate bills in PDF format using Puppeteer.
- **Dynamic Data Filling**: Embed invoice data dynamically into PDFs.
- **Responsive Design**: Mobile-friendly and responsive user interface.
- **Error Handling**: Comprehensive error handling for data validation and PDF generation.

## Technologies Used

- **Frontend**: React.js, Redux (optional), Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **PDF Generation**: Puppeteer
- **Environment Configuration**: .env files for secure configuration

## Installation

### Prerequisites

- Node.js (>=14.x)
- npm or yarn
- MongoDB

### Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/billgeneration.git
   cd billgeneration
   cd backend
- npm install

- cd ../frontend
- npm install


- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret_key
= Run the Application

- Start the backend server:

- cd backend
- npm start

- cd ../frontend
- npm start
