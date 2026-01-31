require("dotenv").config();

console.log("DEBUG MONGO_URI:", process.env.MONGO_URI);

const connectDB = require("./src/config/db");
const app = require("./src/app");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
