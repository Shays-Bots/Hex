import { CustomCommand } from "../../classes/command"
import { Message, MessageEmbed } from "discord.js"
import fetch from "node-fetch"
import { inspect } from "util"

export default class extends CustomCommand {
	public constructor() {
		super({
			args: [{
				id: "code",
				match: "content",
			}],
		})
	}

	public async exec(message: Message, { code }: { code: string }): Promise<Message | Message[]> {
		if (!code) return message.util!.send("No code provided")

		let body
		try {
			body = await eval(code) // eslint-disable-line no-eval
			if (!(body instanceof String)) body = inspect(body)
			body = body.replace(this.client.token!, "[REDACTED]")

			if (body.length > 1024) {
				const { key } = await fetch("https://paste.nomsy.net/documents", { body, method: "post" }).then(res => res.json())
				body = `[Paste](https://paste.nomsy.net/${key as string})`
			} else {
				body = this.multiline(body)
			}
		} catch (error) {
			body = this.multiline(error.message)
		}

		const embed = new MessageEmbed()
			.setTitle("Eval")
			.addField("Input 📥", this.multiline(code))
			.addField("📤 Output", body)
			.setColor(6345206)

		return message.util!.send(embed)
	}

	private multiline(input: string): string {
		return `\`\`\`${input.replace("`", " ̀")}\`\`\``
	}
}
