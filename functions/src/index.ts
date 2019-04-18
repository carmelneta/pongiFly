import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
    const fullName = user.displayName || 'Anonymous';
    console.log(`User logged in ${fullName}`);

    await admin.firestore().collection('users').doc(user.uid).set({
        name: fullName,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
});