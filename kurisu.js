//set up the discord client and other constants
const Discord = require("discord.js");
const client = new Discord.Client();
const exec = require('child_process').exec;
const fs = require('fs');

//global vars
var token = '';
var masterID = 0;
var admins = []

client.on('ready', () => {
	console.log(`Logged in as ${client.user.username}`);
});

client.on('message', msg => {
	if (msg.content === 'update'){
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
						fs.writeFile('updated.txt', '', (err)=>{
							if (err) throw err;
							msg.edit('Update found. Updating...');
							process.exit(0);
						});
					}
				});
			});
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
