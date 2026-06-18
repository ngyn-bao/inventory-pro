import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
import { UserService } from './services/user.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast'; // 👈 Import ToastModule
import { MessageService } from 'primeng/api';

@Component({
  selector: 'users',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CheckboxModule, TagModule, ToastModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private messageService = inject(MessageService);
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];
  searchTerm: string = '';
  // selectedUserIds: number[] = [];

  showModal: boolean = false;
  isEditMode: boolean = false;

  showDeleteDialog = false;
  showBulkDeleteDialog = false;
  userSttToDelete: number | null = null;

  currentFormUser: any = { hoTen: '', username: '', role: 'User' };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.users$.subscribe((users) => {
      this.allUsers = users;
      this.applyFilter();
      this.syncSelectedUsers();
    });
  }

  get hasSelectedUsers(): boolean {
    return this.selectedUsers.length > 0;
  }

  getSeverity(role: string) {
    switch (role) {
      case 'Manager':
        return 'success';
      case 'Admin':
        return 'danger';
      default:
        return 'info';
    }
  }
  // get allFilteredUsersSelected(): boolean {
  //   return (
  //     this.filteredUsers.length > 0 &&
  //     this.filteredUsers.every((user) => this.isUserSelected(user.stt))
  //   );
  // }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.allUsers];
    } else {
      const keyword = this.searchTerm.toLowerCase();
      this.filteredUsers = this.allUsers.filter(
        (user) =>
          user.hoTen.toLowerCase().includes(keyword) ||
          user.username.toLowerCase().includes(keyword),
      );
    }
  }

  syncSelectedUsers(): void {
    const currentIds = new Set(this.allUsers.map((user) => user.stt));
    this.selectedUsers = this.selectedUsers.filter((user) => currentIds.has(user.stt));
  }

  // isUserSelected(stt: number): boolean {
  //   return this.selectedUserIds.includes(stt);
  // }

  // toggleUserSelection(stt: number, checked: boolean): void {
  //   if (checked) {
  //     if (!this.isUserSelected(stt)) {
  //       this.selectedUserIds = [...this.selectedUserIds, stt];
  //     }
  //     return;
  //   }

  //   this.selectedUserIds = this.selectedUserIds.filter((selectedId) => selectedId !== stt);
  // }

  // toggleAllUsers(checked: boolean): void {
  //   if (checked) {
  //     const visibleIds = this.filteredUsers.map((user) => user.stt);
  //     const selectedIds = new Set(this.selectedUserIds);
  //     visibleIds.forEach((stt) => selectedIds.add(stt));
  //     this.selectedUserIds = Array.from(selectedIds);
  //     return;
  //   }

  //   const visibleIds = new Set(this.filteredUsers.map((user) => user.stt));
  //   this.selectedUserIds = this.selectedUserIds.filter((stt) => !visibleIds.has(stt));
  // }

  openAddModal() {
    this.isEditMode = false;
    this.currentFormUser = { hoTen: '', username: '', role: 'User' };
    this.showModal = true;
  }

  openEditModal(user: User) {
    this.isEditMode = true;
    this.currentFormUser = { ...user };
    this.showModal = true;
  }

  // saveUser() {
  //   if (!this.currentFormUser.hoTen || !this.currentFormUser.username) {
  //     alert('Vui lòng điền đầy đủ thông tin!');
  //     return;
  //   }

  //   if (this.isEditMode) {
  //     this.userService.updateUser(this.currentFormUser);
  //   } else {
  //     this.userService.addUser(this.currentFormUser);
  //   }
  //   this.showModal = false;
  // }

  saveUser() {
    // 1. Thay alert thông báo lỗi thiếu thông tin bằng Toast Warning
    if (!this.currentFormUser.hoTen || !this.currentFormUser.username) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ họ tên và tên đăng nhập!',
        life: 3000, // Tự tắt sau 3 giây
      });
      return;
    }

    if (this.isEditMode) {
      this.userService.updateUser(this.currentFormUser);
      // 2. Bắn toast thành công khi cập nhật
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Cập nhật thông tin người dùng thành công!',
        life: 3000,
      });
    } else {
      this.userService.addUser(this.currentFormUser);
      // 3. Bắn toast thành công khi thêm mới
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Thêm mới người dùng thành công!',
        life: 3000,
      });
    }
    this.showModal = false;
  }

  // --- 🚀 XỬ LÝ XÓA ĐƠN LẺ VỚI TOAST ---
  triggerDeletePrompt(stt: number) {
    this.userSttToDelete = stt;
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.userSttToDelete = null;
    this.showDeleteDialog = false;
  }

  confirmDelete() {
    if (this.userSttToDelete !== null) {
      this.userService.deleteUser(this.userSttToDelete);

      // 🚀 Bắn thông báo Toast thành công thay thế alert/confirm gồ ghề
      this.messageService.add({
        severity: 'success',
        summary: 'Đã xóa',
        detail: `Xóa thành công người dùng có STT ${this.userSttToDelete}!`,
        life: 3000,
      });
    }
    this.cancelDelete();
  }

  // --- 🚀 XỬ LÝ XÓA HÀNG LOẠT VỚI TOAST ---
  triggerBulkDeletePrompt(): void {
    if (!this.hasSelectedUsers) return;
    this.showBulkDeleteDialog = true;
  }

  cancelBulkDelete(): void {
    this.showBulkDeleteDialog = false;
  }

  confirmBulkDelete(): void {
    if (this.selectedUsers.length > 0) {
      const count = this.selectedUsers.length;
      const idsToDelete = this.selectedUsers.map((user) => user.stt);
      this.userService.deleteUsers(idsToDelete);
      this.selectedUsers = []; // Reset mảng chọn bôi đậm checkbox

      // 🚀 Bắn thông báo Toast thành công xóa hàng loạt
      this.messageService.add({
        severity: 'success',
        summary: 'Xóa hàng loạt thành công',
        detail: `Đã xóa vĩnh viễn ${count} tài khoản được chọn khỏi hệ thống!`,
        life: 3000,
      });
    }
    this.showBulkDeleteDialog = false;
  }

  // deleteSelectedUsers(): void {
  //   if (!this.hasSelectedUsers) {
  //     return;
  //   }

  //   if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedUsers.length} người dùng đã chọn?`)) {
  //     const idsToDelete = this.selectedUsers.map((user) => user.stt);
  //     this.userService.deleteUsers(idsToDelete); // Đảm bảo Service của bạn có hàm deleteUsers(ids: number[])
  //     this.selectedUsers = []; // Reset mảng chọn sau khi xóa sạch
  //   }
  // }

  // // 1. Khi click nút [🗑️ Xóa] ở Toolbar: Không xóa ngay mà chỉ bật Dialog lên
  // triggerBulkDeletePrompt(): void {
  //   if (!this.hasSelectedUsers) return;
  //   this.showBulkDeleteDialog = true;
  // }

  // // 2. Khi bấm [Hủy] trên Dialog: Tắt Dialog đi và giữ nguyên mảng selectedUsers
  // cancelBulkDelete(): void {
  //   this.showBulkDeleteDialog = false;
  // }

  // // 3. Khi bấm [Xác nhận xóa] trên Dialog: Thực thi xóa dữ liệu trong Service
  // confirmBulkDelete(): void {
  //   if (this.selectedUsers.length > 0) {
  //     const idsToDelete = this.selectedUsers.map((user) => user.stt);
  //     this.userService.deleteUsers(idsToDelete);
  //     this.selectedUsers = []; // Xóa xong reset mảng checkbox về rỗng
  //   }
  //   this.showBulkDeleteDialog = false; // Đóng dialog
  // }

  // onDelete(stt: number) {
  //   if (confirm(`Bạn có chắc chắn muốn xóa người dùng có STT ${stt}?`)) {
  //     this.userService.deleteUser(stt);
  //   }
  // }
  // triggerDeletePrompt(stt: number) {
  //   this.userSttToDelete = stt;
  //   this.showDeleteDialog = true;
  // }

  // cancelDelete() {
  //   this.userSttToDelete = null;
  //   this.showDeleteDialog = false;
  // }

  // confirmDelete() {
  //   if (this.userSttToDelete !== null) {
  //     this.userService.deleteUser(this.userSttToDelete);
  //   }
  //   this.cancelDelete();
  // }
}
