import { Component } from '@angular/core';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pushReceived$ = this.pushService.pushReceived$;

  constructor(private pushService: PushService) {}

}
