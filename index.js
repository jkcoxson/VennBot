// Authored by FGamerJ#9611

// This makes the bot work, no touchies :P
const Discord = require('discord.js');
const fetch = require('node-fetch');
require('discord-reply');
require('dotenv').config();
const client = new Discord.Client();
let prefix = '-';

// Rubiks cube-related stuff
const scrambleLength = 20;
const moveFaces = ['F', 'R', 'U', 'B', 'L', 'D'];
const moveModifiers = ['', "'", '2'];

// Generates a single move which specifies a different face than the previous move
// Recursion magic✨
const generateMove = function (scramble) {
	let move = moveFaces[Math.floor(Math.random() * moveFaces.length)];
	if (move === scramble[scramble.length - 1]) {
		move = generateMove(scramble);
	}
	return move;
};

// Generates a modifier that will describe whether a move is clockwise, counter-clockwise,
// or a 180° turn
const generateModifier = function () {
	return moveModifiers[Math.floor(Math.random() * moveModifiers.length)];
};

// Fetches a quote from some random quote website's API and formats it
const getQuote = function () {
	return fetch('https://zenquotes.io/api/random')
		.then(res => {
			return res.json();
		})
		.then(data => {
			return `${data[0]['q']}\n- ${data[0]['a']}`;
		});
};

// Self-explanatory
CommandDescriptions = {
	ping: '*Ping:*\nPing? Pong!\n\n',
	scramble: '*Scramble:*\nGenerates a rubiks cube scramble.\n\n',
	quote: '*Quote:*\nFinds a nice quote for you.\n\n',
	help: '*Help:*\nSends a crisis squad to your location within 5 minutes.\n\n',
};

// Commands stored in object methods for ease of use
Commands = {
	ping: function (msg) {
		msg.lineReply('Pong!');
	},
	scramble: function (msg) {
		const scramble = [];
		let scrambleStr = '';
		for (let i = 0; i < scrambleLength; i++) {
			scramble.push(generateMove(scramble));
		}
		for (let i = 0; i < scrambleLength; i++) {
			scramble[i] += generateModifier();
		}
		for (let i = 0; i < scrambleLength; i++) {
			scrambleStr += scramble[i] + ' ';
		}
		msg.lineReply(scrambleStr);
	},
	quote: function (msg) {
		getQuote().then(quote => msg.lineReply(quote));
	},
	help: function (msg) {
		helpStr = '**Here is a list of available commands:**\n\n';
		Object.keys(CommandDescriptions).forEach(property => {
			helpStr += CommandDescriptions[property];
		});
		msg.lineReply(helpStr);
	},
};

// Only I can see this >:D
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

// Checks if any given message is a command, or one-ups Jkc's inferior CamelBot
client.on('message', async msg => {
	if (msg.content.toLowerCase() === 'good bot') {
		msg.channel.send("I'm better though!"); // Sorry not sorry
	}
	if (!(msg.content[0] === prefix)) return;
	let command = msg.content.slice(prefix.length).split(' ');
	let keyword = command[0];
	Commands[keyword](msg);
});

// Cool kidz only B)
client.login(process.env.BOT_TOKEN);
