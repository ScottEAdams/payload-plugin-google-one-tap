/**
 * Credit to https://github.com/MomenSherif/react-oauth
 */
import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GoogleOneTapProvider = ({ children }) => {
	return (
		<GoogleOAuthProvider clientId={process.env.PAYLOAD_PUBLIC_GOOGLE_CLIENT_ID}>
			{children}
		</GoogleOAuthProvider>
	)
}

export default GoogleOneTapProvider
