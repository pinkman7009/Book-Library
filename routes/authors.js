const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const Book = require('../models/Book');

const authorController = require('../controllers/authors');

// All Authors Route
router.get('/', authorController.getAllAuthors);

// New Author Route
router.get('/new', authorController.newAuthorPage);

// Create Author Route
router.post('/', authorController.createAuthor);

// Show Author

router.get('/:id', authorController.showAuthor);

// Edit Author
router.get('/:id/edit', authorController.editAuthorPage);

// Update Author

router.put('/:id', authorController.updateAuthor);

// Delete Author
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
