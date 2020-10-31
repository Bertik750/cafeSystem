import firebase from '../firestore';

module.exports = function () {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user.email == "admin@admin.com") {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });

}