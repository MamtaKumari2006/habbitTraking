require("dotenv").config();
const cors = require('cors');
const app = require("./src/app");
const connectDB = require("./src/db/db");

app.use(cors());
connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});