const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');

const app = express();
const port = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../client/public'));
app.use('/api', routes);

app.listen(port, () => {
  console.log('listening to port', port);
});