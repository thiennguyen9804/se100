// Import các module cần thiết từ Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth"; // Nếu bạn sử dụng Authentication
// import { getStorage } from "firebase/storage"; // Nếu bạn sử dụng Storage

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyCNHdwOxAZu5Vm-uFEKYyMdZthh3zFeXog",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "se100-7efcd",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
export const db = getFirestore(app);

// Khởi tạo Authentication (nếu cần)
// export const auth = getAuth(app);

// Khởi tạo Storage (nếu cần)
// export const storage = getStorage(app);