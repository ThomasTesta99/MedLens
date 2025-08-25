declare interface CreateUserInfo {
  name: string;
  email: string;
  password: string; 
}

declare interface SignInUserInfo{
  email: string;
  password: string;
}

declare interface User {
  id?: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  password?: string | null;
  role: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

declare interface UserProps{
  user?: User;
}