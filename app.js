const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {NotFoundError} = require('./Error/Errors')
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '620f4abab2c9100c5f8f3f97',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'))
app.use('*', (req, res) => {
  try {
    throw new NotFoundError("Страница не найдена")
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).send({message: err.message})
    }
  }
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
