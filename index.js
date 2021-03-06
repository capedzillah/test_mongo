const Koa = require('koa'); // ядро
const Router = require('koa-router'); // маршрутизация
const bodyParser = require('koa-bodyparser'); // парсер для POST запросов
const serve = require('koa-static'); // модуль, который отдает статические файлы типа index.html из заданной директории
const logger = require('koa-logger'); // опциональный модуль для логов сетевых запросов. Полезен при разработке.
const cors = require('koa-cors');

const passport = require('koa-passport'); //реализация passport для Koa
const LocalStrategy = require('passport-local'); //локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT

const jwtsecret = "mysecretkey"; // ключ для подписи JWT
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
const socketioJwt = require('socketio-jwt'); // аутентификация  по JWT для socket.io

const socketIO = require('socket.io');

const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.

const app = new Koa();
const router = new Router();
app.use(serve('public'));
app.use(logger());
app.use(bodyParser());
app.use(cors());

app.use(passport.initialize()); // сначала passport
app.use(router.routes()); // потом маршруты
const server = app.listen(3000);// запускаем сервер на порту 3000

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true);  // Просим Mongoose писать все запросы к базе в консоль. Удобно для отладки кода
mongoose.connect('mongodb://localhost/test'); // Подключаемся к базе test на локальной машине. Если базы нет, она будет создана автоматически.
mongoose.connection.on('error', console.error);

//---------Схема и модель пользователя------------------//

const userSchema = new mongoose.Schema({
	displayName: String,
	email: {
		type: String,
		required: 'Укажите e-mail',
		unique: 'Такой e-mail уже существует'
	},
	passwordHash: String,
	salt: String,
	userType: String,
}, {
	timestamps: true
});

userSchema.virtual('password')
	.set(function (password) {
		this._plainPassword = password;
		if (password) {
			this.salt = crypto.randomBytes(128).toString('base64');
			this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
		} else {
			this.salt = undefined;
			this.passwordHash = undefined;
		}
	})

	.get(function () {
		return this._plainPassword;
	});

userSchema.methods.checkPassword = function (password) {
	if (!password) return false;
	if (!this.passwordHash) return false;
	return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

const User = mongoose.model('User', userSchema);

//----------Passport Local Strategy--------------//

passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		session: false
	},
	function (email, password, done) {
		User.findOne({email}, (err, user) => {
			if (err) {
				return done(err);
			}

			if (!user || !user.checkPassword(password)) {
				return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
			}
			return done(null, user);
		});
	}
	)
);

//----------Passport JWT Strategy--------//

// Ждем JWT в Header

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: jwtsecret
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
		User.findById(payload.id, (err, user) => {
			if (err) {
				return done(err)
			}
			if (user) {
				done(null, user)
			} else {
				done(null, false)
			}
		})
	})
);

//------------Routing---------------//

//маршрут для создания нового пользователя

router.post('/user', async (ctx, next) => {
	try {
		ctx.body = await User.create(ctx.request.body);
	}
	catch (err) {
		ctx.status = 400;
		ctx.body = err;
	}
});

//маршрут для локальной авторизации и создания JWT при успешной авторизации

router.post('/login', async (ctx, next) => {
	await passport.authenticate('local', function (err, user) {
		if (user == false) {
			ctx.body = "Login failed";
		} else {
			//--payload - информация которую мы храним в токене и можем из него получать
			const payload = {
				id: user.id,
				displayName: user.displayName,
				email: user.email
			};
			const token = jwt.sign(payload, jwtsecret); //здесь создается JWT
			ctx.body = {user: user.displayName, token: 'JWT ' + token, userType: user.userType, id:user.id};
		}
	})(ctx, next);

});

// маршрут для авторизации по токену

router.get('/custom', async (ctx, next) => {
	await passport.authenticate('jwt', function (err, user) {
		if (user) {
			ctx.body = "hello " + user.displayName;
		} else {
			ctx.body = "No such user";
			console.log("err", err)
		}
	})(ctx, next)
});

const projectSchema = new mongoose.Schema({
	project: {
		type: String,
		required: 'Укажите название проекта'
	},
	members: {
		type: Array
	},
	creator: {
		type: String,
		required: 'Укажите создателя'
	},
	tasks: {
		type: Array
	}
}, {
	timestamps: true
});


const Project = mongoose.model('Project', projectSchema);

const taskSchema = new mongoose.Schema({
	task: {
		type: String,
		required: 'Укажите название'
	},
	members: {
		type: Array
	},

	status: {
		type: String,
		default: 'waiting'
	},
	projectid: {
		type: String
	}
}, {
	timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

router.post("/project", async (ctx) => {
	try {
		ctx.body = await Project.create(ctx.request.body);
	}
	catch (err) {
		ctx.status = 400;
		ctx.body = err;
	}
});
router.get("/project/:id", async (ctx) => {
	try {
		ctx.body = await Project.find({creator: ctx.params.id});
	}
	catch (err) {
		ctx.status = 400;
		ctx.body = err;
	}
});

router.post("/task", async (ctx) => {
	var myId = "5a536cf774266823545f31fn";
	ctx.request.body._id = myId;
	try {
		ctx.body = await Task.insertOne(ctx.request.body);
	}
	catch (err) {
		ctx.status = 400;
		ctx.body = err;
	}
});

router.get("/task", async (ctx) => {
	try {
		ctx.body = await Task.find({tags: {$all: ["red", "blank"]}})
	}
	catch (err) {
		ctx.status = 400;
		ctx.body = err;
	}
});
