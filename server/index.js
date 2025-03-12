const express = require('express');
const pool = require('./db');
const cors = require('cors');

const PORT = process.env.PORT || 9000;

const app = express();
app.use(cors());
app.use(express.json()); 

app.get("/", (_req, res) => {
  res.send("You are in root");
});

app.get('/api', (_req, res) => {
  res.send('Welcome to the API');
});

app.get('/api/courses', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses ORDER BY course_name ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/api/courses/:selectedCourseId', async (req, res) => {
  const { selectedCourseId } = req.params;

  try {
    const result = await pool.query('SELECT course_id, hole_number, par FROM holes WHERE course_id = $1 ORDER BY hole_number ASC', [selectedCourseId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No holes found for this course.' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching holes:', error);
    res.status(500).json({ message: 'An error occurred while fetching holes.' });
  }
})

app.listen(PORT, () => {
    console.log(`Server listening on the port ${PORT}`);
})

module.exports = app;