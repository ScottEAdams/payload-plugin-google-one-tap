import crypto from 'crypto'

export const makeRandomPassword = (length = 20) => {
	const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
	return Array.from(crypto.randomFillSync(new Uint32Array(length)))
		.map((x) => characters[x % characters.length])
		.join('')
}
