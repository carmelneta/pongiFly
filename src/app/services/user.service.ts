import { Injectable, NgZone} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of, ReplaySubject } from 'rxjs';

export interface User { name: string; }

@Injectable({
  providedIn: 'root'
})

export class UserService {
  public user: Observable<User>;
  private uid: string = null;
  private userDoc: AngularFirestoreDocument<User>;


  constructor(private afAuth: AngularFireAuth,
              private zone: NgZone,
              private afs: AngularFirestore) {
  }

  getUser(): Promise<User> {
    const userPromise = new Promise<User>( (resulve, reject) => {

      this.afAuth.user.subscribe(userResults => {
        this.userDoc = this.afs.doc<User>(`users/${userResults.uid}`);
        this.user = this.userDoc.valueChanges();
        this.user.subscribe(user => {
          const finalUser: User = {name : user.name};
          resulve(finalUser);
        });
      });
    });
    return userPromise;
  }
}
