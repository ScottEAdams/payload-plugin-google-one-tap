import { GoogleOneTapStrategy as GOTStrategy } from 'passport-google-one-tap'
import { Payload } from 'payload'
import { Forbidden, LockedAuth } from 'payload/errors'
import { PayloadRequest } from 'payload/types'

import { makeRandomPassword } from './utils'

interface GoogleOneTapStrategyOptionWithRequest {
	clientID?: string
	clientSecret?: string
	verifyCsrfToken?: boolean
	passReqToCallback: true
}

const GoogleOneTapStrategy = ({ config, collections }: Payload) => {
	const opts: GoogleOneTapStrategyOptionWithRequest = {
		clientID: process.env.PAYLOAD_PUBLIC_GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		verifyCsrfToken: false,
		passReqToCallback: true
	}

	return new GOTStrategy(opts, async (req: PayloadRequest, profile, done) => {
		if (req.user) {
			done(null, req.user)
		}

		const email = profile?.emails?.[0]?.value
		if (!email) {
			done(Forbidden, false)
		}

		try {
			const userCollection = collections[config.admin.user]
			const collectionConfig = userCollection.config
			const slug = collectionConfig.slug

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore Improper typing in library, additional args should be optional
			let userDoc = await userCollection.Model.findByUsername(email)

			const isLocked = (date: number): boolean => !!(date && date > Date.now())
			if (userDoc && isLocked(userDoc.lockUntil)) {
				throw new LockedAuth()
			}

			if (!userDoc) {
				const password = makeRandomPassword(10)
				userDoc = await req.payload.create({
					req,
					collection: slug,
					data: { email: profile.emails[0].value, password: password, _verified: true }
				})
			}

			if (userDoc) {
				userDoc.collection = slug
				userDoc._strategy = 'google-one-tap'
				done(null, userDoc)
			} else {
				done(null, false)
			}
		} catch (err) {
			done(err, false)
		}
	})
}

export default GoogleOneTapStrategy
