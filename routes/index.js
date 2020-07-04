const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.get('/', async (req, res) => {
	try {
		const books = await Book.find().sort({ createdAt: desc }).limit(10).exec();
		res.render('index', {
			books: books
		});
	} catch (err) {
		res.redirect('/');
	}
});

module.exports = router;
