const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');

// All Books Route
router.get('/', async (req, res) => {
	res.send('All Books');
});

// New Author Route
router.get('/new', async (req, res) => {
	try {
		const authors = await Author.find();
		const book = new Book();
		res.render('books/new', {
			authors: authors,
			book: book
		});
	} catch (err) {
		res.redirect('books');
	}
});

// Create Author Route
router.post('/', async (req, res) => {
	res.send('Create Book');
});

module.exports = router;
