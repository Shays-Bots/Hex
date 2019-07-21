import { CustomCommand } from "../../classes/command"
import { Message, MessageEmbed } from "discord.js"
import fetch from "node-fetch"

export default class extends CustomCommand {
	public constructor() {
		super()
	}

	public async exec(message: Message): Promise<Message | Message[]> {
		const guilds = this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount)
		const maxSpacing = Math.max(...guilds.map(g => g.memberCount.toString().length))
		const body = guilds
			.map(g => `${g.memberCount}${" ".repeat(maxSpacing - g.memberCount.toString().length)} :: ${g.name}`)
			.join("\n")

		const { key } = await fetch("https://paste.nomsy.net/documents", { body, method: "post" })
			.then(res => res.json())
			.catch(console.error)

		const embed = new MessageEmbed()
			.setTitle("Statistics")
			.setDescription(`[Guild List](https://paste.nomsy.net/raw/${key as string})`)
			.setColor(6345206)
			.addField(...this.uptime)
			.addField(...this.memory)
			.addField(...this.guildCount)
			.addField(...this.cachedUsers)
			.addField(...this.totalUsers)
			.addField(...this.shardCount)

		return message.util!.send(embed)
	}

	private get uptime(): [string, string, boolean] {
		const uptime = process.uptime()
		const output = new Date(uptime * 1000).toISOString().slice(11, -1)

		return ["Uptime", output, true]
	}

	private get memory(): [string, string, boolean] {
		const { heapUsed } = process.memoryUsage()
		const output = `${Math.round(heapUsed / (1024 * 1024))} MiB`

		return ["Memory", output, true]
	}

	private get guildCount(): [string, string, boolean] {
		const guilds = this.client.guilds.cache.size

		return ["Guild Count", guilds.toString(), true]
	}

	private get cachedUsers(): [string, string, boolean] {
		const guilds = this.client.users.cache.size

		return ["Cached Users", guilds.toString(), true]
	}

	private get totalUsers(): [string, string, boolean] {
		const guilds = this.client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)

		return ["Total Users", guilds.toString(), true]
	}

	private get shardCount(): [string, string, boolean] {
		const shards = this.client.ws.shards.size

		return ["Shard Count", shards.toString(), true]
	}
}
