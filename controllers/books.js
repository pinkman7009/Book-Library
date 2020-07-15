const express = require('express');
const Book = require('../models/Book');
const Author = require('../models/Author');

const imageMimeTypes = [ 'image/jpeg', 'image/png', 'image/gif' ];

exports.getAllBooks = async (req, res) => {
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
};

exports.newBookPage = async (req, res) => {
	const newBook = new Book();
	renderNewPage(res, newBook);
};

exports.createBook = async (req, res) => {
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
		res.redirect(`books/${savedBook.id}`);
	} catch (err) {
		renderNewPage(res, book, true);
	}
};

exports.showBook = async (req, res) => {
	try {
		const book = await Book.findById(req.params.id).populate('author').exec();

		res.render('books/show', { book: book });
	} catch (err) {
		res.redirect('/');
	}
};

exports.editBookPage = async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		renderEditPage(res, book);
	} catch (err) {
		res.redirect('/');
	}
};

exports.updateBook = async (req, res) => {
	let book;
	try {
		book = await Book.findById(req.params.id);
		book.title = req.body.title;
		book.author = req.body.author;
		book.publishDate = new Date(req.body.publishDate);
		book.pageCount = req.body.pageCount;
		book.description = req.body.description;
		if (req.body.cover != null && req.body.cover !== '') saveCover(book, req.body.cover);
		await book.save();
		res.redirect(`/books/${book.id}`);
	} catch (err) {
		if (book != null) {
			renderEditPage(res, book, true);
		} else {
			res.redirect('/');
		}
	}
};

exports.deleteBook = async (req, res) => {
	let book;
	try {
		book = await Book.findById(req.params.id);
		await book.remove();
		res.redirect('/books');
	} catch (err) {
		if (book != null) {
			res.render('books/show', {
				book: book,
				errorMessage: 'Could not remove book'
			});
		} else {
			res.redirect('/');
		}
	}
};

// To render new book page
async function renderNewPage(res, book, hasError = false) {
	renderFormPage(res, book, 'new', hasError);
}

// To render edit book page
async function renderEditPage(res, book, hasError = false) {
	renderFormPage(res, book, 'edit', hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
	let params;
	try {
		const authors = await Author.find();
		params = {
			authors: authors,
			book: book
		};

		if (hasError) {
			if (form === 'edit') {
				params.errorMessage = 'Error Updating Book: Cannot leave field empty!';
			} else {
				params.errorMessage = 'Error Creating Book: Cannot leave field empty!';
			}
		}

		res.render(`books/${form}`, params);
	} catch (err) {
		res.render(`books/${form}`, params);
	}
}

// To save a book cover
function saveCover(book, coverEncoded) {
	if (coverEncoded == null || coverEncoded == '') return;
	const cover = JSON.parse(coverEncoded);
	if (cover != null && imageMimeTypes.includes(cover.type)) {
		book.coverImage = new Buffer.from(cover.data, 'base64');
		book.coverImageType = cover.type;
	}
}
