import crypto from 'crypto'

import {
	ArrayField,
	BlockField,
	CheckboxField,
	CodeField,
	CollapsibleField,
	CollectionConfig,
	DateField,
	EmailField,
	Field,
	GroupField,
	NumberField,
	PointField,
	RadioField,
	RelationshipField,
	RichTextField,
	RowField,
	SelectField,
	TextareaField,
	TextField,
	UIField,
	UploadField
} from 'payload/types'
import { Config, Endpoint } from 'payload/config'
import React from 'react'

export const makeRandomPassword = (length = 20) => {
	const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
	return Array.from(crypto.randomFillSync(new Uint32Array(length)))
		.map((x) => characters[x % characters.length])
		.join('')
}

export const addStrategyToCollection = (collectionConfig: CollectionConfig, strategy: any) => {
	if (!collectionConfig?.auth || typeof collectionConfig.auth === 'boolean') {
		collectionConfig.auth = {}
	}
	const existingStrategies = collectionConfig?.auth?.strategies || []
	collectionConfig.auth.strategies = [...existingStrategies, strategy]
	return collectionConfig
}

export const addEndpointsToConfig = (config: Config, endpoint: Endpoint) => {
	const existingEndpoints = config?.endpoints || []
	config.endpoints = [...existingEndpoints, endpoint]
	return config
}

export const addBeforeLogin = (config: Config, component: React.ComponentType<any>) => {
	if (!config?.admin) {
		config.admin = {}
	}
	if (!config?.admin?.components) {
		config.admin.components = {}
	}
	const existingComponents = config?.admin?.components?.beforeLogin || []
	config.admin.components.beforeLogin = [...existingComponents, component]
	return config
}

export const ignoreServerOnlyModules = (config: Config) => {
	if (!config?.admin) {
		config.admin = {}
	}
	config.admin.webpack = (webpackConfig) => {
		const resolved = config.admin?.webpack?.(webpackConfig) || {}
		return {
			...resolved,
			resolve: {
				...resolved.resolve,
				alias: {
					...resolved.resolve?.alias,
					'google-auth-library': false,
					jsonwebtoken: false
				}
			}
		}
	}
	return config
}

export const addProvider = (config: Config, component: React.ComponentType<any>) => {
	if (!config?.admin) {
		config.admin = {}
	}
	if (!config?.admin?.components) {
		config.admin.components = {}
	}
	const existingComponents = config?.admin?.components?.providers || []
	config.admin.components.providers = [...existingComponents, component]
	return config
}

export const getCookieExpiration = (seconds = 7200) => {
	const currentTime = new Date()
	currentTime.setSeconds(currentTime.getSeconds() + seconds)
	return currentTime
}

const internalFields = ['__v', 'salt', 'hash']
export const sanitizeInternalFields = (incomingDoc: any) =>
	Object.entries(incomingDoc).reduce((newDoc, [key, val]) => {
		if (key === '_id') {
			return {
				...newDoc,
				id: val
			}
		}

		if (internalFields.indexOf(key) > -1) {
			return newDoc
		}

		return {
			...newDoc,
			[key]: val
		}
	}, {})

export const getFieldsToSign = (collectionConfig: any, user: any) => {
	type FieldWithSubFields = GroupField | ArrayField | RowField | CollapsibleField

	function fieldHasSubFields(field: Field): field is FieldWithSubFields {
		return (
			field.type === 'group' ||
			field.type === 'array' ||
			field.type === 'row' ||
			field.type === 'collapsible'
		)
	}

	function fieldIsPresentationalOnly(field: Field): field is UIField {
		return field.type === 'ui'
	}

	type FieldAffectingData =
		| TextField
		| NumberField
		| EmailField
		| TextareaField
		| CheckboxField
		| DateField
		| BlockField
		| GroupField
		| RadioField
		| RelationshipField
		| ArrayField
		| RichTextField
		| SelectField
		| UploadField
		| CodeField
		| PointField

	function fieldAffectsData(field: Field): field is FieldAffectingData {
		return 'name' in field && !fieldIsPresentationalOnly(field)
	}

	return collectionConfig.fields.reduce(
		(signedFields: any, field: Field) => {
			const result = {
				...signedFields
			}

			if (!fieldAffectsData(field) && fieldHasSubFields(field)) {
				field.fields.forEach((subField) => {
					if (fieldAffectsData(subField) && subField.saveToJWT) {
						result[subField.name] = user[subField.name]
					}
				})
			}

			if (fieldAffectsData(field) && field.saveToJWT) {
				result[field.name] = user[field.name]
			}

			return result
		},
		{
			email: user.email,
			id: user.id,
			collection: collectionConfig.slug
		}
	)
}
