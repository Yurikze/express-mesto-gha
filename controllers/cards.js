const Card = require('../models/card');
const { NotFoundError } = require('../Error/NotFoundError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.postCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(200).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      if (card.owner._id.toString() !== '123') {
        throw new Error('Вы не можете удалить чужую карточку');
      }
      card.remove();
      res.status(200).send({ data: card, message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректые данные карточки' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: userId },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректые данные карточки' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректые данные карточки' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
