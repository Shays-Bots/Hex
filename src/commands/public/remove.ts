import { CustomCommand } from "../../classes/command"
import { Message, MessageEmbed } from "discord.js"

export default class extends CustomCommand {
	public constructor() {
		super({
			channel: "guild",
			clientPermissions: ["MANAGE_ROLES"],
			description: {
				help: "Remove your role color",
				args: "",
			},
		})
	}

	public async exec(message: Message): Promise<Message | Message[]> {
		const role = message.guild!.roles.cache.find(r => r.name === `USER-${message.author.id}`)
		if (!role) return message.util!.send("You don't have a role", { embed: undefined })

		await role.delete()

		const hex = role.hexColor.replace("#", "").toUpperCase()
		const embed = new MessageEmbed()
			.setColor(role.color)
			.setFooter("Removed role")
			.setImage(`https://dummyimage.com/150x50/${hex}/000000&text=${hex}`)

		return message.util!.send(embed)
	}
}
