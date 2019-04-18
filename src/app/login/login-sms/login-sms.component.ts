import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { WindowService } from '../../services/window.service';
import {FormControl, FormGroupDirective, NgForm, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}

export function E164(): ValidatorFn {
   return (control: AbstractControl): {[key: string]: any} | null => {
    const regex = /^[0-9]*$/i;
    const numbersOnly = regex.test(control.value);
    return !numbersOnly ? {E164: {value: control.value}} : null;
  };
}

enum LoginStep {
  googleRecp, sendToPhone, enterCode, success
}

@Component({
  selector: 'app-login-sms',
  templateUrl: './login-sms.component.html',
  styleUrls: ['./login-sms.component.sass']
})
export class LoginSmsComponent implements OnInit {

  windowRef: any;
  verificationCode: string;
  step: LoginStep;
  allSteps = LoginStep;
  phoneNumberControl = new FormControl('', [Validators.required, forbiddenNameValidator(/bob/i), E164()]);
  smsCodeControl = new FormControl('', [Validators.required]);
  phoneError: string;
  matcher = new MyErrorStateMatcher();
  generalErrorMsg: string;

  constructor(public afAuth: AngularFireAuth, private win: WindowService, private zone: NgZone) {
    this.step = LoginStep.googleRecp;
    this.generalErrorMsg = null;
  }

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.verify().then( () => {
      this.zone.run(() => {
        this.step = LoginStep.sendToPhone;
        this.phoneError = 'carmel';
      });
    });
  }

  loginPhone() {
    const cutNumber = this.phoneNumberControl.value[0] === '0' ?  this.phoneNumberControl.value.slice(1) :  this.phoneNumberControl.value;
    const phoneNumber = `+972${cutNumber}`;
    this.afAuth.auth.signInWithPhoneNumber(phoneNumber, this.windowRef.recaptchaVerifier)
      .then(result => {
        console.log(result);
        this.windowRef.confirmationResult = result;
        this.step = LoginStep.enterCode;
      })
      .catch( error => {
        console.log(error);
        this.generalErrorMsg = error.message;
      });
  }

  verifyLoginCode() {
    console.log(String(this.smsCodeControl.value));
    this.windowRef.confirmationResult
                  .confirm(String(this.smsCodeControl.value))
                  .then( (result: any) => {
                    console.log(result);
                    // this.user = result.user;
                    const verificationID = this.windowRef.confirmationResult.verificationId;
                    const credential = auth.PhoneAuthProvider.credential(verificationID,  String(this.smsCodeControl.value));
                    auth().signInAndRetrieveDataWithCredential(credential).then( user => {
                      console.log(user);
                    });

    })
    .catch( (error: any) => {
      this.generalErrorMsg = error.message;
      console.log(error, 'Incorrect code entered?');
    });
  }
}
