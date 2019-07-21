import { basename } from "path"
import { getPath } from "./utilities"
import { Listener, ListenerOptions } from "discord-akairo"

export class CustomListener extends Listener {
	public constructor(options?: ListenerOptions) {
		const path = getPath(module)
		const filename = path.name
		const foldername = basename(path.dir)
		super(filename, { event: filename, emitter: foldername, ...options })
	}
}
