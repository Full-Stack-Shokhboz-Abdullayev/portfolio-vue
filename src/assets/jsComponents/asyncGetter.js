import { getWithExpiry } from '../jsComponents/localStorageExpire'

export default async (url, options = {}, afterWards = '') => {
	let _BASE

	if (process.env.NODE_ENV === 'production') {
		_BASE = 'https://shox-pro-backend.herokuapp.com/shox-api'
	} else {
		_BASE = 'http://localhost:7777/shox-api'
	}

	let data

	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}

	let apiObject
	let _id = ''

	if (options.get) {
		data = await fetch(_BASE + url)
	} else {
		if (options.post) {
			apiObject = {
				method: 'POST',
				headers: {
					...headers
				},

				body: JSON.stringify({ ...options.body })
			}
		} else if (options.put) {
			_id = options.id
			apiObject = {
				method: 'PUT',
				headers,
				body: JSON.stringify({ ...options.body })
			}
		} else if (options.delete) {
			_id = options.id

			apiObject = {
				method: 'DELETE',
				headers
			}
		}

		if (options.requiresAuth) {
			apiObject.headers = {
				...headers,
				Authorization: `Bearer ${getWithExpiry('jid256')}`
			}
		}
		try {
			data = await fetch(_BASE + url + `/${_id}` + afterWards, apiObject)
		} catch (err) {
			console.log(err)
		}
	}

	data = await data.json()
	const returningData = data.data ? data.data : data
	return returningData
}
