const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const app = express();

app.use(cors()); 
app.use(express.json()); 

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy and running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});
app.use(errorHandler);
module.exports = app;
