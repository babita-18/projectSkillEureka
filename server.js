// server.js
require('dotenv').config();
const express = require('express');
const app     = express();

// … your middleware & routes here …

// pick up PORT from env or default to 5000
const PORT = process.env.PORT || 5000;

// pass a Number, not a string with “=” or “;”
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
