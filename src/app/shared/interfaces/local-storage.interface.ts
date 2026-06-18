export interface ExpiringStorageItem<T> {
  value: T;
  expiry: number; // Timestamp in milliseconds
}
