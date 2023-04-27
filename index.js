const { Client, Intents } = require("discord.js");
const Discord = require("discord.js");
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES
    ], partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const fs = require("fs");
const config = require("./config.json");
client.config = config;

fs.readdir("./events/handler", (_err, files) => {
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/handler/${file}`);
        let eventName = file.split(".")[0];
        console.log(`[Event]   ✅  Loaded: ${eventName}`);
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/handler/${file}`)];
    });
});

client.interactions = new Discord.Collection();
client.register_arr = []
fs.readdir("./commands/mods", (_err, files) => {
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/mods/${file}`);
        let commandName = file.split(".")[0];
        client.interactions.set(commandName, {
            name: commandName,
            ...props
        });
        client.register_arr.push(props)
    });
});

client.login(config.token)
