# Notes App Backend

A RESTful API backend for a notes application built with Node.js, Hapi.js, and PostgreSQL. This application provides user authentication, note management, and collaboration features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Flow](#architecture-flow)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Testing](#testing)

## ✨ Features

- **User Authentication**: JWT-based authentication system
- **Note Management**: CRUD operations for notes
- **Collaboration**: Share notes with other users
- **Data Validation**: Input validation using Joi
- **Error Handling**: Comprehensive error handling system
- **Database Migration**: Automated database schema management
- **Security**: Password hashing with bcrypt

## 🛠️ Tech Stack

### Core Technologies

- **Node.js** - JavaScript runtime
- **Hapi.js** - Web framework for building applications and services
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication

### Development Tools

- **ESLint** - Code linting with Airbnb configuration
- **Nodemon** - Development server with auto-restart
- **node-pg-migrate** - Database migration tool

### Libraries & Dependencies

- **@hapi/hapi** - Web framework
- **@hapi/jwt** - JWT authentication plugin
- **bcrypt** - Password hashing
- **joi** - Data validation
- **nanoid** - Unique ID generation
- **pg** - PostgreSQL client
- **dotenv** - Environment variable management
- **auto-bind** - Automatic method binding

## 📁 Project Structure

```
notes-app-back-end/
├── migrations/                    # Database migration files
│   ├── 1753107259282_create-table-notes.js
│   ├── 1753443338176_create-table-users.js
│   ├── 1753526242640_create-table-authentication.js
│   ├── 1753596245717_add-column-owner-to-table-notes.js
│   ├── 1753602585527_add-foreign-key-to-owner-column.js
│   └── 1753631903878_create-collaborations-table.js
├── src/
│   ├── api/                      # API modules
│   │   ├── authentications/      # Authentication endpoints
│   │   ├── collaborations/       # Collaboration endpoints
│   │   ├── notes/               # Notes endpoints
│   │   └── users/               # User management endpoints
│   ├── exceptions/               # Custom error classes
│   ├── service/                  # Business logic layer
│   │   ├── inMemory/            # In-memory service (for testing)
│   │   └── postgres/            # PostgreSQL service implementations
│   ├── tokenize/                # Token management
│   ├── utils/                    # Utility functions
│   ├── validator/                # Input validation schemas
│   └── server.js                # Main server file
├── package.json
├── package-lock.json
└── README.md
```

## 🔄 Architecture Flow

### Request Flow

1. **Client Request** → Server receives HTTP request
2. **Route Handler** → Routes request to appropriate handler
3. **Validation** → Validates request payload using Joi schemas
4. **Authentication** → Verifies JWT token (if required)
5. **Service Layer** → Business logic processing
6. **Database** → PostgreSQL operations
7. **Response** → Returns formatted JSON response

### Authentication Flow

1. **Login** → User provides credentials
2. **Validation** → Validates username/password
3. **Password Check** → Compares with hashed password
4. **Token Generation** → Creates JWT access token
5. **Response** → Returns access token

### Note Collaboration Flow

1. **Add Collaborator** → Owner adds user to note
2. **Verification** → Checks note ownership
3. **Database Update** → Adds collaboration record
4. **Access Control** → Collaborator can now access note

## 🗄️ Database Schema

### Tables

#### Users Table

```sql
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullname TEXT NOT NULL
);
```

#### Notes Table

```sql
CREATE TABLE notes (
    id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    owner VARCHAR(50) REFERENCES users(id)
);
```

#### Authentications Table

```sql
CREATE TABLE authentications (
    token TEXT NOT NULL
);
```

#### Collaborations Table

```sql
CREATE TABLE collaborations (
    id VARCHAR(50) PRIMARY KEY,
    note_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    UNIQUE(note_id, user_id),
    FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔌 API Endpoints

### Authentication

- `POST /authentications` - User login
- `DELETE /authentications` - User logout

### Users

- `POST /users` - User registration

### Notes

- `POST /notes` - Create new note
- `GET /notes` - Get all user notes
- `GET /notes/{id}` - Get specific note
- `PUT /notes/{id}` - Update note
- `DELETE /notes/{id}` - Delete note

### Collaborations

- `POST /collaborations` - Add collaborator to note
- `DELETE /collaborations` - Remove collaborator from note

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd notes-app-back-end
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up PostgreSQL database**

   ```bash
   # Create database
   createdb notes_app_db
   ```

5. **Run database migrations**
   ```bash
   npm run migrate up
   ```

## 💻 Usage

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run start:prod
```

### Linting

```bash
npm run lint
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
HOST=localhost

# Database Configuration
PGUSER=your_username
PGHOST=localhost
PGPASSWORD=your_password
PGDATABASE=notes_app_db
PGPORT=5432

# JWT Configuration
ACCESS_TOKEN_KEY=your_access_token_key
ACCESS_TOKEN_AGE=1800

# Database URL (for migrations)
DATABASE_URL=postgres://username:password@localhost:5432/notes_app_db
```

## 🧪 Testing

The project includes Postman collection for API testing:

- `Notes API Test.postman_collection.json` - API test collection
- `Notes API Test.postman_environment.json` - Environment variables

### Manual Testing

1. Import the Postman collection
2. Set up environment variables in Postman
3. Run the test collection

## 📝 API Response Format

### Success Response

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "status": "fail",
  "message": "Error description"
}
```

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with JSON Web Tokens
- **Input Validation**: Comprehensive validation using Joi schemas
- **CORS Support**: Configured for cross-origin requests
- **Error Handling**: Proper error responses without exposing sensitive information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**Note**: This is a backend API project. You'll need a frontend application to interact with these endpoints.
