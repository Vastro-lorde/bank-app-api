const express = require('express');
const path = require('path');
const fs = require('fs')
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const routes = require('./routes')
require('dotenv').config();
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',express.static('public'));
const logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});
if (process.env.NODE_ENV === 'production'){
    // create a write stream for logging to file
    app.use(morgan("combined",{ stream: accessLogStream }));
}else {
    app.use(morgan('dev'));
}
app.use('/',routes)

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    console.log('CTRL+C to exit.');
});