import {initializeApp} from "@firebase/app";
import {getFirestore} from "@firebase/firestore";
import {getAuth, GithubAuthProvider} from "@firebase/auth";
import {Octokit} from "octokit";

const firebaseConfig = {
    apiKey: "AIzaSyDzuGH97Hhkfb9ovotps5xlZOy3Efw0fhw",
    authDomain: "leaderboard-46de5.firebaseapp.com",
    projectId: "leaderboard-46de5",
    storageBucket: "leaderboard-46de5.appspot.com",
    messagingSenderId: "957637857282",
    appId: "1:957637857282:web:3a123c0ed8fd521e3c571b",
    measurementId: "G-LYR28TRBBC"
};



const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const githubProvider = new GithubAuthProvider()
const db = getFirestore(app)

export {app, db, auth, githubProvider}