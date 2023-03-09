import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor() { }

  styleClass = "";

  // setting button
  changeStyleClass(deneme: string) {
    return "fixed-plugin ps " + deneme;
  }

}
