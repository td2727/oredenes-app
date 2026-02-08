

export interface MedicalOrder {
  id: string;
  patientName: string;
  patientId: string;
  phoneNumber: string;
  email?: string;
  orderType: 'tomografia' | 'radiografia' | 'ortodoncia' | 'cefalometria';
  description: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  createdBy: string;
  notes?: string;
  documents?: string[];
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
  createdAt: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export type OrderFormData = Omit<MedicalOrder, 'id' | 'createdAt' | 'createdBy' | 'status'>;


