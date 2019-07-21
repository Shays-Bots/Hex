import { AkairoClient, AkairoOptions, CommandHandler, ListenerHandler, SequelizeProvider } from "discord-akairo"
import { ClientOptions, Intents } from "discord.js"
import { DataTypes, Sequelize } from "sequelize"

if (!process.env.DATABASE_URI) throw new Error("DATABASE_URI not provided")
const sequelize = new Sequelize(process.env.DATABASE_URI)

export default class CustomClient extends AkairoClient {
	public commandHandler: CommandHandler
	public listenerHandler: ListenerHandler
	public settings: SequelizeProvider
	public constructor() {
		super({
			ownerID: "358558305997684739",
			shards: "auto",
			messageCacheMaxSize: 10,
			messageCacheLifetime: 60,
			messageSweepInterval: 60 * 30,
			allowedMentions: { parse: ["users"] },
			presence: {
				activity: {
					type: "PLAYING",
					name: "with Rainbows",
				},
			},
			intents: Intents.NON_PRIVILEGED,
		} as AkairoOptions & ClientOptions)

		this.commandHandler = new CommandHandler(this, {
			directory: "./src/commands/",
			automateCategories: true,
			prefix: m => m.guild ? this.settings.get(m.guild.id, "prefix", "h!") : "h!",
			handleEdits: true,
			storeMessages: true,
			commandUtil: true,
		})

		this.listenerHandler = new ListenerHandler(this, {
			directory: "./src/listeners/",
			automateCategories: true,
		})

		this.settings = new SequelizeProvider(sequelize.define("Guild", {
			prefix: {
				allowNull: false,
				defaultValue: "h!",
				type: DataTypes.STRING,
			},
			role: {
				allowNull: false,
				defaultValue: "everyone",
				type: DataTypes.STRING,
			},
		  }), {
			idColumn: "guild_id",
			dataColumn: "settings",
		})
	}

	public async login(token?: string) {
		await sequelize.sync()

		this.commandHandler.useListenerHandler(this.listenerHandler)
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
		})
		this.listenerHandler.loadAll()
		this.commandHandler.loadAll()

		return super.login(token)
	}
}
