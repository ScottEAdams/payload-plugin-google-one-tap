/**
 * Credit to https://github.com/MomenSherif/react-oauth
 */
import React, { ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

interface Props {
	children?: ReactNode
}

const GoogleOneTapProvider = ({ children }: Props) => {
	return (
		<GoogleOAuthProvider clientId={process.env.PAYLOAD_PUBLIC_GOOGLE_CLIENT_ID || ''}>
			{children}
		</GoogleOAuthProvider>
	)
}

export default GoogleOneTapProvider
