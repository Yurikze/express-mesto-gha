const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../Error/NotFoundError');
const { NotValidError } = require('../Error/NotValidError');
const { ConflictError } = require('../Error/ConflictError');
const { CastError } = require('../Error/CastError');

module.exports.login = (req, res, next) => {
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
    .catch(next);
};

module.exports.getMe = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь с id не найден');
    }
    res.status(200).send({ data: user });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new CastError('Некорректный id пользователя'));
    } else {
      next(error);
    }
  }
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Пользователь с id не найден');
    }
    res.status(200).send({ data: user });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new CastError('Некорректный id пользователя'));
    } else {
      next(error);
    }
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashPassword, name, about, avatar,
    });
    res.status(200).send({
      user: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError('Такой Email существует'));
    } else {
      next(err);
    }
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  try {
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
    if (error.name === 'ValidationError') {
      next(new NotValidError('Некорректные данные'));
    } else {
      next(error);
    }
  }
};

module.exports.updateAvatar = (req, res, next) => {
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
      if (error.name === 'CastError') {
        next(new CastError('Некорректный id пользователя'));
      } else {
        next(error);
      }
    });
};
