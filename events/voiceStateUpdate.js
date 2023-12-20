const { Events } = require('discord.js');
const fs = require('fs');
const userChannelTimes = {};
let userChannelData = {};

fs.readFile('./userVoiceData.json', (err, data) => {
	if (err) {
		console.log('error reading user data file: ', err);
	}
	else {
		userChannelData = JSON.parse(data);
	}
});

module.exports = {
	name: Events.VoiceStateUpdate,
	execute(oldState, newState) {
		if (newState.channelId == null && oldState.channelId != null) {
			console.log(`${newState.member.nickname ? newState.member.nickname : newState.member.client.user.username} left voice channel ${oldState.channel.name} at ${Date.now()}`);
			// Take difference between now and time entered here, and log in json file
			if (userChannelData[newState.member.id]) {
				userChannelData[newState.member.id] += Date.now() - userChannelTimes[newState.member.id];
			}
			else {
				userChannelData[newState.member.id] = Date.now() - userChannelTimes[newState.member.id];
			}
			const json = JSON.stringify(userChannelData);
			fs.writeFile('./userVoiceData.json', json, 'utf8', (err, data) => {
				if (err) {
					console.error(err);
				}
				else {
					console.log('wrote to file', data);
				}
			});
		}
		else if (oldState.channelId == null && newState.channelId != null) {
			console.log(`${newState.member.nickname ? newState.member.nickname : newState.member.client.user.username} joined voice channel ${newState.channel.name} at ${Date.now()}`);
			// log the time channel was entered here
			userChannelTimes[newState.member.id] = Date.now();
		}
	},
};