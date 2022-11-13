import finalise from './finalise'
import { PayloadRequest } from 'payload/types'
import express, { Response } from 'express'
import { Endpoint } from 'payload/config'

const GoogleOneTapEndpoint: Endpoint = {
	path: '/oauth2/callback/google',
	method: 'post',
	root: true,
	handler: [
		express.json(),
		async (req: PayloadRequest, res: Response) => {
			req.payload.authenticate(req, res, () => {
				if (req?.user) {
					const final = finalise(req, res)
					return final.res.status(200).send({ token: final.token })
				}
				return res.status(401).send({ message: 'Unauthorized' })
			})
		}
	]
}

export default GoogleOneTapEndpoint
