import tinycolor, { random, TinyColor } from "@ctrl/tinycolor"
import { CollectorFilter, Message, MessageEmbed } from "discord.js"
import { CustomCommand } from "../../classes/command"

export default class extends CustomCommand {
	public constructor() {
		super({
			aliases: ["change", "color", "colour", "hex"],
			args: [{
				id: "color",
				type: (_, phrase) => tinycolor(phrase ? phrase : random()),
				match: "content",
			}],
			channel: "guild",
			clientPermissions: ["ADD_REACTIONS", "MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"],
			description: {
				help: "Randomly select or input a value for your role color",
				args: "(hex/rgb/hsl/hsv/css)",
			},
		})
	}

	public async exec(message: Message, { color }: { color: TinyColor }) {
		// Akairo's clientPermissions checks roles and channel overwrites.
		// MANAGE_ROLES has a seperate use on channels than roles, this only checks roles.
		if (!message.guild!.me!.permissions.has("MANAGE_ROLES")) {
			await message.util!.send("I am missing permissions MANAGE_ROLES", { embed: undefined })
			return
		}

		const roleSetting: string | undefined = this.client.settings.get(message.guild!.id, "role", undefined)
		if (roleSetting) {
			if (roleSetting === "disabled") {
				await message.util!.send([
					"Hex has been disabled for reaching the role limit,",
					"Please set a role with `h!role @role`",
				], { embed: undefined })
				return
			}

			const role = message.guild!.roles.cache.get(roleSetting)
			if (role && !message.member!.roles.cache.has(role.id)) {
				await message.util!.send(`You don't have ${role.name}`, { embed: undefined })
				return
			}
		}

		if (message.guild!.roles.cache.size >= 250) {
			void this.client.settings.set(message.guild!.id, "role", "disabled")

			const roles = message.guild!.roles.cache.filter(r => r.name.startsWith("USER-"))
			for (const role of roles.values()) await role.delete()

			await message.util!.send([
				"This guild has reached the role limit (250)",
				"All Hex roles have been removed and Hex has been disabled",
				"Please select a role with `h!role @role` to re-enable Hex",
				"This restricts Hex to a subset of users",
			], { embed: undefined })

			return
		}

		if (!color.isValid) {
			await message.util!.send("Invalid input", { embed: undefined })
			return
		}

		while (true) {
			// Discord doesn't like pure black or white
			if (color.toHex() === "000000") {
				color = tinycolor("000001")
			} else if (color.toHex() === "ffffff") {
				color = tinycolor("fffffe")
			}

			const hex = color.toHex().toUpperCase()
			const embed = new MessageEmbed()
				.setFooter("Would you like this?")
				.setColor(hex)
				.setImage(`https://dummyimage.com/150x50/${hex}/000000&text=${hex}`)
			const response = await message.util!.send(embed)

			const reactions = ["🔄", "⬆️", "⬇️", "🧭", "✅", "❌"]
			const filter: CollectorFilter = (reaction, user): boolean =>
				reactions.includes(reaction.emoji.name) && user === message.author
			const promise = response.awaitReactions(filter, { time: 1000 * 60, max: 1 })

			reactions.forEach(r => response.react(r))

			const reaction = (await promise).first()
			if (!reaction) {
				response.reactions.removeAll().catch(console.error)

				await message.util!.send("Time ran out", { embed: undefined })
				return
			}

			if (reaction.emoji.name === "🔄") {
				color = random()
				continue // Iterate loop with random
			}

			if (reaction.emoji.name === "⬆️") {
				color = color.brighten()
				continue // Iterate loop with brighten
			}

			if (reaction.emoji.name === "⬇️") {
				color = color.darken()
				continue // Iterate loop with darken
			}

			if (reaction.emoji.name === "🧭") {
				color = color.complement()
				continue // Iterate loop with complement
			}

			if (reaction.emoji.name === "❌") {
				response.reactions.removeAll().catch(console.error)

				await message.util!.send("Canceled", { embed: undefined })
				return // Stop code here
			}

			if (reaction.emoji.name === "✅") {
				response.reactions.removeAll().catch(console.error)
				break // Exit loop, continue below
			}
		}

		const managedRole = message.guild!.me!.roles.cache.find(r => r.managed)
		const highestRole = message.guild!.me!.roles.highest
		const hex = color.toHex().toUpperCase()
		const data = {
			color: hex,
			name: `USER-${message.author.id}`,
			permissions: this.client.isOwner(message.author) ? message.guild!.me!.permissions : [],
			position: managedRole ? managedRole.position : 0,
		}
		const role = message.guild!.roles.cache.find(r => r.name === data.name)
		const embed = new MessageEmbed()
			.setColor(hex)
			.setFooter("Changed")
			.setImage(`https://dummyimage.com/150x50/${hex}/000000&text=${hex}`)

		if (role) {
			if (role.position > highestRole.position) {
				await message.util!.send(`${role.name} is above ${highestRole.name}`, { embed: undefined })
				return
			}

			// Discord Bug: Positions are +1 when editing roles compared to creating
			await role.edit({ ...data, ...{ position: managedRole ? data.position - 1 : data.position } })
			if (!message.member!.roles.cache.has(role.id)) await message.member!.roles.add(role)
		} else {
			const hexRole = await message.guild!.roles.create(data)
			await message.member!.roles.add(hexRole)
		}

		await message.util!.send(embed)
	}
}
