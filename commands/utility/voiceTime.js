const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
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
	data: new SlashCommandBuilder()
		.setName('voice')
		.setDescription('Provides logged time a user is in voice chat.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		const userMilli = userChannelData[interaction.user.id];
		const userSeconds = userMilli * 1000;
		let userMinutes = 0;
		let userHours = 0;
		// I don't like how this is going tbh, there has to be a better way of computing this.
		if (userSeconds >= 60) {
			userMinutes = userSeconds * 60;
		}
		await interaction.reply(`You have been in voice for a total of ${userHours} hours, ${userMinutes} minutes and ${userSeconds} seconds`);
	},
};