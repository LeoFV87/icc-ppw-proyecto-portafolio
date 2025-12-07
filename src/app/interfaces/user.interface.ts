export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'programmer' | 'user';
  specialty?: string;
  description?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
  };
}
