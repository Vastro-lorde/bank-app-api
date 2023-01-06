const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',express.static('public'));
app.use(morgan('dev'));
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
console.log(__dirname);
// create logger
app.use(morgan("combined",{ stream: accessLogStream }));

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    console.log('CTRL+C to exit.');
});