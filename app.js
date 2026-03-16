const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const companyRoutes = require("./routes/company.routes");
const jobRoutes = require("./routes/job.routes");

app.use(morgan("dev"));  //middleware for logging HTTP requests in development mode

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.json({ message: "HireHub API Running" });
});

module.exports = app;