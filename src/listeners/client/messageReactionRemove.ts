import { CustomListener } from "../../classes/listener"
import { MessageReaction, User } from "discord.js"

export default class extends CustomListener {
	public exec(messageReaction: MessageReaction, user: User): void {
		if (["🔄", "⬆️", "⬇️", "🧭"].includes(messageReaction.emoji.name)) {
			this.client.emit("messageReactionAdd", messageReaction, user)
		}
	}
}
