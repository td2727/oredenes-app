import type { User, RegisterFormData } from '../types/order';
import { MAIN_ADMIN_CONFIG } from '../config/admin';

const USERS_KEY = 'medical_orders_users';
const CURRENT_USER_KEY = 'medical_orders_current_user';

// Initialize with admin user
const initializeUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default admin user from config
  const defaultUsers: User[] = [
    {
      id: 'admin-1',
      email: MAIN_ADMIN_CONFIG.email,
      password: MAIN_ADMIN_CONFIG.password,
      role: 'admin',
      name: MAIN_ADMIN_CONFIG.name,
      createdAt: new Date().toISOString()
    }
  ];
  
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const getUsers = (): User[] => {
  return initializeUsers();
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addAdmin = (email: string, password: string, name: string, currentUser: User): { success: boolean; error?: string; user?: User } => {
  // Only admins can add new admins
  if (currentUser.role !== 'admin') {
    return { success: false, error: 'No tienes permisos para agregar administradores' };
  }
  
  const users = getUsers();
  
  // Check if email already exists
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return { success: false, error: 'Este correo ya está registrado' };
  }
  
  // Validate password
  if (password.length < 6) {
    return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }
  
  // Create new admin user
  const newAdmin: User = {
    id: `admin-${Date.now()}`,
    email: email,
    password: password,
    role: 'admin',
    name: name,
    createdAt: new Date().toISOString()
  };
  
  users.push(newAdmin);
  saveUsers(users);
  
  return { success: true, user: newAdmin };
};

export const removeAdmin = (userId: string, currentUser: User): { success: boolean; error?: string } => {
  // Only admins can remove admins
  if (currentUser.role !== 'admin') {
    return { success: false, error: 'No tienes permisos para eliminar administradores' };
  }
  
  // Cannot remove yourself
  if (userId === currentUser.id) {
    return { success: false, error: 'No puedes eliminarte a ti mismo' };
  }
  
  const users = getUsers();
  const userToRemove = users.find(u => u.id === userId);
  
  // Cannot remove the main admin
  if (userToRemove?.email === MAIN_ADMIN_CONFIG.email) {
    return { success: false, error: 'No puedes eliminar al administrador principal' };
  }
  
  const filteredUsers = users.filter(u => u.id !== userId);
  saveUsers(filteredUsers);
  
  return { success: true };
};

export const getAllAdmins = (): User[] => {
  const users = getUsers();
  return users.filter(u => u.role === 'admin');
};

export const register = (data: RegisterFormData): { success: boolean; error?: string; user?: User } => {
  const users = getUsers();
  
  // Check if email already exists
  const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
  if (existingUser) {
    return { success: false, error: 'Este correo ya está registrado' };
  }
  
  // Validate password
  if (data.password.length < 6) {
    return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }
  
  // Create new user
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: data.email,
    password: data.password, // In production, this should be hashed
    role: 'user',
    name: data.name,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return { success: true, user: newUser };
};

export const login = (email: string, password: string): { success: boolean; error?: string; user?: User } => {
  const users = getUsers();
  
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (!user) {
    return { success: false, error: 'Correo o contraseña incorrectos' };
  }
  
  // Save current user (without password)
  const userSession = { ...user };
  delete (userSession as any).password;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));
  
  return { success: true, user };
};

export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  
  const userSession = JSON.parse(stored);
  // Get full user data including password from users list
  const users = getUsers();
  const fullUser = users.find(u => u.id === userSession.id);
  
  return fullUser || null;
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};



