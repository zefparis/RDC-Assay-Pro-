# 🔗 Frontend-Backend Connection Guide

## ✅ **Connection Completed**

Your Next.js frontend is now **fully connected** to the Express.js backend! Here's what has been configured:

## 🔧 **Changes Made**

### **1. API Client Updated** (`src/lib/api.ts`)
- ✅ **Replaced mock API** with real backend calls
- ✅ **Added authentication** with JWT tokens
- ✅ **Data mapping** between frontend/backend formats
- ✅ **Error handling** for network requests
- ✅ **Token management** in localStorage

### **2. Environment Configuration** (`.env.local`)
- ✅ **API URL** set to `http://localhost:5000/api/v1`
- ✅ **Ready for production** deployment

### **3. Data Format Mapping**
- ✅ **Status mapping**: `RECEIVED` ↔ `Received`
- ✅ **Mineral mapping**: `CU` ↔ `Cu`
- ✅ **Unit mapping**: `PERCENT` ↔ `%`

## 🚀 **How to Start Both Services**

### **1. Start the Backend**
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```
Backend will run on: **http://localhost:5000**

### **2. Start the Frontend**
```bash
cd ../  # Back to root directory
npm run dev
```
Frontend will run on: **http://localhost:3000**

## 🔑 **Test Credentials**

Use these accounts to test the connection:

- **Admin**: `admin@rdcassay.africa` / `admin123`
- **Analyst**: `analyst@rdcassay.africa` / `analyst123`  
- **Client**: `client@mining-corp.cd` / `client123`

## 📡 **API Endpoints Connected**

### **Authentication**
- ✅ `POST /auth/login` - User login
- ✅ `POST /auth/logout` - User logout
- ✅ `GET /auth/profile` - Get user profile

### **Samples**
- ✅ `GET /samples` - Search samples with pagination
- ✅ `GET /samples/code/{code}` - Get sample by code
- ✅ `POST /samples` - Create new sample
- ✅ `PUT /samples/{id}` - Update sample

### **Reports**
- ✅ `GET /reports` - Search reports with pagination
- ✅ `GET /reports/code/{code}` - Get report by code

### **Dashboard**
- ✅ `GET /dashboard/stats` - Get dashboard statistics

## 🔄 **Data Flow**

1. **Frontend** sends request to backend API
2. **JWT token** automatically included in headers
3. **Backend** processes request and returns data
4. **Frontend** maps backend data to UI format
5. **UI** updates with real data

## 🛡️ **Security Features**

- ✅ **JWT Authentication** with access/refresh tokens
- ✅ **Automatic token management**
- ✅ **Secure API requests** with Authorization headers
- ✅ **Error handling** for expired tokens

## 🎯 **What Works Now**

### **✅ Fully Functional**
- **Login/Logout** with real authentication
- **Sample creation** and tracking
- **Sample search** and filtering
- **Dashboard statistics** from real data
- **Report viewing** and verification
- **Timeline tracking** for samples

### **🔄 Automatic Features**
- **Token refresh** when needed
- **Data synchronization** between frontend/backend
- **Real-time updates** from database
- **Error handling** and user feedback

## 🚨 **Important Notes**

### **CORS Configuration**
The backend is configured to accept requests from `http://localhost:3000` (your frontend).

### **Database**
The backend uses PostgreSQL with sample data already seeded.

### **File Uploads**
File upload endpoints are ready but may need additional frontend integration.

## 🎉 **Success!**

Your **RDC Assay Pro** platform now has:

- ✅ **Professional backend API** with Express.js + TypeScript
- ✅ **Modern frontend** with Next.js + React
- ✅ **Real database** with PostgreSQL + Prisma
- ✅ **Full authentication** with JWT tokens
- ✅ **Complete data flow** between frontend and backend
- ✅ **Production-ready** architecture

**🇨🇩 Ready to revolutionize mineral assay certification in the DRC!**
