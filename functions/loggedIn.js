import firebase from '../firestore';
import Router from 'next/router'

module.exports = function() {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log(user);
                resolve(true);
            } else {
                console.log("no");
                Router.push('/login');
                resolve(false);
            }
        });
    });
    
}