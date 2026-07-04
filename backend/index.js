require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect Database
connectDB();

// Security
app.use(helmet());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100
});

app.use(limiter);

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart Tourist Safety Backend Running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});