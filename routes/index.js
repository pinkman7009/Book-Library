const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.get('/', async (req, res) => {
	let books;
	try {
		books = await Book.find().sort({ createdAt: -1 }).limit(10).exec();
	} catch (err) {
		books = [];
	}
	res.render('index', { books: books });
});

module.exports = router;
