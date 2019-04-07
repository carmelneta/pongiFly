import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface UserRow {
  name: string;
  win: number;
  lose: number;
  points: number;
}

export interface TableData { scores: Array<UserRow>; }

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass']
})
export class TableComponent implements OnInit {

  private tableDoc: AngularFirestoreDocument<TableData>;
  table: Observable<TableData>;
  constructor(private afs: AngularFirestore) {
    this.tableDoc = afs.doc<TableData>('results/approved');
    this.table = this.tableDoc.valueChanges();

    this.table.subscribe(results => {
      console.log(results.scores);
      this.dataSource = results.scores;
    });
  }
  dataSource: UserRow[] = [];

  displayedColumns: string[] = ['name', 'wins', 'lose', 'points'];
  ngOnInit() {
  }

}
