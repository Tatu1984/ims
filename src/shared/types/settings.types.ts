export interface Setting {
  id: string;
  key: string;
  value: string;
  category: string;
  updatedAt: string;
}

export interface SettingsMap {
  [key: string]: string;
}
