import finalise from './finalise'

const GoogleOneTapEndpoint = {
	path: '/oauth2/callback/google',
	method: 'post',
	root: true,
	handler: async (req, res) => {
		req.payload.authenticate(req, res, () => {
			if (req?.user) {
				const final = finalise(req, res)
				return final.res.status(200).send({ token: final.token })
			}
			return res.status(401).send({ message: 'Unauthorized' })
		})
	}
}

export default GoogleOneTapEndpoint
