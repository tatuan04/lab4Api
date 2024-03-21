var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const emailRouter = require('./routes/emailRoutes');
var app = express();
// Tạo lưu trữ hình ảnh
const multer = require('multer');
// Cấu hình multer để lưu trữ hình ảnh tải lên vào thư mục 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Xử lý tải lên hình ảnh
app.post('/upload', upload.single('image'), (req, res) => {
  res.send('Image uploaded successfully');
});

// Khởi động máy chủ
app.listen(3002, () => {
  console.log('Server is running on port 3002');
});


const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const users = [
  { id: 1, username: 'user1', password: 'password1' },
];

function sinhAccessToken(user) {
  return jwt.sign( user,'123456', { expiresIn: '15m' });
}
function sinhRefreshToken(user) {
  return jwt.sign(user,'123456', { expiresIn: '1d' })
}
// Route đăng nhập
app.post('/login', (req, res) => {
  // Lấy thông tin đăng nhập từ yêu cầu
  const { username, password } = req.body;
  console.log(username, password)
  // Tìm người dùng trong danh sách
  const user = users.find(u => u.username === username && u.password === password);

  // Kiểm tra xem người dùng có tồn tại không
  if (!user) {
    res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
  }

  // Sinh access token
  const accessToken = sinhAccessToken({id: user.id, username: user.username, password: user.password});
  const refreshToken = sinhRefreshToken({id: user.id, username: user.username, password: user.password});
  res.json({ accessToken, refreshToken });
});


// Khởi động máy chủ
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});









// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/emails', emailRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3004, () => {
  console.log('Server is running on port 3004');
});
module.exports = app;
