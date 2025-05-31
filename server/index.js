const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leave');
const User = require('./models/User');       // Import User model
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();

// Connect to MongoDB and then seed admin if not exists
const startServer = async () => {
  try {
    await connectDB();

    // Check if admin exists, if not create one
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const adminUser = new User({
        username: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        employeeId: 'ADMIN001',
        department: 'Management',
      });

      await adminUser.save();
    //   console.log('Admin user created: admin@example.com / admin123');
    } else {
      console.log('Admin user already exists.');
    }

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/leave', leaveRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
