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
import googleOneTap from 'payload-plugin-google-one-tap'

export default buildConfig({
    ...
    plugins: [googleOneTap()],
    ...
})
```

This package uses the following libraries:

https://github.com/MomenSherif/react-oauth

https://github.com/Genially/passport-google-one-tap

You will need to add the following webpack config:

```js
    admin: {
		webpack: (config) => ({
			...config,
			resolve: {
				...config.resolve,
				fallback: {
					...config.resolve.fallback,
					util: require.resolve('util'),
					stream: require.resolve('stream-browserify'),
					fs: false,
					url: false,
					querystring: false,
					child_process: false,
					assert: false,
					tls: false,
					net: false,
					os: false
				}
			}
		})
	}
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

