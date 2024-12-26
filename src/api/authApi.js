import { 
	collection, getDocs, where,
	query,
 } from "firebase/firestore";
import { delay } from "../core/utils/delay";
import { db } from "../core/utils/firebase";


export const login = async ({ email, password }) => {
	if (!email || !password) {
		throw Error('Hãy nhập đủ dữ liệu nhé!')
	}


	const staffRef = collection(db, "Staff")
	const q = query(staffRef, where('Mail', '==', email), where('Pass', '==', password))
	const querySnapshot = await getDocs(q);
	if(querySnapshot.size === 0) {
		throw Error('Người dùng không tồn tại')
	}
	const user = querySnapshot.docs.map((doc) => doc.data())[0]
	return user
}