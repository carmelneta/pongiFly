import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Match, MatchState} from './models';

admin.initializeApp();

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
    const fullName = user.displayName || 'Anonymous';
    console.log(`User logged in ${fullName}`);

    await admin.firestore().collection('users').doc(user.uid).set({
        name: fullName,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
});

export const onGameResultsSubmitted = functions.firestore
    .document('games/{gameId}')
    .onUpdate(async (change, context) => {
      const newValue = change.after.data() as Match;
      const valid = newValue.results.reduce((sum, next) => sum && newValue.playersIds.indexOf(next) > -1, true);
      const newState: MatchState = valid ? MatchState.played : MatchState.set

      // // Then return a promise of a set operation to update the count
      await change.after.ref.set({
        state: newState
      }, {merge: true});
    });
