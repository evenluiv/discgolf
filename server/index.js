const express = require('express');
const pool = require('./db');

const app = express();

const PORT = process.env.PORT || 9000;

//Here you can add your routes
//Here's an example
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
    console.log(`Server listening on the port ${PORT}`);
})