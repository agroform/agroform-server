require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');

require('./configs/db.config'); 

//const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

app.use(logger('dev', {
  skip: function (req, res) {
    return req.url.includes('favicon.ico');
  },
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL]
  })
)

//Seeding database
app.use('/', require('./seeds/service.seed'));


const index = require('./routes/index');
app.use('/', index);


module.exports = app;
