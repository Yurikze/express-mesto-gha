const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({}).then((cards) => res.send({ data: cards }));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Error occured' }));
};

module.exports.deleteCard = (req, res) => {
  console.log(req.params)
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Error occured' }));
};
