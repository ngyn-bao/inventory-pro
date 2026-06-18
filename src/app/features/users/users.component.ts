import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
import { UserService } from './services/user.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'users',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CheckboxModule, TagModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
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

  saveUser() {
    if (!this.currentFormUser.hoTen || !this.currentFormUser.username) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (this.isEditMode) {
      this.userService.updateUser(this.currentFormUser);
    } else {
      this.userService.addUser(this.currentFormUser);
    }
    this.showModal = false;
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

  // 1. Khi click nút [🗑️ Xóa] ở Toolbar: Không xóa ngay mà chỉ bật Dialog lên
  triggerBulkDeletePrompt(): void {
    if (!this.hasSelectedUsers) return;
    this.showBulkDeleteDialog = true;
  }

  // 2. Khi bấm [Hủy] trên Dialog: Tắt Dialog đi và giữ nguyên mảng selectedUsers
  cancelBulkDelete(): void {
    this.showBulkDeleteDialog = false;
  }

  // 3. Khi bấm [Xác nhận xóa] trên Dialog: Thực thi xóa dữ liệu trong Service
  confirmBulkDelete(): void {
    if (this.selectedUsers.length > 0) {
      const idsToDelete = this.selectedUsers.map((user) => user.stt);
      this.userService.deleteUsers(idsToDelete);
      this.selectedUsers = []; // Xóa xong reset mảng checkbox về rỗng
    }
    this.showBulkDeleteDialog = false; // Đóng dialog
  }

  // onDelete(stt: number) {
  //   if (confirm(`Bạn có chắc chắn muốn xóa người dùng có STT ${stt}?`)) {
  //     this.userService.deleteUser(stt);
  //   }
  // }
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
    }
    this.cancelDelete();
  }
}
