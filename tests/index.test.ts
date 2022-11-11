import fetch from "cross-fetch"
import { HostedHooks } from "../src"

jest.mock("cross-fetch")

function mockFetch(data: any) {
	const mockedFetch = fetch as jest.MockedFunction<typeof fetch>

	mockedFetch.mockImplementation(() => {
		return Promise.resolve({
			json: () => Promise.resolve(data),
		} as Response)
	})
}

describe("HostedHooks Client", function () {
	const client = new HostedHooks("api-key")

	// Apps
	it("list all apps", async () => {
		const response = getExpectedAppsResponse()

		mockFetch(response)

		const apps = await client.list_apps()

		expect(apps).toEqual(response)
	})

	it("creates an app", async () => {
		const response = getExpectedAppsResponse()[0]

		mockFetch(response)

		const app = await client.create_app({ name: "ABC SaaS" })

		expect(app.name).toEqual(response.name)
	})

	it("updates an app", async () => {
		const response = getExpectedAppsResponse()[0]

		mockFetch(response)

		const app = await client.update_app(response.id, { name: "XYZ SaaS" })

		expect(app.name).toEqual(response.name)
	})

	// Subscriptions
	it("gets details of a subscription of an app", async () => {
		const response = getExpectedSubscriptionsResponse()[0]

		mockFetch(response)

		const subscription = await client.get_subscription("bd8ba9a4-05a3-4592-838c-4f98bc92e84f")

		expect(subscription).toEqual(response)
	})

	it("list all subscriptions of an app", async () => {
		const response = getExpectedSubscriptionsResponse()

		mockFetch(response)

		const subscriptions = await client.list_subscriptions("bd8ba9a4-05a3-4592-838c-4f98bc92e84f")

		expect(subscriptions).toEqual(response)
	})

	it("creates a subscription of an app", async () => {
		const response = getExpectedSubscriptionsResponse()[0]

		mockFetch(response)

		const subscription = await client.create_subscription("bd8ba9a4-05a3-4592-838c-4f98bc92e84f", {
			name: "New Subscriber Company",
		})

		expect(subscription).toEqual(response)
	})

	// Endpoints
	it("lists all endpoints for an app", async () => {
		const response = getExpectedEndpointsResponse()

		mockFetch(response)

		const endpoints = await client.list_endpoints("bd8ba9a4-05a3-4592-838c-4f98bc92e84f")

		expect(endpoints).toEqual(response)
	})

	it("gets details of an endpoint", async () => {
		const response = getExpectedEndpointsResponse()[0]

		mockFetch(response)

		const endpoint = await client.get_endpoint(
			"bd8ba9a4-05a3-4592-838c-4f98bc92e84f",
			"4fc8e1f4-2d49-46ee-99a2-c8b942dd4c59"
		)

		expect(endpoint).toEqual(response)
	})

	it("creates a new endpoint for a subscription", async () => {
		const response = getExpectedEndpointsResponse()[0]

		mockFetch(response)

		const endpoint = await client.create_endpoint("c17f9d4f-52cd-4819-a0b3-e7b5ad68b761", {
			url: "https://wwww.companyabc.com/webhooks",
			version: "1.0",
			status: "active",
			description: "Endpoint description",
		})

		expect(endpoint).toEqual(response)
	})

	// Webhook Events
	it("lists webhook events for an app", async () => {
		const response = getExpectedWebhookEventsResponse()

		mockFetch(response)

		const webhookEvents = await client.list_webhook_events("bd8ba9a4-05a3-4592-838c-4f98bc92e84f")

		expect(webhookEvents).toEqual(response)
	})

	// Messages
	it("creates a message of an app", async () => {
		const response = getExpectedMessageResponse()

		mockFetch(response)

		const message = await client.create_app_message("bd8ba9a4-05a3-4592-838c-4f98bc92e84f", {
			data: {
				foo: "bar",
			},
			event_type: "user.created",
			version: "1.0",
			event_id: "12323124151",
			override_payload: false,
		})

		expect(message).toEqual(response)
	})

	it("creates a message of a subscription", async () => {
		const response = getExpectedMessageResponse()

		mockFetch(response)

		const message = await client.create_subscription_message(
			"a2c12bd6-e147-4a28-aba6-e031345895ab",
			{
				data: {
					foo: "bar",
				},
				event_type: "user.created",
				version: "1.0",
				event_id: "12323124151",
				override_payload: false,
			}
		)

		expect(message).toEqual(response)
	})

	it("creates a message of an endpoint", async () => {
		const response = getExpectedMessageResponse()

		mockFetch(response)

		const message = await client.create_endpoint_message(
			"a2c12bd6-e147-4a28-aba6-e031345895ab",
			"cc05a5a1-7c34-43e6-ae89-bca473d0a828",
			{
				data: {
					foo: "bar",
				},
				event_type: "user.created",
				version: "1.0",
				event_id: "12323124151",
				override_payload: false,
			}
		)

		expect(message).toEqual(response)
	})

	// Webhook attempts
	it("gets a webhook attempt of an endpoint", async () => {
		const response = getExpectedWebhookAttemptsResponse()[0]

		mockFetch(response)

		const webhookAttempt = await client.get_webhook_attempt(
			"bd8ba9a4-05a3-4592-838c-4f98bc92e84f",
			"4fc8e1f4-2d49-46ee-99a2-c8b942dd4c59"
		)

		expect(webhookAttempt).toEqual(response)
	})

	it("lists all webhook attempts of an app", async () => {
		const response = getExpectedWebhookAttemptsResponse()

		mockFetch(response)

		const webhookAttempts = await client.list_webhook_attempts(
			"bd8ba9a4-05a3-4592-838c-4f98bc92e84f"
		)

		expect(webhookAttempts).toEqual(response)
	})
})

