import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../services/user.service';

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

  tableDoc: AngularFirestoreDocument<TableData>;
  table: Observable<TableData>;
  dataSource: UserRow[] = [];

  usersCollections: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  usersDataSource: User[] = [];

  constructor(private afs: AngularFirestore) {
    // this.tableDoc = afs.doc<TableData>('results/approved');
    // this.table = this.tableDoc.valueChanges();

    // this.table.subscribe(results => {
    //   console.log(results.scores);
    //   this.dataSource = results.scores;
    // });

    this.usersCollections = afs.collection<User>('users');
    this.users = this.usersCollections.valueChanges();
    this.users.subscribe((users: User[]) => {
      this.usersDataSource = users;
    });
  }

  displayedColumns: string[] = ['name', 'wins', 'lose', 'points'];
  ngOnInit() {
  }

}
