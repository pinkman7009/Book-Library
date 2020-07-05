const express = require('express');
const router = express.Router();
const Author = require('../models/Author');

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
		// res.redirect(`authors/${newAuthor.id}`);
		res.redirect('authors');
	} catch (err) {
		res.render('authors/new', {
			author: author,
			errorMessage: 'Error creating Author'
		});
	}
});

// Delete Author
router.delete('/:id', (req, res) => {
	res.send(`Deleted Author with id : ${req.params.id}`);
	console.log(req.params.id);
});

module.exports = router;
