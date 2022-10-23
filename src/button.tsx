import React from 'react'
import { useHistory } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth, useConfig } from 'payload/components/utilities'

const GoogleOneTapButton = () => {
	const { setToken } = useAuth()
	const {
		routes: { admin }
	} = useConfig()
	const history = useHistory()

	const onSuccess = (data) => {
		if (data.token) {
			setToken(data.token)
			history.push(admin)
		}
	}

	return (
		<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
			<GoogleLogin
				theme='filled_black'
				onSuccess={async (credentialResponse) => {
					try {
						const response = await fetch(
							`${window.location.protocol}//${window.location.host}/oauth2/callback/google`,
							{
								method: 'POST',
								body: JSON.stringify(credentialResponse),
								headers: { 'Content-type': 'application/json; charset=UTF-8' }
							}
						)
						const authed = await response.json()
						onSuccess(authed)
					} catch (e) {
						console.error(e)
					}
				}}
				onError={() => {
					console.error('Login Failed')
				}}
				useOneTap
			/>
		</div>
	)
}

export default GoogleOneTapButton
