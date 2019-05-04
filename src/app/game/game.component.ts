import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {Match, MatchState, PlayerMath} from '../../../models/models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {
  private gameDoc: AngularFirestoreDocument<Match>;
  game: Observable<Match>;
  toggleOptions: PlayerMath[];
  localResluts: string[] = [null, null, null];
  validResults = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.game = this.route.paramMap.pipe(
      switchMap( (params: ParamMap) => {
        this.gameDoc = this.afs.doc<Match>('games/' + params.get('id'));
        return this.gameDoc.valueChanges();
      }));
    this.game.subscribe(game => {
      console.log(game);
      this.localResluts = game.results;
      this.toggleOptions = game.players;
    });
  }

  selectionChanged(event, group: number) {
    this.validateResults();
  }

  validateResults() {
    this.validResults = this.localResluts.reduce((sum, next) => sum && next != null , true);
  }

  submit() {
    if (!this.validResults) {
      return;
    }

    this.gameDoc.update({results: this.localResluts});
  }

}
