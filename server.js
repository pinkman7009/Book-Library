if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const mongoose = require('mongoose');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use('/', indexRouter);

// Connecting to DB
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Conencted to Database'));

// Starting the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server has been started on port ${PORT}`);
});
