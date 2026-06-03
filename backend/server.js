require('dotenv').config();
const express = require('express');
const cors = require('cors');
const plannerRoutes = require('./routes/planner');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', plannerRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Grocery Planner API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
