export interface Device {
  stt: number;
  tenThietBi: string;
  maThietBi: string;
  loaiThietBi: string;
  nguoiQuanLy: string; // Sẽ liên kết với thuộc tính 'username' của Model User
  tinhTrang: 'Hoạt động' | 'Bảo trì' | 'Hỏng';
}
