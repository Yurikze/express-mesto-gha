const User = require("../models/user");
const { NotFoundError, NotValidError } = require("../Error/Errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((res) =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError("Пользователь с id не найден");
    }
    res.status(200).send({ data: user });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).send({ message: error.message });
    } else if (error.name === "CastError") {
      res.status(400).send({ message: "Некорректный id пользователя" });
    } else {
      res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Некорректные данные" });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.updateUserInfo = async (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  try {
    if (!name || !about) {
      throw new NotValidError("Некорректные данные");
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new NotFoundError("Пользователь с id не найден");
    }
    res.status(200).send({ data: user });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).send({ message: error.message });
    } else if (
      error.name === "ValidationError" ||
      error instanceof NotValidError
    ) {
      res.status(400).send({ message: "Некорректные данные" });
    } else {
      res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь с id не найден");
      }
      res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).send({ message: error.message });
      } else if (error.name === "ValidationError") {
        res.status(400).send({ message: "Некорректные данные" });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};
