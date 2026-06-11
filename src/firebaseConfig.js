import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCCgibHITxIzTl7HraWBtJqsssHMwYwOUs",
  databaseURL: "https://smart-garden-esp32-13e47-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "smart-garden-esp32-13e47",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);