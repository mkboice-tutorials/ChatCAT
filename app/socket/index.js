'use strict';
const h = require('../helpers');

module.exports = (io, app) => {
	let allrooms = app.locals.chatrooms;

	io.of('/roomslist').on('connection' ,socket => {
		socket.on('getChatrooms', () => {
			socket.emit('chatRoomsList', JSON.stringify(allrooms));
		});

		socket.on('createNewRoom', newRoomInput => {
			//check to see if a room with the same title exists or not
			//if not, create one and broadcast it to everyone
			if(!h.findRoomByName(allrooms, newRoomInput)) {
				//Create a new room and broadcast to all
				allrooms.push({
					room: newRoomInput,
					roomID: h.randomHex(),
					users: []
				});

				//Emit an updated list to the creator
				socket.emit('chatRoomsList', JSON.stringify(allrooms));
				//Emit an updated list to everyone connected to the rooms page
				socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
			}
		});
	});
}