"use strict";
//set up the discord client and other constants
const Discord = require("discord.js");
const client = new Discord.Client();
const exec = require('child_process').exec;
const fs = require('fs');

//global vars
var token = '';
var masterID = 0;
var admins = [];
var version = "0.0.0";
var commandIndicator = '!';

function pullCommand(string){
	var start = string.indexOf(commandIndicator);
	if (start != -1){
		var i = (start + 1);
		while ((i < string.length) && (string.charAt(i) != ' ')){
			i++;
		}
		return string.slice(start, i-1);
	}
	else{
		return -1;	
	}
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.username}`);
});

client.on('message', msg => {
	console.log(`${pullCommand(msg.content)}`);
	if (msg.isMentioned(client.user)){
		var command = pullCommand(msg.content);
		if (command === '!update'){
			msg.channel.sendMessage('Checking for updates...')
				.then((msg) =>{
					var gitProc = exec('git pull origin', (error, stdout, stderr) => {
						if (error) {
							console.error(`exec error: ${error}`);
							return;
						}
						console.log(`stdout: ${stdout}`);
						console.log(`stderr: ${stderr}`);
						if (stdout === 'Already up-to-date.\n'){
							msg.edit('Already up to date.');
						}
						else{
							fs.readFile('CHANGELIST', 'utf8', (err, data) =>{
								if (!err){
									var startPos = data.indexOf('{');
									var endPos = data.indexOf('}');
									version = data.slice(0, startPos);
									msg.edit(`Updated to version **${version}**`)
										.then((msg) =>{
											var changelist = data.slice(startPos+1, endPos-1);
											msg.channel.sendMessage("```" + `${changelist}` + "```")
												.then(()=>{
													process.exit(0);
												});
										});
								}
							});	
						}
					});
				});
		}
	}
});


//read private startup files
fs.readFile('masterId.txt', 'utf8', (err, data) =>{
	if (!err){
		masterID = data.replace('\n', '');
		console.log(`Master ID: ${masterID}`);
	}
});
fs.readFile('adminList.txt', 'utf8', (err, data) => {
	if (!err){
		admins = data.split('\n');
		admins.pop();
		console.log(`Admins: ${admins}`);
	}
});
fs.readFile('token.txt', 'utf8', (err, data) =>{
	if (!err){
		token = data.replace('\n', '');
		console.log(`Token: ${token}`);
		client.login(token);
	}
});
