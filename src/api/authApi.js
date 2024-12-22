import { getFirebaseAuth } from "../core/utils/setUpFirebase";
import { delay } from "../core/utils/delay";

const auth = getFirebaseAuth()

export const login = async ({email, password}) => {
	if(!email || !password) {
		throw Error('No empty field!!!')
	}

	await delay(1000)
	return {email}
}