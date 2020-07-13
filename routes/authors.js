const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const Book = require('../models/Book');

// All Authors Route
router.get('/', async (req, res) => {
	let searchParams = {};
	if (req.query.name != null && req.query.name !== '') searchParams.name = new RegExp(req.query.name, 'i');
	try {
		const authors = await Author.find(searchParams);
		// console.log(searchOptions);
		res.render('authors/index', {
			authors: authors,
			searchOptions: req.query
		});
	} catch (err) {
		res.redirect('/');
	}
});

// New Author Route
router.get('/new', (req, res) => {
	const author = new Author();
	res.render('authors/new', { author: author });
});

// Create Author Route
router.post('/', async (req, res) => {
	const author = new Author({
		name: req.body.name
	});

	try {
		const newAuthor = await author.save();
		res.redirect(`authors/${newAuthor.id}`);
	} catch (err) {
		res.render('authors/new', {
			author: author,
			errorMessage: 'Error creating Author. Cannot leave field empty!'
		});
	}
});

// Show Author

router.get('/:id', async (req, res) => {
	try {
		const author = await Author.findById(req.params.id);
		const books = await Book.find({ author: author.id }).limit(10).exec();

		res.render('authors/show', {
			author: author,
			books: books
		});
	} catch (err) {
		res.redirect('/');
	}
});

// Edit Author
router.get('/:id/edit', async (req, res) => {
	try {
		const author = await Author.findById(req.params.id);
		res.render('authors/edit', { author: author });
	} catch (err) {
		res.redirect('/authors');
	}
});

// Update Author

router.put('/:id', async (req, res) => {
	let author;
	try {
		author = await Author.findById(req.params.id);

		author.name = req.body.name;

		await author.save();

		res.redirect(`/authors/${author.id}`);
	} catch (err) {
		if (author == null) res.redirect('/');
		else {
			res.render('authors/edit', {
				author: author,
				errorMessage: 'Error updating author: Cannot leave field empty!'
			});
		}
	}
});
// Delete Author
router.delete('/:id', async (req, res) => {
	let author;
	try {
		author = await Author.findById(req.params.id);

		await author.remove();

		res.redirect(`/authors`);
	} catch (err) {
		if (author == null) res.redirect('/');
		else {
			console.log('lmao', err);
			res.redirect(`/authors/${author.id}`);
		}
	}
});

module.exports = router;
