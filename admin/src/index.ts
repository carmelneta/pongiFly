import * as fbAdmin from 'firebase-admin';
import * as serviceAccount from '../kkk.json';
import {Match, MatchState, User} from './models';

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
        // console.log(this.players);
        this.buildMathes();
        console.log(this.mathes);
    }

    private buildMathes() {
        let weeksCounter = 0;
        const playerDictionary: {[uid: string]: string[]} = {};

        //  Build empty dictionary of players matches
        this.players.forEach((player) => playerDictionary[player.uid] = [] );

        //  Loop all players
        this.players.forEach((player) => {
            //  Loop all player
            this.players.forEach((otherPlayer) => {
                if (
                !(player.uid === otherPlayer.uid)
                &&
                !(playerDictionary[player.uid].includes(otherPlayer.uid))
                &&
                !(playerDictionary[otherPlayer.uid].includes(player.uid))
                ) {
                    const match = this.createMatch(player, otherPlayer, weeksCounter);
                    this.mathes.push(match);
                    playerDictionary[player.uid].push(otherPlayer.uid);
                    playerDictionary[otherPlayer.uid].push(player.uid);
                }
            });
            weeksCounter++;
        });
    }

    private createMatch(p1: User, p2: User, week: number): Match {
        // const pMatch1: PlayerMath = ;
        const match: Match = {
            players: [{...p1, approve: false }, {...p2, approve: false  }],
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
