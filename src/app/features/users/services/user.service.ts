import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'usersList';

  private readonly mockUsers: User[] = [
    { stt: 1, hoTen: 'admin', username: 'admin', role: 'Admin' },
    { stt: 2, hoTen: 'Nguyễn Bảo Nguyên', username: 'nguyenbao', role: 'User' },
    { stt: 3, hoTen: 'Trần Thị Thu', username: 'thutran', role: 'Manager' },
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.loadUsers());
  users$: Observable<User[]> = this.usersSubject.asObservable();

  private loadUsers(): User[] {
    if (!isPlatformBrowser(this.platformId)) {
      return this.mockUsers;
    }

    const storedUsers = localStorage.getItem(this.storageKey);
    if (!storedUsers) {
      return this.mockUsers;
    }

    try {
      const parsedUsers = JSON.parse(storedUsers) as User[];
      return Array.isArray(parsedUsers) && parsedUsers.length > 0 ? parsedUsers : this.mockUsers;
    } catch {
      return this.mockUsers;
    }
  }

  private persistUsers(users: User[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  // Thêm
  addUser(user: Omit<User, 'stt'>) {
    const currentUsers = this.usersSubject.value;
    const nextStt = currentUsers.length > 0 ? Math.max(...currentUsers.map((u) => u.stt)) + 1 : 1;
    const newUser: User = { stt: nextStt, ...user };

    const nextUsers = [...currentUsers, newUser];
    this.usersSubject.next(nextUsers);
    this.persistUsers(nextUsers);
  }

  //Sửa
  updateUser(updatedUser: User) {
    const nextUsers = this.usersSubject.value.map((user) =>
      user.stt === updatedUser.stt ? updatedUser : user,
    );
    this.usersSubject.next(nextUsers);
    this.persistUsers(nextUsers);
  }

  //Xóa
  deleteUser(stt: number) {
    const nextUsers = this.usersSubject.value.filter((user) => user.stt !== stt);
    this.usersSubject.next(nextUsers);
    this.persistUsers(nextUsers);
  }

  deleteUsers(stts: number[]) {
    const idsToDelete = new Set(stts);
    const nextUsers = this.usersSubject.value.filter((user) => !idsToDelete.has(user.stt));
    this.usersSubject.next(nextUsers);
    this.persistUsers(nextUsers);
  }
}
