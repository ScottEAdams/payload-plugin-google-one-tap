import React from 'react'
import {useHistory} from 'react-router-dom'
import {GoogleLogin} from '@react-oauth/google'
import {useAuth, useConfig} from 'payload/components/utilities'

export enum GType {
    standard = 'standard',
    icon = 'icon'
}

export enum GTheme {
    outline = 'outline',
    filled_blue = 'filled_blue',
    filled_black = 'filled_black'
}

export enum GSize {
    large = 'large',
    medium = 'medium',
    small = 'small'
}

export enum GText {
    signin_with = 'signin_with',
    signup_with = 'signup_with',
    continue_with = 'continue_with',
    signin = 'signin'
}

export enum GShape {
    rectangular = 'rectangular',
    pill = 'pill',
    circle = 'circle',
    square = 'square'
}

export enum GAlignment {
    left = 'left',
    center = 'center'
}

export enum GUxMode {
    popup = 'popup',
    redirect = 'redirect'
}

export interface GoogleOneTapButtonProps {
    type?: GType
    theme?: GTheme
    size?: GSize
    text?: GText
    shape?: GShape
    logo_alignment?: GAlignment
    width?: string | undefined
    locale?: string | undefined
    useOneTap?: boolean
    auto_select?: boolean
    ux_mode?: GUxMode
}

interface sucecssJson {
    token?: string
}

const GoogleOneTapButton = (props?: GoogleOneTapButtonProps) => {
    return () => {
        const {
            type = GType.standard,
            theme = GTheme.outline,
            size = GSize.large,
            text = GText.signin_with,
            shape = GShape.rectangular,
            logo_alignment = GAlignment.left,
            width = undefined,
            locale = undefined,
            useOneTap = true,
            auto_select = false,
            ux_mode = GUxMode.popup
        } = props || {}
        const {setToken} = useAuth()
        const {
            routes: {admin}
        } = useConfig()
        const history = useHistory()

        const onSuccess = (data: sucecssJson) => {
            if (data.token) {
                setToken(data.token)
                history.push(admin)
            }
        }

        return (
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: 30}}>
                <GoogleLogin
                    type={type}
                    theme={theme}
                    size={size}
                    text={text}
                    shape={shape}
                    logo_alignment={logo_alignment}
                    width={width}
                    locale={locale}
                    useOneTap={useOneTap}
                    auto_select={auto_select}
                    ux_mode={ux_mode}
                    onSuccess={async (credentialResponse) => {
                        try {
                            const response = await fetch(
                                `${window.location.protocol}//${window.location.host}/oauth2/callback/google`,
                                {
                                    method: 'POST',
                                    body: JSON.stringify(credentialResponse),
                                    headers: {'Content-type': 'application/json; charset=UTF-8'}
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
                />
            </div>
        )
    }
}

export default GoogleOneTapButton
