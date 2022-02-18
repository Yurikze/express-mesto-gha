const router = require('express').Router()
const {getCards, postCard, deleteCard} = require('../controllers/cards')

router.get('/', getCards)
router.post('/', postCard)
router.delete('/:cardId', deleteCard)

module.exports = router