const { Client } = require('discord.js-selfbot-v13');
const loadTokens = require('./tokenLoader');
const runBoostRoutine = require('./boostEngine');
const config = require('./config.json');

const master = new Client({ checkUpdate: false });

master.on('ready', () => {
    console.log(`Daemon Ready: ${master.user.tag}`);
});

master.on('messageCreate', async (message) => {
    if (!config.operators.includes(message.author.id)) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    if (cmd === 'boost') {
        const targetGuildId = args[0];
        const targetBoostsCount = parseInt(args[1]);

        if (!targetGuildId || !targetBoostsCount || isNaN(targetBoostsCount)) {
            return message.reply('Syntax Error. Usage: `!boost <GUILD_ID> <BOOST_COUNT>`');
        }

        const tokens = loadTokens('./tokens.txt');
        if (tokens.length === 0) {
            return message.channel.send('Error: Empty pool in `tokens.txt`.');
        }

        await message.channel.send(`[PIPELINE_INIT] Target: **${targetBoostsCount}** boost(s) -> Guild \`${targetGuildId}\`. Processing...`);

        const result = await runBoostRoutine(tokens, targetGuildId, targetBoostsCount, config.delayMs);

        message.channel.send(`[PIPELINE_DONE]\n• Applied Boosts: \`${result.appliedBoosts}/${targetBoostsCount}\`\n• Failed/Skipped Workers: \`${result.failedAccounts}\``);
    }
});

master.login(process.env.MASTER_TOKEN);
  
