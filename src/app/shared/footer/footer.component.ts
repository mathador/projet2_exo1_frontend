import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-light text-center py-3 mt-5 border-top">
      <div class="container-fluid">
        <small class="text-muted">
          Version {{ version }} — Mise à jour : {{ lastUpdate }}
        </small>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      margin-top: auto;
    }
  `]
})
export class FooterComponent {
  version = environment.appVersion || '1.0.0';
  lastUpdate = environment.lastUpdate || new Date().toLocaleDateString('fr-FR');
}
