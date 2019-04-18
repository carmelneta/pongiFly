import { Component } from '@angular/core';
import { UserService, User} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  userName: string;

  constructor(private userSerivce: UserService) {
    userSerivce.getUser().then(user => {
      this.userName = user.name;
    });
  }
}
