# Praja Connect

Praja Connect is a full-stack citizen grievance management platform designed to bridge the gap between citizens and local authorities. The system enables citizens to report civic issues, track complaint status, and receive updates, while administrators can efficiently manage, monitor, and resolve complaints through a centralized dashboard.

---

## Problem Statement

Citizens often face difficulties reporting local civic issues such as potholes, drainage problems, water supply disruptions, streetlight failures, and garbage collection issues. Traditional complaint systems lack transparency and proper tracking mechanisms.

Praja Connect provides a digital solution that allows citizens to submit complaints online and track their resolution process in real time.

---

## Features

### Citizen Features

* User Registration and Login
* Secure JWT Authentication
* Submit Complaints
* Upload Complaint Images
* Complaint Categories
* Priority Selection (Low, Medium, High, Emergency)
* Address Information

  * Colony Name
  * Street Name
  * Ward Number
  * Landmark
  * Pincode
* Live Location Coordinates
* Complaint Tracking
* View Complaint History
* Real-Time Status Updates

### Admin Features

* Secure Admin Login
* View All Complaints
* Search and Filter Complaints
* Complaint Details Modal
* View Uploaded Evidence Images
* Update Complaint Status
* Mark Complaints as:

  * Pending
  * In Progress
  * Resolved
  * Rejected
* Complaint Analytics Dashboard
* Ward-wise Analysis
* Category-wise Analysis
* Emergency Complaint Monitoring

---

## Complaint Categories

* Potholes
* Drainage Overflow
* Street Light Not Working
* Water Supply Issues
* Garbage Collection Issues
* Road Damage
* Public Sanitation Issues
* Other Civic Problems

---

## Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Multer (File Uploads)
* Bcrypt.js

---

## Database

MongoDB Atlas is used as the cloud database to store:

* User Information
* Complaint Details
* Complaint Status
* Location Information
* Uploaded Image References

---

## Project Structure

```text
praja-connect/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── uploads/
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── services/
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Codex-39/praja-connect.git
cd praja-connect
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Future Enhancements

* SMS Notifications
* Email Notifications
* Complaint Receipt Generation
* Mobile Application
* Government Department Integration
* GIS-Based Complaint Mapping
* Advanced Analytics

---

## Project Objective

The objective of Praja Connect is to provide a transparent, efficient, and user-friendly grievance redressal system that empowers citizens to report civic issues and enables authorities to resolve them effectively.

---

## Authors

Developed as a Community Service Project by a Computer Science Engineering Team.

## License

This project is developed for educational and academic purposes.
