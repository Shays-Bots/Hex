import { CustomListener } from "../../classes/listener"
import { GuildMember } from "discord.js"

export default class extends CustomListener {
	public async exec(member: GuildMember): Promise<void> {
		const role = member.guild.roles.cache.find(r => r.name === `USER-${member.id}`)
		if (role) await role.delete()
	}
}
