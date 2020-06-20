import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database'; 
import 'firebase/storage';

var firebaseConfig = {
  apiKey: "AIzaSyC-e-RBftaaTKNYHNbhRJ6GmjEKha5Q3x4",
  authDomain: "react-slack-clone-4b155.firebaseapp.com",
  databaseURL: "https://react-slack-clone-4b155.firebaseio.com",
  projectId: "react-slack-clone-4b155",
  storageBucket: "react-slack-clone-4b155.appspot.com",
  messagingSenderId: "558942938890",
  appId: "1:558942938890:web:15c4bee6af63cefb05bcf3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;
