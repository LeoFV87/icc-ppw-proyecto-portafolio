export type Role = 'admin' | 'programmer' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  role: Role;
  displayName?: string;
  photoURL?: string;
  description?: string;
  skills?: string[];
  // === NUEVO: Redes Sociales (Directas) ===
  github?: string;
  linkedin?: string;
}
