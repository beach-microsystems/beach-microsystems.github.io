const express = require('express');
const cors = require('cors'); // Add this line to enable CORS
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON requests

// Securely stored hashed password (SHA-256 of "heartbreak")
const correctPasswordHash = '6043ad2514df196f795aa58aadc5da941a795fe182a63e8301ece0985aed7c4e';

// Endpoint to validate the password
app.post('/validate-password', (req, res) => {
  const crypto = require('crypto');

  // Get the entered password from the request body
  const enteredPassword = req.body.password;

  // Hash the entered password
  const enteredHash = crypto.createHash('sha256').update(enteredPassword).digest('hex');

  // Compare the hash
  if (enteredHash === correctPasswordHash) {
    res.status(200).json({ success: true }); // Password is correct
  } else {
    res.status(401).json({ success: false }); // Incorrect password
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
