import { CustomCommand } from "../../classes/command"
import { Message, StringResolvable } from "discord.js"

export default class extends CustomCommand {
	public constructor() {
		super({
			args: [{
				id: "newPrefix",
			}],
			channel: "guild",
			description: {
				help: "Customize the bots activation prefix",
				args: "(new prefix)",
			},
		})
	}

	public async exec(message: Message, { newPrefix }: { newPrefix?: string }): Promise<Message | Message[]> {
		const prefixSetting: string = this.client.settings.get(message.guild!.id, "prefix", "h!")

		let content: StringResolvable
		if (newPrefix) {
			if (message.member!.permissions.has("ADMINISTRATOR") || message.member! === message.guild!.owner!) {
				void this.client.settings.set(message.guild!.id, "prefix", newPrefix)

				content = `Updated prefix to ${newPrefix}`
			} else {
				content = "You do not have permission to change the bot prefix"
			}
		} else {
			content = [
				`Current prefix is ${prefixSetting}`,
				`Type \`${prefixSetting}prefix (new prefix)\` to change the prefix`,
			]
		}

		return message.util!.send(content, { embed: undefined })
	}
}
