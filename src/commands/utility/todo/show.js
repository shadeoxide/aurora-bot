/** 
 * @author ZYROUGE
 * @license GPL-3.0
*/

const { Command } = global.Aurora;

class _Command extends Command {
    constructor (client) {
        super(client, {
            name: "show",
            description: "Shows the Todo List.",
            usage: "",
            aliases: ["s"],
            enabled: true
        });
    }

    async run(message, args, { GuildDB, prefix, language, translator, responder, rawArgs }) {
        try {
            const key = { userID: message.author.id };
            let UserDB = await this.client.database.User.findOne({ where: key });
            if(!UserDB) UserDB = await this.client.database.User.create(key);
            const tasks = new Array();
            UserDB.dataValues.todo.forEach(task => {
                let formatted = task.length > 50 ? task.substr(0, 50) + "..." : task;
                tasks.push(formatted);
            });
            responder.send({
                embed: this.client.embeds.success(message.author, {
                    description: `${tasks.map((task, index) => `**${index + 1}.** ${task}`).join("\n") || "No Tasks were Found."}`
                })
            });
        } catch(e) {
            responder.send({
                embed: this.client.embeds.error(message.author, {
                    description: translator.translate("SOMETHING_WRONG", e)
                })
            });
        }
    }
}

module.exports = _Command;