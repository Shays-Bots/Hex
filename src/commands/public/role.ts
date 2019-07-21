import { CustomCommand } from "../../classes/command"
import { Message, Role, StringResolvable } from "discord.js"

export default class extends CustomCommand {
	public constructor() {
		super({
			args: [{
				id: "newRole",
				type: "role",
			}],
			channel: "guild",
			description: {
				help: "Restrict the bot to only a group of members",
				args: "(new role or \"everyone\")",
			},
		})
	}

	public async exec(message: Message, { newRole }: { newRole?: Role }): Promise<Message | Message[]> {
		const roleSetting: string | undefined = this.client.settings.get(message.guild!.id, "role", undefined)
		const prefixSetting: string = this.client.settings.get(message.guild!.id, "prefix", "h!")

		let content: StringResolvable
		if (newRole) {
			if (message.member!.permissions.has("ADMINISTRATOR") || message.member! === message.guild!.owner!) {
				void this.client.settings.set(message.guild!.id, "role", newRole.id)

				content = `Updated role to ${newRole.toString()}`
			} else {
				content = "You do not have permission to change the roles"
			}
		} else {
			const oldRole = roleSetting ? message.guild!.roles.cache.get(roleSetting) : undefined
			content = [
				"When you set the role, it restricts the bot to people that have it, allowing Hex to act as a perk",
				`Current role is ${oldRole ? oldRole.name : message.guild!.roles.everyone.name}`,
				`Type \`${prefixSetting}role (new role)\` to change the role`,
			]
		}

		return message.util!.send(content, { embed: undefined })
	}
}
