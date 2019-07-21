import { Command, CommandOptions } from "discord-akairo"
import { basename } from "path"
import { getPath } from "./utilities"

export class CustomCommand extends Command {
	public constructor(options?: CommandOptions) {
		const path = getPath(module)
		const filename = path.name
		const foldername = basename(path.dir)
		super(filename, { aliases: [filename], clientPermissions: ["EMBED_LINKS"], ownerOnly: foldername === "private", ...options })
	}
}
