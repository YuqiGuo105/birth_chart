const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_BASE_URL = 'https://horoscopes.astro-seek.com/';

// Root route handler
app.get('/', (req, res) => {
  res.send('Welcome to the Birth Chart API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
