import './App.css';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDJnrf-OqutEb9BLXT-q34BDREFTpuBw3M",
    authDomain: "roastbattles-85b35.firebaseapp.com",
    projectId: "roastbattles-85b35",
    storageBucket: "roastbattles-85b35.appspot.com",
    messagingSenderId: "831370750345",
    appId: "1:831370750345:web:0b62cc194dea462cca5958",
    measurementId: "G-V8QZJXP8E7"
  });
}else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
const firestore = firebase.firestore();

/*
function AddUserInfo() {
  return (
    <h1>Welcome! Please add user info to begin!</h1>
  )
}
*/

function Home() {
  return (
    <h1>Welcome back!</h1>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        if (result.additionalUserInfo.isNewUser) {
          //direct to form to add info
        }
        else {
          //direct to home
        }
      })
  }

  return (
    <div>
      <h1>Sign in below!</h1>
      <button onClick={signInWithGoogle}>Sign in with Google!</button>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <section>
        { user ? <Home/> : <SignIn/> }
        <SignOut />
      </section>
    
    </div>
  );
}

export default App;
