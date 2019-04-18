import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  panelOpenState = false;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
  }

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.router.navigateByUrl('user');
      }
    });
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

}
