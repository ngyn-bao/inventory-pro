import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Device } from '../../../core/models/device.model';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private mockDevices: Device[] = [
    {
      stt: 1,
      tenThietBi: 'MacBook Pro M3',
      maThietBi: 'DEV-MBP-01',
      loaiThietBi: 'Laptop',
      nguoiQuanLy: 'nguyenbao',
      tinhTrang: 'Hoạt động',
    },
    {
      stt: 2,
      tenThietBi: 'Dell UltraSharp 27"',
      maThietBi: 'DEV-MON-02',
      loaiThietBi: 'Màn hình',
      nguoiQuanLy: 'admin',
      tinhTrang: 'Hoạt động',
    },
    {
      stt: 3,
      tenThietBi: 'Server Ubuntu Core',
      maThietBi: 'DEV-SRV-03',
      loaiThietBi: 'Máy chủ',
      nguoiQuanLy: 'thutran',
      tinhTrang: 'Bảo trì',
    },
  ];

  private devicesSubject = new BehaviorSubject<Device[]>(this.mockDevices);
  devices$: Observable<Device[]> = this.devicesSubject.asObservable();

  addDevice(device: Omit<Device, 'stt'>) {
    const current = this.devicesSubject.value;
    const nextStt = current.length > 0 ? Math.max(...current.map((d) => d.stt)) + 1 : 1;
    this.mockDevices = [...current, { ...device, stt: nextStt }];
    this.devicesSubject.next(this.mockDevices);
  }

  updateDevice(updatedDevice: Device) {
    this.mockDevices = this.devicesSubject.value.map((d) =>
      d.stt === updatedDevice.stt ? updatedDevice : d,
    );
    this.devicesSubject.next(this.mockDevices);
  }

  deleteDevice(stt: number) {
    this.mockDevices = this.devicesSubject.value.filter((d) => d.stt !== stt);
    this.devicesSubject.next(this.mockDevices);
  }
}
