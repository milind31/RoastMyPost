import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/app';

var firebaseConfig = {
  apiKey: "AIzaSyDJnrf-OqutEb9BLXT-q34BDREFTpuBw3M",
  authDomain: "roastbattles-85b35.firebaseapp.com",
  projectId: "roastbattles-85b35",
  storageBucket: "roastbattles-85b35.appspot.com",
  messagingSenderId: "831370750345",
  appId: "1:831370750345:web:0b62cc194dea462cca5958",
  measurementId: "G-V8QZJXP8E7"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
