import { Component } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'main-menu',
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

}
