'use strict';

const config = require('./config');
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');

//Socail Authentication Logic
require('./auth')();


//Create an IO server instance
let ioServer = app => {
	app.locals.chatrooms = []; //TODO: This is not scalable. This is stored in memory.
	const server = require('http').Server(app);
	const io = require('socket.io')(server);
	io.set('transports', ['websocket']);
	//Publishing 
	let pubClient = redis(config.redis.port, config.redis.host, {
		auth_pass: config.redis.password
	});
	//Subscribe or get
	let subClient = redis(config.redis.port, config.redis.host, {
		return_buffers: true,
		auth_pass: config.redis.password
	});
	io.adapter(adapter({
		pubClient,
		subClient
	}));
	io.use((socket, next) => {
		require('./session')(socket.request, {}, next);
	})
	require('./socket')(io, app);
	return server;
}

module.exports = {
	router: require('./routes')(),
	session: require('./session'),
	ioServer,
	logger: require('./logger')
}