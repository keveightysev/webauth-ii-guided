const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const db = require('../database/dbConfig.js');

const server = express();

const sessionConfig = {
	name: 'monster',
	secret: 'keep it secret, keep it safe',
	cookie: {
		secure: false, // use cookie over https
		httpOnly: true, // false means JS can access the cookie on the client
		maxAge: 1000 * 60 * 10,
	},
	resave: false, // avoid recreating existing sessions
	saveUninitialized: false, // GDPR compliance
	store: new KnexSessionStore({
		knex: db,
		tablename: 'sessions',
		sidfieldname: 'sid',
		createtable: true,
		clearInterval: 1000 * 60 * 30, // delete expired sessions
	}),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	res.send("It's alive!");
});

module.exports = server;
