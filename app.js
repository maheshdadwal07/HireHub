const express = require("express");
const morgan = require("morgan");

const app = express();

// 🔹 Middlewares
app.use(express.json());
app.use(morgan("dev"));

// 🔹 Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const applicationRoutes = require("./routes/application.routes");
const companyRoutes = require("./routes/company.routes");
const jobRoutes = require("./routes/job.routes");
const adminRoutes = require("./routes/admin.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

// 🔹 Root
app.get("/", (req, res) => {
  res.json({ message: "HireHub API Running" });
});

// 🔹 Error Handler (ALWAYS LAST)
const errorHandler = require("./middleware/error.middleware");
app.use(errorHandler);

module.exports = app;