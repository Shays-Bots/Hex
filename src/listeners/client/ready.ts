import { CustomListener } from "../../classes/listener"

export default class extends CustomListener {
	public exec() {
		console.log(`Logged in as ${this.client.user!.tag}`)
	}
}
