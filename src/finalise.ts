import { CookieOptions } from 'express'
import jwt from 'jsonwebtoken'
import {
	ArrayField,
	BlockField,
	CheckboxField,
	CodeField,
	CollapsibleField,
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

const getCookieExpiration = (seconds = 7200) => {
	const currentTime = new Date()
	currentTime.setSeconds(currentTime.getSeconds() + seconds)
	return currentTime
}

const internalFields = ['__v', 'salt', 'hash']
const sanitizeInternalFields = (incomingDoc) =>
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

const finalise = (req, res) => {
	let user = req.user.toJSON({ virtuals: true })
	user = JSON.parse(JSON.stringify(user))
	user = sanitizeInternalFields(user)

	const collections = req.payload.collections
	const userCollection = collections[req.payload.config.admin.user]
	const collectionConfig = userCollection.config

	const fieldsToSign = collectionConfig.fields.reduce(
		(signedFields, field: Field) => {
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

	const token = jwt.sign(fieldsToSign, req.payload.secret, {
		expiresIn: collectionConfig.auth.tokenExpiration
	})

	const cookieOptions: CookieOptions = {
		path: '/',
		httpOnly: true,
		expires: getCookieExpiration(collectionConfig.auth.tokenExpiration),
		secure: collectionConfig.auth.cookies.secure,
		sameSite: collectionConfig.auth.cookies.sameSite,
		domain: undefined
	}

	if (collectionConfig.auth.cookies.domain) {
		cookieOptions.domain = collectionConfig.auth.cookies.domain
	}

	res.cookie(`payload-token`, token, cookieOptions)

	req.user = user

	return { req, res, token }
}

export default finalise
