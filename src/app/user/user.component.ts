import { Component, OnInit, SimpleChange } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User { name: string; }

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {

  userName: string;
  private itemDoc: AngularFirestoreDocument<User>;
  item: Observable<User>;
  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router) {
    this.afAuth.user.subscribe(user => this.userDidChanged(user));
  }

  userInputChaged(value: string) {
    if (value && value.length > 1) {
      this.itemDoc.set({name: value});
    }
  }

  userDidChanged(user) {
    if (!user) {
      this.router.navigateByUrl('login');
      return;
    }

    this.itemDoc = this.afs.doc<User>(`users/${user.uid}`);
    this.item = this.itemDoc.valueChanges();
    this.itemDoc.get().toPromise().then(snapshot => {
      this.userName = snapshot.get('name');
    });
  }

  ngOnInit() {
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
