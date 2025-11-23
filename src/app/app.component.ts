import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header.component';
import { FooterComponent } from './shared/components/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Logiciel de gestion des étudiants';
}
