// Import các module cần thiết từ Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth"; // Nếu bạn sử dụng Authentication
// import { getStorage } from "firebase/storage"; // Nếu bạn sử dụng Storage

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyCNHdwOxAZu5Vm-uFEKYyMdZthh3zFeXog",
  authDomain: "se100-7efcd.firebaseapp.com",
  projectId: "se100-7efcd",
  storageBucket: "se100-7efcd.firebasestorage.app",
  messagingSenderId: "639001359925",
  appId: "1:639001359925:web:9621a33734c72e496be37c",
  measurementId: "G-CC7X06WR18",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
export const db = getFirestore(app);

// Khởi tạo Authentication (nếu cần)
// export const auth = getAuth(app);

// Khởi tạo Storage (nếu cần)
// export const storage = getStorage(app);
