require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");

const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ======================
// Connect Database
// ======================
connectDB();

// ======================
// Middleware
// ======================
app.use(helmet());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(morgan("dev"));
app.use(express.json());

// ======================
// Routes
// ======================
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Tourist Safety Backend Running",
  });
});

// ======================
// Create Default Admin
// ======================
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      console.log("Default Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
    });

    console.log("====================================");
    console.log("Default Admin Created");
    console.log("Email    : admin@gmail.com");
    console.log("Password : admin123");
    console.log("====================================");
  } catch (err) {
    console.error("Error creating default admin:", err.message);
  }
};

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  await createDefaultAdmin();
});