import { Command } from "discord-akairo"
import { CustomListener } from "../../classes/listener"
import { Message, MessageEmbed } from "discord.js"

export default class extends CustomListener {
	public async exec(error: Error, message: Message, command?: Command) {
		console.error(error)

		if (command?.id === "eval") return

		const { CONSOLE_WEBHOOK } = process.env
		if (!CONSOLE_WEBHOOK) return

		const webhook = await this.client.fetchWebhook(CONSOLE_WEBHOOK)
		const embed = new MessageEmbed()
			.setAuthor(`${message.author.username} (${message.author.id})`, message.author.displayAvatarURL({ format: "webp" }))
			.addField("Command", command?.id ?? "Unknown Command")
			.addField("Content", message.content)
			.addField("Guild", `${message.guild!.name} (${message.guild!.id})`)
			.setColor(16711680)

		await webhook.send(error.stack, {
			code: true,
			embeds: [embed],
			username: this.client.user!.username,
			avatarURL: this.client.user!.displayAvatarURL({ format: "webp" }),
		})
	}
}
