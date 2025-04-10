# User Management API

A comprehensive RESTful API for user management built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Complete JWT-based authentication system
- **User Management**: Create, read, update, and delete user profiles
- **User Details**: Store and manage detailed user information
- **Email Verification**: OTP-based email verification using Nodemailer
- **Data Validation**: Request validation for data integrity
- **Error Handling**: Comprehensive error handling middleware
- **Security**: Password hashing, JWT authentication, and more

## 🛠️ Technologies

- **Node.js**: JavaScript runtime for server-side code
- **Express.js**: Web framework for building the API
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT (jsonwebtoken)**: For secure authentication
- **Nodemailer**: For sending verification emails
- **bcrypt**: For password hashing
- **cookie-parser**: For handling cookies
- **cors**: For handling Cross-Origin Resource Sharing

🚀 API Endpoints
🔐 Auth Routes (/api/v1/auth)
Method	Endpoint	Description	Access
POST	/signup	Register a new user	Public
POST	/login	Login a user	Public
POST	/resend-otp	Resend OTP to email	Public
POST	/verify-otp	Verify OTP for email verification	Public
POST	/forgot-password	Send OTP for password reset	Public
POST	/reset-password	Reset password using OTP	Public
POST	/logout	Logout and blacklist token	Protected
DELETE	/delete/:userId	Delete user and all their tasks	Protected
✅ Task Routes (/api/v1/task)
All task routes are protected and require a valid JWT token.

Method	Endpoint	Description
GET	/	Get all tasks (supports status + pagination)
GET	/:id	Get task by ID
POST	/	Create a new task
PUT	/:id	Update a task by ID
DELETE	/:id	Delete a task by ID

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/user-management-api.git
   cd user-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a .env file with the following variables**
   ```
   PORT=3000
   MONGODB_URI= Add your mongodb URI here
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Start the server**
   ```bash
   npm start
   npm run dev  #to run with nodemon
   ```

## 🧪 Testing

Run the test suite with:
```bash
npm test
```

## 📝 Project Structure

```[taskmanager.postman_collection.json](https://github.com/user-attachments/files/19680375/taskmanager.postman_collection.json)

src
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middlewares/        # Custom middleware functions
├── models/             # Mongoose models
├── routes/             # Route definitions
├── utils/              # important utils
├── validators/         # vadilation logic
├── index.js              # Express app setup
└── README.md           # Project documentation
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Email verification with OTP
- MongoDB sanitization against NoSQL injection
- CORS protection

- 
[taskmanager.postman_collection.json](https://github.com/user-attachments/files/19680409/taskmanager.postman_collection.json)
