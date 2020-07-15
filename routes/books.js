const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books');

// Multer Code
// const upload = multer({
// 	dest: uploadPath,
// 	fileFilter: (req, file, callback) => {
// 		callback(null, imageMimeTypes.includes(file.mimetype));
// 	}
// });

// All Books Route
router.get('/', bookController.getAllBooks);

// New Book Route
router.get('/new', bookController.newBookPage);

// Create Book Route
router.post('/', bookController.createBook);

// Show Book Route
router.get('/:id', bookController.showBook);

// Edit Book Route
router.get('/:id/edit', bookController.editBookPage);

// Update Book Route
router.put('/:id', bookController.updateBook);

// Delete Book Route
router.delete('/:id', bookController.deleteBook);

module.exports = router;
