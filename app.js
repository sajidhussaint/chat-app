const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const app = express();

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "front-end", "build")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const corsOptions = { origin: "http://localhost:3000" };
app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define the Mongoose schema
const messageSchema = new mongoose.Schema({
  message: {
    type: String,
  },
});

// Create a Mongoose model
const Message = mongoose.model("Message", messageSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "build", "index.html"));
});

app.get("/api/messages", (req, res) => {
  Message.find({})
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((error) => {
      console.error("Error retrieving messages:", error);
      res.status(500).json({ error: "Failed to retrieve messages" });
    });
});

app.post("/api/add-message", (req, res) => {
  const message = req.body.message;

  Message.create({ message: message })
    .then(() => {
      res.status(200).json({ message: "Message created" });
    })
    .catch((error) => {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    });
});

app.post("/api/delete-message", (req, res) => {
  const id = req.body.id;
  Message.findByIdAndDelete(id)
    .then(() => {
      res.status(200).json({ message: "Message deleted" });
    })
    .catch((error) => {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Failed to delete message" });
    });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running on http://localhost:3000");
});
