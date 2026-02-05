export interface PropertyForm {
  title: string;
  price: number;
  location: string;
}

export interface ConnectBundle {
  id: string;
  name: string;
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum PropertyType {
  RENT = "RENT",
  BUY = "BUY",
}
