
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAe455j9pqGS3cV1PUndaDtuPEtxN8lqdI",
  authDomain: "portfolio-f66ee.firebaseapp.com",
  projectId: "portfolio-f66ee",
  storageBucket: "portfolio-f66ee.firebasestorage.app",
  messagingSenderId: "583947518294",
  appId: "1:583947518294:web:8676606a128f9ad57e96f7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
