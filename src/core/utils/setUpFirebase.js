import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
let app;
export const setUpFirebase = () => {
	// Import the functions you need from the SDKs you need
	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

	// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	const firebaseConfig = {
		apiKey: "AIzaSyCNHdwOxAZu5Vm-uFEKYyMdZthh3zFeXog",
		authDomain: "se100-7efcd.firebaseapp.com",
		projectId: "se100-7efcd",
		storageBucket: "se100-7efcd.firebasestorage.app",
		messagingSenderId: "639001359925",
		appId: "1:639001359925:web:9621a33734c72e496be37c",
		measurementId: "G-CC7X06WR18"
	};

	// Initialize Firebase
	app = initializeApp(firebaseConfig);
}

export const getFirebaseAuth = () => {
	setUpFirebase()
	if(app != undefined) {
		setUpFirebase()
		return getAuth(app)
	} else {
		throw Error('Firebase app is not initialized yet!!!')
	}
}