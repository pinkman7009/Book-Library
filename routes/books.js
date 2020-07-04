const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');

const imageMimeTypes = [ 'image/jpeg', 'image/png', 'image/gif' ];

// Multer Code
// const upload = multer({
// 	dest: uploadPath,
// 	fileFilter: (req, file, callback) => {
// 		callback(null, imageMimeTypes.includes(file.mimetype));
// 	}
// });

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
router.post('/', async (req, res) => {
	const book = new Book({
		title: req.body.title,
		author: req.body.author,
		publishDate: new Date(req.body.publishDate),
		description: req.body.description,
		pageCount: req.body.pageCount
	});
	saveCover(book, req.body.cover);
	try {
		const savedBook = await book.save();
		// res.redirect(`books/${savedBook.id}`);
		res.redirect('books');
	} catch (err) {
		renderNewPage(res, book, true);
	}
});

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

function saveCover(book, coverEncoded) {
	if (coverEncoded == null) return;
	const cover = JSON.parse(coverEncoded);
	if (cover != null && imageMimeTypes.includes(cover.type)) {
		book.coverImage = new Buffer.from(cover.data, 'base64');
		book.coverImageType = cover.type;
	}
}

module.exports = router;
