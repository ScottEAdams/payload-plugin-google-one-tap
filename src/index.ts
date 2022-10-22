import { Config } from 'payload/config'

import GoogleOneTapButton from './button'
import GoogleOneTapEndpoint from './endpoint'
import GoogleOneTapProvider from './provider'
import GoogleOneTapStrategy from './strategy'

const googleOneTap =
	() =>
	(incomingConfig: Config): Config => {
		const config: Config = {
			...incomingConfig
		}

		// add the strategy
		const userSlug = config.admin.user

		config.collections = config?.collections?.map((collectionConfig) => {
			if (collectionConfig.slug === userSlug) {
				if (typeof collectionConfig?.auth === 'boolean') {
					collectionConfig.auth = {
						strategies: [{ strategy: GoogleOneTapStrategy, name: 'google-one-tap' }]
					}
				} else {
					collectionConfig.auth = {
						...collectionConfig.auth,
						strategies: [{ strategy: GoogleOneTapStrategy, name: 'google-one-tap' }]
					}
				}
			}
			return {
				...collectionConfig
			}
		})

		// add the endpoint
		const endpoints = config?.endpoints || []
		config.endpoints = [...endpoints, GoogleOneTapEndpoint]

		// add the components
		const before = config?.admin?.components?.beforeLogin || []
		const providers = config?.admin?.components?.providers || []
		if (!config?.admin?.components) {
			config.admin.components = {
				beforeLogin: [GoogleOneTapButton],
				providers: [GoogleOneTapProvider]
			}
		} else {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			config.admin.components.beforeLogin = [...before, GoogleOneTapButton]
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			config.admin.components.providers = [...providers, GoogleOneTapProvider]
		}

		return config
	}

export default googleOneTap
