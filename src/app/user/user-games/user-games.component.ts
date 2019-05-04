import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {Match, MatchState, User} from '../../../../models/models';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-games',
  templateUrl: './user-games.component.html',
  styleUrls: ['./user-games.component.sass']
})
export class UserGamesComponent implements OnInit {
  @Input() uid: string;

  games: Match[];

  constructor(private afs: AngularFirestore, private router: Router) {

   }

  ngOnInit() {
    const ag = this.afs.collection<Match>('games');
    const queryFunc = (ref: CollectionReference) => ref.where('playersIds', 'array-contains', this.uid);
    const queriedCollection = this.afs.collection<Match>(ag.ref, queryFunc);
    queriedCollection.valueChanges().subscribe( games => {
      const sorted = games.sort( (a, b) => (a.week > b.week) ? 1 : -1 );
      this.games = sorted;
    });
  }

  navToGame(game: Match) {
    const gameId = game.playersIds.join('VS');
    this.router.navigate(['/game', gameId]);
  }

  actionTitle(state: MatchState): string {
    switch (state) {
      case MatchState.approved:
        return 'Close';
      case MatchState.played:
      case MatchState.set:
        return 'Send';
    }
  }
}
