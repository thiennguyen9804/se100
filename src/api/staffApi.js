import { delay } from "../core/utils/delay";
import { getDocs, collection } from "firebase/firestore";
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
	console.log("🚀 ~ getAllStaff ~ res:", res)
	return res
}
