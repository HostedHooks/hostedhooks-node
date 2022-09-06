import fetch from "cross-fetch"

type App = {
	id: string
	name: string
	created_at: string
}

type Subscription = {
	id: string
	subscriber_name: string
	created_at: string
	app: App
}

type WebhookEvent = {
	id: string
	event_type: string
	created_at: string
}

type Endpoint = {
	id: string
	url: string
	description: string
	version: string
	status: "active" | "inactive"
	created_at: string
	webhook_events: WebhookEvent[]
	subscription: {
		id: string
		subscriber_name: string
		created_at: string
	}
}

type Message = {
	id: string
	data: {}
	event_type: string
	version: string
	event_id: string
	override_payload: false
	created_at: string
}

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

type Error = {
	error: string
	code: number
}

export class HostedHooks {
	private baseUrl = "https://hostedhooks.com/api/v1"
	private apiKey: string

	constructor(apiKey?: string) {
		this.apiKey = (apiKey ?? process.env.HOSTEDHOOKS_API_KEY) as string
	}

	private async get<T>(url: string): Promise<T> {
		try {
			const response = await fetch(`${this.baseUrl}${url}`, {
				method: "GET",
				headers: { Authorization: `Bearer ${this.apiKey}` },
			})
			const json = await response.json()

			if (response.status >= 400) {
				throw {
					error: json.error,
					code: response.status,
				}
			}
			return json
		} catch (err) {
			throw err
		}
	}
	private async post<T>(url: string, params = {}): Promise<T> {
		try {
			const response = await fetch(`${this.baseUrl}${url}`, {
				method: "POST",
				body: JSON.stringify(params),
				headers: { Authorization: `Bearer ${this.apiKey}` },
			})
			const json = await response.json()

			if (response.status >= 400) {
				throw {
					error: json.error,
					code: response.status,
				}
			}
			return json
		} catch (err) {
			throw err
		}
	}
	private async patch<T>(url: string, params = {}): Promise<T> {
		try {
			const response = await fetch(`${this.baseUrl}${url}`, {
				method: "PATCH",
				body: JSON.stringify(params),
				headers: { Authorization: `Bearer ${this.apiKey}` },
			})
			const json = await response.json()

			if (response.status >= 400) {
				throw {
					error: json.error,
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
		return this.get<App[]>("/apps")
	}
	public async create_app(params: { name: string }) {
		return this.post<App>("/apps", params)
	}
	public async update_app(uuid: string, params: { name: string }) {
		return this.patch<App>(`/apps${uuid}`, params)
	}

	// Subscriptions
	public async get_subscription(uuid: string) {
		return this.get<Subscription>(`/subscriptions${uuid}`)
	}
	public async list_subscriptions(app_uuid: string) {
		return this.get<Subscription[]>(`/apps/${app_uuid}/subscriptions`)
	}
	public async create_subscription(app_uuid: string, params: { name: string }) {
		return this.post<Subscription>(`/apps/${app_uuid}/subscriptions`, params)
	}

	// Endpoints
	public async get_endpoint(app_uuid: string, endpoint_uuid: string) {
		return this.get<Endpoint>(`/apps/${app_uuid}/endpoints/${endpoint_uuid}`)
	}
	public async list_endpoints(app_uuid: string) {
		return this.get<Endpoint[]>(`/apps/${app_uuid}/endpoints`)
	}
	public async create_endpoint(subscription_uuid: string, params: CreateEndpointParams) {
		return this.post<Endpoint>(`/subscriptions/${subscription_uuid}/endpoints`, params)
	}
	public async update_endpoint(
		subscription_uuid: string,
		endpoint_uuid: string,
		params: UpdateEndpointParams
	) {
		return this.patch<Endpoint>(
			`/subscriptions/${subscription_uuid}/endpoints/${endpoint_uuid}`,
			params
		)
	}

	// Webhook Events
	public async list_webhook_events(app_uuid: string) {
		return this.get<WebhookEvent[]>(`/apps/${app_uuid}/webhook_events`)
	}

	// Messages
	public async create_app_message(app_uuid: string, params: CreateMessageParams) {
		return this.post<Message>(`/apps/${app_uuid}/messages`, params)
	}
	public async create_subscription_message(subscription_uuid: string, params: CreateMessageParams) {
		return this.post<Message>(`/subscriptions/${subscription_uuid}/messages`, params)
	}
	public async create_endpoint_message(
		subscription_uuid: string,
		endpoint_uuid: string,
		params: CreateMessageParams
	) {
		return this.post<Message>(
			`/subscriptions/${subscription_uuid}/endpoints/${endpoint_uuid}/messages`,
			params
		)
	}
}
