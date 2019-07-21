import { CustomCommand } from "../../classes/command"
import { Message, MessageEmbed } from "discord.js"

export default class extends CustomCommand {
	public constructor() {
		super({
			channel: "guild",
			description: {
				help: "Display your current role colors hex value",
				args: "",
			},
		})
	}

	public async exec(message: Message): Promise<Message | Message[]> {
		const role = message.guild!.roles.cache.find(r => r.name === `USER-${message.author.id}`)
		if (!role) return message.util!.send("You don't have a role", { embed: undefined })

		const hex = role.hexColor.replace("#", "").toUpperCase()
		const embed = new MessageEmbed()
			.setColor(hex)
			.setImage(`https://dummyimage.com/150x50/${hex}/000000&text=${hex}`)

		return message.util!.send(embed)
	}
}
