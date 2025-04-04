[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# CU Reimbursement Portal

A comprehensive web application designed to streamline and automate the reimbursement process for Chandigarh University students participating in competitions and events. This platform provides an efficient way for students to submit reimbursement requests and for administrators to manage these requests.

## 🌟 Features

### For Students
- **Easy Request Submission**: Submit reimbursement requests with detailed information about competitions and events
- **Document Upload**: Securely upload supporting documents (tickets, certificates, etc.)
- **Real-time Status Tracking**: Track the status of submitted requests
- **User-friendly Interface**: Modern and intuitive UI for seamless experience
- **Form Validation**: Built-in validation to ensure accurate information submission

### For Administrators
- **Secure Admin Portal**: Dedicated admin interface with authentication
- **Request Management**: View, approve, or reject reimbursement requests
- **Document Verification**: Easy access to uploaded documents for verification
- **Status Updates**: Update request status and provide feedback
- **Dashboard Overview**: Comprehensive view of all pending and processed requests

## 🛠️ Technology Stack

### Frontend
- **React.js**: Modern UI library for building user interfaces
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework for modern web applications
- **Axios**: Promise-based HTTP client for API requests
- **React Router**: Navigation and routing
- **React Hot Toast**: Elegant notifications
- **Lucide React**: Beautiful icons
- **React Icons**: Comprehensive icon library

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling tool
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **CORS**: Cross-Origin Resource Sharing support

### Deployment
- **Frontend**: Vercel (https://cu-rp-main.vercel.app)
- **Backend**: Render (https://cu-reimbursement-backend.onrender.com)
- **Database**: MongoDB Atlas

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/CU_RP.git
cd CU_RP
```

2. Install dependencies for frontend
```bash
# In the root directory
npm install
```

3. Install dependencies for backend
```bash
cd backend
npm install
```

4. Create .env file in the backend directory with the following variables
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Create .env file in the root directory for frontend
```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm start
```

2. Start the frontend development server
```bash
# In the root directory
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
CU_RP/
├── src/                    # Frontend source files
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── config/           # Configuration files
│   └── services/         # API services
├── backend/              # Backend source files
│   ├── routes/          # API routes
│   ├── models/          # MongoDB models
│   ├── middleware/      # Custom middleware
│   └── uploads/         # File uploads directory
└── public/              # Static files
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Secure file upload handling
- Input validation and sanitization
- Error handling middleware
- CORS configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Shivansh Tiwari- shivanshtiwari98958@gmail.com

## 🙏 Acknowledgments

- Chandigarh University for the opportunity to develop this solution
- All contributors who have helped to improve this project
- Open source community for the amazing tools and libraries

## 📞 Support

For support, email shivanshtiwari98958@gmail.com or create an issue in the repository.
