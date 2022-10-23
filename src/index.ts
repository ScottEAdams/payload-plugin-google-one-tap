import { Config } from 'payload/config'

import GoogleOneTapButton from './button'
import GoogleOneTapEndpoint from './endpoint'
import GoogleOneTapProvider from './provider'
import GoogleOneTapStrategy from './strategy'
import { addBeforeLogin, addEndpointsToConfig, addProvider, addStrategyToCollection } from './utils'

const googleOneTap =
	() =>
	(incomingConfig: Config): Config => {
		let config: Config = {
			...incomingConfig
		}

		// add the strategy
		const userSlug = config.admin.user

		config.collections = config?.collections?.map((collectionConfig) => {
			if (collectionConfig.slug === userSlug) {
				const strategy = { strategy: GoogleOneTapStrategy, name: 'google-one-tap' }
				collectionConfig = addStrategyToCollection(collectionConfig, strategy)
			}
			return collectionConfig
		})

		// add the endpoint
		config = addEndpointsToConfig(config, GoogleOneTapEndpoint)

		// add the components
		config = addBeforeLogin(config, GoogleOneTapButton)
		config = addProvider(config, GoogleOneTapProvider)

		return config
	}

export default googleOneTap
