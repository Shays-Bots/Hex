import { CustomCommand } from "../../classes/command"
import { Message, MessageEmbed } from "discord.js"

export default class extends CustomCommand {
	public constructor() {
		super()
	}

	public async exec(message: Message): Promise<Message | Message[]> {
		const { username, id } = this.client.user!
		const source = `https://github.com/ShayBox/${username}`
		const invite = `https://bot.shaybox.com/${id}`
		const lexa = "https://top.gg/bot/594323388705538069"

		const prefixSetting: string = this.client.settings.get(message.guild!.id, "prefix", "h!")
		const embed = new MessageEmbed()
			.setColor(6345206)
			.setTitle(`${username} Commands`)
			.setDescription(`[Source Code](${source}) | [Invite Hex](${invite}) | [Lexa Bot](${lexa})`)
			.setFooter(`The current prefix is ${prefixSetting} or @Hex`)

		this.handler.modules
			.filter(m => m.description)
			.filter(m => (message.guild ? true : m.channel !== "guild"))
			.forEach(m => embed.addField(`${m.id} ${m.description.args || ""}`, m.description.help || ""))

		return message.util!.send(embed)
	}
}
