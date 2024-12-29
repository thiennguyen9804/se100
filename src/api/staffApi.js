import { delay } from "../core/utils/delay";
import { 
	getDocs, collection, where,
	addDoc, query,
	updateDoc, doc
} from "firebase/firestore";
import { db } from "../core/utils/firebase";
const data = [
	{
		contact: "0900xxxx",
		location: "HCM city",
		mail: "admin@example.com",
		name: "Thien",
		pass: "1",
		role: "admin",
	},
];


export const getAllStaff = async () => {
	const querySnapshot = await getDocs(collection(db, "Staff"))
	const res = querySnapshot.docs.map(item => {
		const data = item.data()
		const id = item.id
		return {
			...data,
			id
		}
	})
	// console.log("🚀 ~ getAllStaff ~ res:", res)
	return res
}

const emailBeenUsed = async email => {
	if(!email) {
		throw Error('Mail is empty!!!')
	}
	const ref = collection(db, 'Staff')
	const q = query(ref, where('Mail', '==', email))
	const querySnapshot = await getDocs(q);
	const res = !querySnapshot.empty
	console.log("🚀 ~ emailBeenUsed ~ res:", res)
	return res
}

export const addStaff = async staff => {
	if(await emailBeenUsed(staff.Mail)) {
		throw Error('User with this email already existed')
	}

	const ref = collection(db, 'Staff')
	const res = await addDoc(ref, staff)
	return {
		...staff,
		id: res.id
	}
}

export const updateStaff = async staff => {
	const ref = doc(db, 'Staff', staff.id);
	// console.log("🚀 ~ updateStaff ~ staff:", staff)
	const staffWithoutId = { ...staff };
	delete staffWithoutId.id;
	await updateDoc(ref, staffWithoutId);
	return {
		...staff,
	};
}