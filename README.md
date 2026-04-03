# TechBlog Backend (Spring Boot)

##  Overview
This is a secure backend system built using Spring Boot. It provides authentication, authorization, OTP verification, and file upload functionality.

---

## Features

### Authentication
- User Registration
- Secure Login with JWT
- Password Encryption (BCrypt)

###  OTP Verification
- 6-digit OTP generation
- OTP expiry (5 minutes)
- Email verification system

### Security
- JWT-based authentication
- Protected APIs
- Rate limiting (login)

###  File Upload
- Upload profile images
- Store files in server
- Serve images via URL

###  Database
- MySQL integration
- JPA/Hibernate ORM

---

##  Architecture

controller → service → repository → database

---

##  API Endpoints

### Auth APIs
- POST `/api/users/register`
- POST `/api/users/login`
- POST `/api/users/verify`

### Protected APIs
- GET `/api/users/test`

### File Upload
- POST `/api/users/upload`

---

##  JWT Usage

Authorization: Bearer <token>

---

##  Tech Stack

- Java
- Spring Boot
- Spring Security
- JWT
- MySQL
- Maven

---

##  Future Improvements

- Email OTP sending
- Resend OTP API
- Global exception handling improvements
- Frontend integration (React)

---

## Author
Aakash Prasad Chaurasiya




















