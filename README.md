# payload-plugin-google-one-tap

Adds google-one-tap functionality to the login page.

You will need your google credentials as environment variables:
```dotenv
PAYLOAD_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-secret
```


```js
    admin: {
		user: Users.slug,
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
	},
```