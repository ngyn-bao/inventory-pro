import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeviceService } from './services/device.service';
import { UserService } from '../users/services/user.service'; // Gọi chéo sang User Service
import { Device } from '../../core/models/device.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
})
export class DevicesComponent implements OnInit {
  filteredDevices: Device[] = [];
  allDevices: Device[] = [];
  userList: User[] = []; // Danh sách user để hiển thị trong dropdown chọn người quản lý
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;

  showModal = false;
  isEditMode = false;
  currentFormDevice: any = {
    tenThietBi: '',
    maThietBi: '',
    loaiThietBi: '',
    nguoiQuanLy: '',
    tinhTrang: 'Hoạt động',
  };

  constructor(
    private deviceService: DeviceService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    // Lấy dữ liệu thiết bị
    this.deviceService.devices$.subscribe((devices) => {
      this.allDevices = devices;
      this.applyFilter();
    });

    // Lấy danh sách user từ UserService để map qua form
    this.userService.users$.subscribe((users) => {
      this.userList = users;
    });
  }

  applyFilter() {
    this.currentPage = 1;

    if (!this.searchTerm.trim()) {
      this.filteredDevices = [...this.allDevices];
    } else {
      const keyword = this.searchTerm.toLowerCase();
      this.filteredDevices = this.allDevices.filter(
        (d) =>
          d.tenThietBi.toLowerCase().includes(keyword) ||
          d.maThietBi.toLowerCase().includes(keyword) ||
          d.nguoiQuanLy.toLowerCase().includes(keyword),
      );
    }
  }

  get totalItems(): number {
    return this.filteredDevices.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pagedDevices(): Device[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredDevices.slice(startIndex, startIndex + this.pageSize);
  }

  get visibleRangeStart(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get visibleRangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get pageNumbers(): number[] {
    const maxButtons = 5;
    const halfWindow = Math.floor(maxButtons / 2);
    let startPage = Math.max(1, this.currentPage - halfWindow);
    let endPage = Math.min(this.totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }

  changePage(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
  }

  changePageSize(value: string | number): void {
    this.pageSize = Number(value);
    this.currentPage = 1;
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentFormDevice = {
      tenThietBi: '',
      maThietBi: '',
      loaiThietBi: '',
      nguoiQuanLy: this.userList[0]?.username || '',
      tinhTrang: 'Hoạt động',
    };
    this.showModal = true;
  }

  openEditModal(device: Device) {
    this.isEditMode = true;
    this.currentFormDevice = { ...device };
    this.showModal = true;
  }

  saveDevice() {
    if (!this.currentFormDevice.tenThietBi || !this.currentFormDevice.maThietBi) {
      alert('Vui lòng điền đủ Tên và Mã thiết bị!');
      return;
    }

    if (this.isEditMode) {
      this.deviceService.updateDevice(this.currentFormDevice);
    } else {
      this.deviceService.addDevice(this.currentFormDevice);
    }
    this.showModal = false;
  }

  onDelete(stt: number) {
    if (confirm(`Xóa thiết bị có STT ${stt}?`)) {
      this.deviceService.deleteDevice(stt);
    }
  }
}
