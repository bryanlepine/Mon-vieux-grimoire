const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/book');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/bestrating', bookCtrl.getBestRatingBooks);
router.get('/:id', bookCtrl.getSingleBook);
router.get('/', bookCtrl.getAllBooks);

router.post('/:id/rating', auth, bookCtrl.createRatingBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.post('/', auth, multer, bookCtrl.createBook);
router.delete('/:id', auth, bookCtrl.deleteBook);




module.exports= router;