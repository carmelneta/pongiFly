import * as fbAdmin from 'firebase-admin';
import {Match, MatchState, User} from '../../models/models';
import * as serviceAccount from '../kkk.json';

class PongiAdmin {

    private mathes: Match[] = [];
    private players: User[] = [];
    private db: FirebaseFirestore.Firestore;

    constructor() {
        console.log('Building');
        fbAdmin.initializeApp({
            credential: fbAdmin.credential.cert(serviceAccount)
        });
        this.db = fbAdmin.firestore();
    }

    public async main() {
        await this.getAllUsers();
        this.buildMathes();
        this.saveMathces();
    }

    private async saveMathces() {
        // Get a new write batch
        const batch = admin.db.batch();
        const matchesCollection = admin.db.collection('games');
        this.mathes.forEach((match) => {
            const mathcRef = matchesCollection.doc(`${match.players[0].uid}VS${match.players[1].uid}`);
            batch.set(mathcRef, match);
        });
        // Commit the batch
        await batch.commit();
    }
    private buildMathes() {
        const playerDictionary: {[uid: string]: string[]} = {};

        //  Build empty dictionary of players matches
        this.players.forEach((player) => playerDictionary[player.uid] = [] );

        //  Loop all players
        this.players.forEach((player) => {
            let weeksCounter = 0;
            const playerDic = playerDictionary[player.uid];
            //  Loop all player
            this.players.forEach((otherPlayer) => {
                const otherPlayerDic = playerDictionary[otherPlayer.uid];
                if (
                !(player.uid === otherPlayer.uid) &&
                !(playerDic.includes(otherPlayer.uid)) && !(otherPlayerDic.includes(player.uid))) {
                    if (playerDic.length > 0 && (playerDictionary[player.uid].length % 3 === 0)
                        || otherPlayerDic.length > 0 && otherPlayerDic.length % 3 === 0) {
                        weeksCounter++;
                    }
                    const match = this.createMatch(player, otherPlayer, weeksCounter);
                    this.mathes.push(match);
                    playerDictionary[player.uid].push(otherPlayer.uid);
                    playerDictionary[otherPlayer.uid].push(player.uid);
                }
            });
        });
    }

    private createMatch(p1: User, p2: User, week: number): Match {
        const match: Match = {
            players: [{...p1, approve: false }, {...p2, approve: false  }],
            playersIds: [p1.uid, p2.uid],
            state: MatchState.set,
            week,
        };
        return match;
    }

    private async getAllUsers(): Promise<User[]> {
        const snapshot = await this.db.collection('users').get();
        snapshot.forEach((doc) => {
            this.players.push({
                name: doc.data().name,
                uid: doc.id,
            });
        });

        return this.players;
    }

}

const admin = new PongiAdmin();
admin.main();
