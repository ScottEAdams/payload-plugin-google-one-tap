# payload-plugin-google-one-tap

Adds google-one-tap functionality to the login page.

## Installation

```
yarn add payload-plugin-google-one-tap
```

You will need to add your google credentials as environment variables:
```dotenv
PAYLOAD_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-secret
```

Then you can add the plugin to your payload.config:

```js
import { googleOneTap } from 'payload-plugin-google-one-tap'

export default buildConfig({
    ...
    plugins: [googleOneTap()],
    ...
})
```

This package uses the following libraries:

https://github.com/MomenSherif/react-oauth

https://github.com/Genially/passport-google-one-tap

And finally you will need to add the following to your server.ts file:
```js
const app = express()

app.use(express.json())
```

You can customise the login button if you like by passing in some props in your payload.config.ts. Heres the defaults:

```js
plugins: [
	googleOneTap({
		type: 'standard',
		theme: 'outline',
		size: 'large',
		text: 'signin_with',
		shape: 'rectangular',
		logo_alignment: 'left',
		width: undefined, // auto,
		locale: undefined,
		useOneTap: true,
		auto_select: false,
		ux_mode: 'popup'
	})
]
```

