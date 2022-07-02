const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const config = require('./config');
const routes = require('./routes/index.route');
const app = express();


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());
app.use(
  session({
    secret: 'supersecretkeyyoushouldnotcommittogithub',
    saveUninitialized: false,
    resave: false
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use('/', routes);

app.listen(config.port, () => {
  console.log('Server is running on port ' + config.port);
  console.log('Visit http://localhost:' + config.port + '/');
});