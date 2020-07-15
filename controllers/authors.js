const express = require('express');
const Author = require('../models/Author');
const Book = require('../models/Book');

exports.getAllAuthors = async (req, res) => {
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
};

exports.newAuthorPage = (req, res) => {
	const author = new Author();
	res.render('authors/new', { author: author });
};

exports.createAuthor = async (req, res) => {
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
};

exports.showAuthor = async (req, res) => {
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
};

exports.editAuthorPage = async (req, res) => {
	try {
		const author = await Author.findById(req.params.id);
		res.render('authors/edit', { author: author });
	} catch (err) {
		res.redirect('/authors');
	}
};

exports.updateAuthor = async (req, res) => {
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
};

exports.deleteAuthor = async (req, res) => {
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
};
