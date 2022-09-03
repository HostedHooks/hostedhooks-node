import fetch from "cross-fetch"

type CreateEndpointParams = {
	url: string
	description?: string
	version: string
	status?: "active" | "inactive"
	enabled_events: string[] | "*"
}

type UpdateEndpointParams = Partial<CreateEndpointParams>

type CreateMessageParams = {
	event_type: string
	data: {}
	version: string
	event_id?: string
	override_payload?: boolean
}

export class HostedHooks {
	private baseUrl = "https://hostedhooks.com/api/v1"
	private apiKey: string

	constructor(apiKey?: string) {
		this.apiKey = (apiKey ?? process.env.HOSTEDHOOKS_API_KEY) as string
	}

	private async get(url: string): Promise<{}> {
		try {
			const response = await fetch(`${this.baseUrl}${url}`, {
				method: "GET",
				headers: { Authorization: `Bearer ${this.apiKey}` },
			})
			const json = await response.json()

			if (response.status >= 400) {
				return {
					error: json.message,
					code: response.status,
				}
			}
			return json
		} catch (err) {
			throw err
		}
	}
	private async post(url: string, params = {}): Promise<{}> {
		try {
			const response = await fetch(`${this.baseUrl}${url}`, {
				method: "POST",
				body: JSON.stringify(params),
				headers: { Authorization: `Bearer ${this.apiKey}` },
			})
			const json = await response.json()

			if (response.status >= 400) {
				return {
					error: json.message,
					code: response.status,
				}
			}
			return json
		} catch (err) {
			throw err
		}
	}
	private async patch(url: string, params = {}): Promise<{}> {
		try {
			const response = await fetch(`${this.baseUrl}${url}`, {
				method: "PATCH",
				body: JSON.stringify(params),
				headers: { Authorization: `Bearer ${this.apiKey}` },
			})
			const json = await response.json()

			if (response.status >= 400) {
				return {
					error: json.message,
					code: response.status,
				}
			}
			return json
		} catch (err) {
			throw err
		}
	}

	// Apps
	public async list_apps() {
		return this.get("/apps")
	}
	public async create_app(params: { name: string }) {
		return this.post("/apps", params)
	}
	public async update_app(uuid: string, params: { name: string }) {
		return this.patch(`/apps${uuid}`, params)
	}

	// Subscriptions
	public async get_subscription(uuid: string) {
		return this.get(`/subscriptions${uuid}`)
	}
	public async list_subscriptions(app_uuid: string) {
		return this.get(`/apps/${app_uuid}/subscriptions`)
	}
	public async create_subscription(app_uuid: string, params: { name: string }) {
		return this.post(`/apps/${app_uuid}/subscriptions`, params)
	}

	// Endpoints
	public async get_endpoint(app_uuid: string, endpoint_uuid: string) {
		return this.get(`/apps/${app_uuid}/endpoints/${endpoint_uuid}`)
	}
	public async list_endpoints(app_uuid: string) {
		return this.get(`/apps/${app_uuid}/endpoints`)
	}
	public async create_endpoint(subscription_uuid: string, params: CreateEndpointParams) {
		return this.post(`/subscriptions/${subscription_uuid}/endpoints`, params)
	}
	public async update_endpoint(
		subscription_uuid: string,
		endpoint_uuid: string,
		params: UpdateEndpointParams
	) {
		return this.patch(`/subscriptions/${subscription_uuid}/endpoints/${endpoint_uuid}`, params)
	}

	// Webhook Events
	public async list_webhook_events(app_uuid: string) {
		return this.get(`/apps/${app_uuid}/webhook_events`)
	}

	// Messages
	public async create_app_message(app_uuid: string, params: CreateMessageParams) {
		return this.post(`/apps/${app_uuid}/messages`, params)
	}
	public async create_subscription_message(subscription_uuid: string, params: CreateMessageParams) {
		return this.post(`/subscriptions/${subscription_uuid}/messages`, params)
	}
	public async create_endpoint_message(
		subscription_uuid: string,
		endpoint_uuid: string,
		params: CreateMessageParams
	) {
		return this.post(
			`/subscriptions/${subscription_uuid}/endpoints/${endpoint_uuid}/messages`,
			params
		)
	}
}
