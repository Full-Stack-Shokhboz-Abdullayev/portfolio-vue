import { getWithExpiry } from '../jsComponents/localStorageExpire'
// import store from '@/store/index'

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

					// Credentials: 'include'
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
		} catch {
			console.log('Problem Occured')
		}
		// if (!data.success && options.requiresAuth) {
		// 	store.dispatch('Auth/logout')
		// }
	}

	data = await data.json()
	const returningData = data.data ? data.data : data
	console.log(returningData)
	console.log('Sucess: ', data.success)
	return returningData
}
