import { Command } from "discord-akairo"
import { CustomListener } from "../../classes/listener"
import { Message } from "discord.js"

export default class extends CustomListener {
	public async exec(message: Message, _: Command, type: string, missing: string): Promise<void> {
		const person = type === "client" ? "I am" : type === "user" ? "You are" : type
		await message.util!.send(`${person} missing permissions ${missing}`, { embed: undefined })
	}
}
