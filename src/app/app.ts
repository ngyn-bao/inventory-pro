import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLayoutComponent } from './layouts/admin-layout/header-layout/header-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('inventory-pro');
}
