if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
// Routers
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(
	express.urlencoded({
		extended: true,
		limit: '50mb'
	})
);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

// Connecting to DB
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Starting the server
const PORT = process.env.PORT || 5000;

const d = new Date();
app.listen(PORT, () => {
	console.log(
		`Server has been started on port ${PORT} at ${d.getHours()} : ${d.getMinutes()} on ${d.toDateString()}`
	);
});
