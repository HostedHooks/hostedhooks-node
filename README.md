# HostedHooks Nodejs Library

A Nodejs library for [HostedHooks](https://www.hostedhooks.com),  a Webhooks as a Service Platform.

## Installation

```bash
npm install --save hostedhooks-node
```

## How it works

### Import

```js
// CommonJS
const { HostedHooks } = require("hostedhooks-node")

// ESM
import { HostedHooks } from "hostedhooks-node"
```

### Authentication

Create an object with your API key that is [found here](https://www.hostedhooks.com/settings/account).

```js
const client = new HostedHooks("HOSTEDHOOKS_API_KEY")
```

### Get one record

```js
client.get_endpoint("endpoint_uuid")
```
    


### Get a collection of records

```js
client.list_subscriptions("app_uuid")
```

### Create a record

```js
client.create_app({ name: "Test App Name" })
```

### Update a record

```js
client.update_app("app_uuid", { name: "Test App Name" })
```

## Resources

* Apps
* Subscriptions
* Endpoints
* Webhook Events
* Messages


## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/[USERNAME]/hostedhooks-node. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/HostedHooks/hostedhooks-node/blob/master/CODE_OF_CONDUCT.md).

## Code of Conduct

Everyone interacting in the Hostedhooks Nodejs project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/HostedHooks/hostedhooks-node/blob/master/CODE_OF_CONDUCT.md).

## License
The library is available as open source under the terms of the MIT License.