import { CustomListener } from "../../classes/listener"

export default class extends CustomListener {
	public exec(info: string) {
		if (!info.includes("Heartbeat")) console.debug(info)
	}
}
