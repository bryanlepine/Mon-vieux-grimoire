const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/users');
const bookRoute = require('./routes/book');
const path = require('path');
const swaggerConfig = require('../backend/swagger/swagger');


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://lepinebryan:48s4kHmbtE1gIyrK@clustersimple.ap6nkdr.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors());
app.use(express.json());
app.use('/api/auth', userRoute);
app.use('/api/books', bookRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  console.log(req.headers.authorization);
  next();
});


swaggerConfig(app);

module.exports = app;