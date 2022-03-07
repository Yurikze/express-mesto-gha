const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../Error/NotFoundError');
const { NotValidError } = require('../Error/NotValidError');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getMe = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь с id не найден');
    }
    res.status(200).send({ data: user });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).send({ message: error.message });
    } else if (error.name === 'CastError') {
      res.status(400).send({ message: 'Некорректный id пользователя' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Пользователь с id не найден');
    }
    res.status(200).send({ data: user });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).send({ message: error.message });
    } else if (error.name === 'CastError') {
      res.status(400).send({ message: 'Некорректный id пользователя' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.createUser = async (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashPassword, name, about, avatar,
    });
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.updateUserInfo = async (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  try {
    if (!name || !about) {
      throw new NotValidError('Некорректные данные');
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь с id не найден');
    }
    res.status(200).send({ data: user });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).send({ message: error.message });
    } else if (
      error.name === 'ValidationError'
      || error instanceof NotValidError
    ) {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с id не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).send({ message: error.message });
      } else if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