function getExpectedAppsResponse() {
	return [
		{
			id: "f004639d-a393-45fa-96bc-0b476900c5fb",
			name: "ABC SaaS",
			created_at: "2022-11-11T15:00:54.460-05:00",
		},
	]
}

function getExpectedSubscriptionsResponse() {
	return [
		{
			id: "c17f9d4f-52cd-4819-a0b3-e7b5ad68b761",
			subscriber_name: "New Subscriber Company",
			created_at: "2021-03-29T10:03:09.717-04:00",
			app: {
				id: "bd8ba9a4-05a3-4592-838c-4f98bc92e84f",
				name: "Super Cool SaaS",
				created_at: "2021-03-27T10:07:17.540-04:00",
			},
		},
	]
}

function getExpectedEndpointsResponse() {
	return [
		{
			id: "4fc8e1f4-2d49-46ee-99a2-c8b942dd4c59",
			url: "https://wwww.companyabc.com/webhooks",
			description: "Endpoint description",
			version: "1.0",
			status: "active",
			error_rate: 50.0,
			created_at: "2021-03-29T20:57:19.128-04:00",
			webhook_events: [
				{
					id: "1a8833ae-7d02-4855-b7fa-53d4aa7ef7f7",
					event_type: "user.created",
					created_at: "2021-03-27T10:07:17.608-04:00",
				},
			],
			subscription: {
				id: "c17f9d4f-52cd-4819-a0b3-e7b5ad68b761",
				subscriber_name: "New Subscriber Company",
				created_at: "2021-03-29T10:03:09.717-04:00",
			},
		},
	]
}

function getExpectedWebhookEventsResponse() {
	return [
		{
			id: "9fe10e24-455a-4089-b62d-539d46fa9302",
			event_type: "user.created",
			created_at: "2021-03-23T08:19:38.943-04:00",
			app: {
				id: "bd8ba9a4-05a3-4592-838c-4f98bc92e84f",
				name: "Super Cool SaaS",
				created_at: "2021-03-27T10:07:17.540-04:00",
			},
		},
	]
}

function getExpectedMessageResponse() {
	return {
		id: "a2c12bd6-e147-4a28-aba6-e031345895ab",
		data: {
			foo: "bar",
		},
		event_type: "user.created",
		version: "1.0",
		event_id: "12323124151",
		override_payload: false,
		created_at: "2021-03-23T08:19:38.943-04:00",
	}
}

function getExpectedWebhookAttemptsResponse() {
	return [
		{
			id: "c1d07a06-329b-4765-906a-5dcbe78653d8",
			status_code: "200",
			retry_status: null,
			status_message: "success",
			payload: {
				type: "user.updated",
				version: "1.0",
				created: "2022-09-09T14:56:38.635-04:00",
				data: {
					id: 123123123,
					note: "this is a test",
					other_id: 1231231123,
				},
			},
			response: null,
			error_message: "",
			app_id: "9739ed9e-9f18-45a8-8895-dea25ac5ec93",
			endpoint_id: "9f88c3c0-8ea5-4bec-8fc8-ca29c5036a3c",
			message_id: "5143dec9-a2d2-4aa6-a1b6-2e3168d4c620",
			created_at: "2022-09-09T14:56:45.105-04:00",
		},
	]
}
