const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');
const multer = require('multer');
const path = require('path');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = [ 'image/jpeg', 'image/png', 'image/gif' ];

const upload = multer({
	dest: uploadPath,
	fileFilter: (req, file, callback) => {
		callback(null, imageMimeTypes.includes(file.mimetype));
	}
});

// All Books Route
router.get('/', async (req, res) => {
	res.send('All Books');
});

// New Book Route
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

// Create Book Route
router.post('/', async (req, res) => {
	const book = new Book({
		title: req.body.title,
		author: req.body.author,
		publishDate: new Date(req.body.publishDate),
		description: req.body.description,
		pageCount: req.body.pageCount
	});
	try {
		const savedBook = await book.save();
	} catch (err) {
		res.redirect('books', {});
	}
});

module.exports = router;
