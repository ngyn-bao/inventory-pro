import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'header-layout',
  templateUrl: './header-layout.component.html',
  styleUrl: './header-layout.component.css',
  imports: [RouterLink],
})
export class HeaderLayoutComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  showLogoutDialog = false;

  constructor(private authService: AuthService) {}

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  // 1. Khi click nút Logout: Bật mở Dialog
  triggerLogoutPrompt() {
    this.showLogoutDialog = true;
  }

  // 2. Khi bấm Hủy: Đóng Dialog
  cancelLogout() {
    this.showLogoutDialog = false;
  }

  // 3. Khi bấm Xác nhận: Gọi dịch vụ logout để xóa token và chuyển hướng
  confirmLogout() {
    this.showLogoutDialog = false;
    this.authService.logout();
  }
}
