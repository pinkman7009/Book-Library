const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');
const multer = require('multer');
const path = require('path');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = [ 'image/jpeg', 'image/png', 'image/gif' ];
const fs = require('fs');

const upload = multer({
	dest: uploadPath,
	fileFilter: (req, file, callback) => {
		callback(null, imageMimeTypes.includes(file.mimetype));
	}
});

// All Books Route
router.get('/', async (req, res) => {
	let searchParams = {};
	if (req.query.title != null && req.query.title !== '') {
		searchParams.title = new RegExp(req.query.title, 'i');
	}
	// console.log(req.query.title);
	try {
		const books = await Book.find(searchParams);

		res.render('books/index', {
			books: books,
			searchOptions: req.query
		});
	} catch (err) {
		res.redirect('/');
	}
});

// New Book Route
router.get('/new', async (req, res) => {
	const newBook = new Book();
	renderNewPage(res, newBook);
});

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
	const fileName = req.file != null ? req.file.filename : null;
	const book = new Book({
		title: req.body.title,
		author: req.body.author,
		publishDate: new Date(req.body.publishDate),
		description: req.body.description,
		pageCount: req.body.pageCount,
		coverImageName: fileName
	});
	try {
		const savedBook = await book.save();
		// res.redirect(`books/${savedBook.id}`);
		res.redirect('books');
	} catch (err) {
		if (book.coverImageName != null) removeBookCover(book.coverImageName);
		renderNewPage(res, book, true);
	}
});

function removeBookCover(fileName) {
	fs.unlink(path.join(uploadPath, fileName), (err) => {
		if (err) console.log(err);
	});
}
async function renderNewPage(res, book, hasError = false) {
	try {
		const authors = await Author.find();
		const params = {
			authors: authors,
			book: book
		};
		if (hasError) params.errorMessage = 'Error creating Book';
		res.render('books/new', params);
	} catch (err) {
		res.redirect('books');
	}
}

module.exports = router;
