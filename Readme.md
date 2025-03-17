# 🚀 Job Finder - Backend (Node.js + Express + PostgreSQL)

This is the backend service for **Job Finder**, a web application that allows users to search, save, and manage job applications in Germany. The backend is built with **Node.js, Express, and PostgreSQL**, providing **secure authentication, job data management, and API integration** with the **Arbeitnow Job API**.

---

## 🔹 Features  
✅ **REST API** for job management  
✅ **User authentication with JWT** (Login & Register)  
✅ **Secure password encryption using Bcrypt**  
✅ **CRUD operations for saved jobs**  
✅ **Integration with the Arbeitnow Job API**  
✅ **PostgreSQL database for persistence**  

---

## 🛠 Tech Stack  

- **Node.js** + **Express.js**  
- **PostgreSQL** (Database)  
- **JWT Authentication**  
- **Bcrypt** (Password hashing)  
- **Axios** (Fetching jobs from external API)  
- **Dotenv** (Environment variables management)  

---

## 🔧 Installation & Setup  

### **1️⃣ Clone the Repository**  


git clone https://github.com/your-username/job-finder-backend.git
cd job-finder-backend

### **2️⃣ Install Dependencies**

npm install

### **3️⃣ Configure Environment Variables**

Create a .env file in the root directory and add your PostgreSQL database credentials:


DATABASE_URL=postgresql://username:password@localhost:5432/jobsearchdb
PORT=5000
JWT_SECRET=your_secret_key

### **4️⃣ Start the Backend Server**


npm run dev
The server will start on http://localhost:5000.

**🔗 API Endpoints**

🔹 Authentication

POST /api/auth/register → Register a new user
POST /api/auth/login → Login and receive a JWT token

🔹 Job Management

GET /api/jobs/external → Fetch jobs from Arbeitnow API with filters
POST /api/jobs/save → Save a job to the database
GET /api/jobs/saved → Retrieve saved jobs
DELETE /api/jobs/delete/:id → Delete a saved job

**🚀 Deployment**

To deploy the backend, you can use:

Render.com or Railway.app (for hosting the API)
Supabase or ElephantSQL (for cloud PostgreSQL database)

### **Contributions are welcome! Fork the project and submit a PR.

📩 Contact: aryhauffe@gmail.com
🌐 Website: aryhauffe.com