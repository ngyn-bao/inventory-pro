import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarLayoutComponent } from './sidebar-layout/sidebar-layout.component';
import { HeaderLayoutComponent } from './header-layout/header-layout.component';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarLayoutComponent, HeaderLayoutComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  sidebarOpen = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
