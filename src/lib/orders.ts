import type { MedicalOrder, OrderFormData } from '../types/order';

const ORDERS_KEY = 'medical_orders';

export function getAllOrders(): MedicalOrder[] {
  if (typeof window === 'undefined') return [];
  const ordersStr = localStorage.getItem(ORDERS_KEY);
  return ordersStr ? JSON.parse(ordersStr) : [];
}

export const getOrders = (userId?: string, isAdmin: boolean = false): MedicalOrder[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(ORDERS_KEY);
  if (!stored) return [];
  
  const allOrders = JSON.parse(stored) as MedicalOrder[];
  
  // Admins see all orders, users only see their own
  if (isAdmin) {
    return allOrders;
  }
  
  return allOrders.filter(order => order.createdBy === userId);
};

export function getOrdersByUser(userId: string): MedicalOrder[] {
  return getAllOrders().filter(order => order.createdBy === userId);
}

export function createOrder(orderData: OrderFormData, userId: string): MedicalOrder {
  const orders = getAllOrders();
  const newOrder: MedicalOrder = {
    ...orderData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    createdBy: userId,
    status: 'pending'
  };
  
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: MedicalOrder['status']): boolean {
  const orders = getAllOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) return false;
  
  orders[orderIndex].status = status;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return true;
}

export function deleteOrder(orderId: string): boolean {
  const orders = getAllOrders();
  const filteredOrders = orders.filter(o => o.id !== orderId);
  
  if (filteredOrders.length === orders.length) return false;
  
  localStorage.setItem(ORDERS_KEY, JSON.stringify(filteredOrders));
  return true;
}
