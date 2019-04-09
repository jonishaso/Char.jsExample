import express from'express';
import http from'http';
import path from'path';
import createError from'http-errors';
import cookieParser from'cookie-parser';
import logger from'morgan';

import {getTeamMonth, formatRawData} from './dbPayload';
import { TEAMMONTH,DBConf } from './sqlColl';
import {Database} from './dbUtility';
import {router as indexRouter} from './routes/index';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = 3001
app.set('port', port);

const server = http.createServer(app)
const io = require('socket.io')(server)
server.listen(port);
var db_data = []

io.on('connection', function (socket) {
  console.log("user connected");
  if(db_data.length == 0) {
    var db = new Database(DBConf);
    var tasks = Array.from(Array(12).keys()).map( e => db.actionQuery(TEAMMONTH,getTeamMonth(e))) 
    Promise.all(tasks).then(r => {
      db_data = formatRawData(r)
      io.emit('report', JSON.stringify(db_data));
      db.closeConn()
    }).catch(e => {
      console.dir(e)
      db.closeConn()
    })
  }
  else
    io.emit('report', JSON.stringify(db_data));
});



export { server, io };
