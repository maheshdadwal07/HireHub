require("dotenv").config();
const app = require("./app");
const db = require("./models");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {

    await db.sequelize.sync();

    console.log("Database synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

startServer();
