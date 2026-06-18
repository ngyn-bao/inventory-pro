import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table'; // 👈 Import Table của PrimeNG
import { DeviceService } from './services/device.service';
import { UserService } from '../users/services/user.service';
import { Device } from '../../core/models/device.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule], // 👈 Thêm TableModule vào đây
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
})
export class DevicesComponent implements OnInit {
  filteredDevices: Device[] = [];
  allDevices: Device[] = [];
  userList: User[] = [];
  searchTerm: string = '';

  // 🚀 Mảng hứng danh sách thiết bị được tích chọn checkbox từ PrimeNG
  selectedDevices: Device[] = [];

  showModal = false;
  isEditMode = false;
  currentFormDevice: any = {
    tenThietBi: '',
    maThietBi: '',
    loaiThietBi: '',
    nguoiQuanLy: '',
    tinhTrang: 'Hoạt động',
  };

  // 🚀 Các biến trạng thái quản lý Dialog ẩn/hiện nội bộ
  showDeleteDialog = false;
  deviceSttToDelete: number | null = null;
  showBulkDeleteDialog = false;

  constructor(
    private deviceService: DeviceService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.deviceService.devices$.subscribe((devices) => {
      this.allDevices = devices;
      this.applyFilter();
      this.syncSelectedDevices();
    });

    this.userService.users$.subscribe((users) => {
      this.userList = users;
    });
  }

  get hasSelectedDevices(): boolean {
    return this.selectedDevices.length > 0;
  }

  applyFilter() {
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

  syncSelectedDevices(): void {
    const currentIds = new Set(this.allDevices.map((d) => d.stt));
    this.selectedDevices = this.selectedDevices.filter((d) => currentIds.has(d.stt));
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

  // 🚀 HÀM XỬ LÝ DIALOG XÓA ĐƠN LẺ
  triggerDeletePrompt(stt: number) {
    this.deviceSttToDelete = stt;
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.deviceSttToDelete = null;
    this.showDeleteDialog = false;
  }

  confirmDelete() {
    if (this.deviceSttToDelete !== null) {
      this.deviceService.deleteDevice(this.deviceSttToDelete);
    }
    this.cancelDelete();
  }

  // 🚀 HÀM XỬ LÝ DIALOG XÓA HÀNG LOẠT
  triggerBulkDeletePrompt(): void {
    if (!this.hasSelectedDevices) return;
    this.showBulkDeleteDialog = true;
  }

  cancelBulkDelete(): void {
    this.showBulkDeleteDialog = false;
  }

  confirmBulkDelete(): void {
    if (this.selectedDevices.length > 0) {
      const idsToDelete = this.selectedDevices.map((d) => d.stt);
      this.deviceService.deleteDevices(idsToDelete); // Đảm bảo Service có hàm xóa mảng ids
      this.selectedDevices = [];
    }
    this.showBulkDeleteDialog = false;
  }
}
