// Database utilities for Cloudflare D1
import type { D1Database } from '@cloudflare/workers-types';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  patient_name: string;
  order_type: 'Tomografía' | 'Radiografía' | 'Ortodoncia' | 'Cefalometría';
  status: 'Pendiente' | 'En Proceso' | 'Completada';
  description: string | null;
  priority: 'Alta' | 'Media' | 'Baja';
  created_at: string;
  updated_at: string;
}

// Generar ID único
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Hash simple para passwords (en producción usar bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verificar password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Operaciones de usuarios
export class UserRepository {
  constructor(private db: D1Database) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first<User>();
    return result;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(id)
      .first<User>();
    return result;
  }

  async create(user: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
    await this.db
      .prepare(
        'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(user.id, user.email, user.password_hash, user.name, user.role)
      .run();

    return (await this.findById(user.id))!;
  }

  async updateRole(userId: string, role: 'admin' | 'user'): Promise<void> {
    await this.db
      .prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(role, userId)
      .run();
  }

  async listAll(): Promise<User[]> {
    const result = await this.db
      .prepare('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC')
      .all<User>();
    return result.results || [];
  }

  async delete(userId: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM users WHERE id = ?')
      .bind(userId)
      .run();
  }
}

// Operaciones de órdenes
export class OrderRepository {
  constructor(private db: D1Database) {}

  async findById(id: string): Promise<Order | null> {
    const result = await this.db
      .prepare('SELECT * FROM orders WHERE id = ?')
      .bind(id)
      .first<Order>();
    return result;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const result = await this.db
      .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
      .bind(userId)
      .all<Order>();
    return result.results || [];
  }

  async findAll(): Promise<Order[]> {
    const result = await this.db
      .prepare('SELECT * FROM orders ORDER BY created_at DESC')
      .all<Order>();
    return result.results || [];
  }

  async create(order: Omit<Order, 'created_at' | 'updated_at'>): Promise<Order> {
    await this.db
      .prepare(
        'INSERT INTO orders (id, user_id, patient_name, order_type, status, description, priority) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(
        order.id,
        order.user_id,
        order.patient_name,
        order.order_type,
        order.status,
        order.description || null,
        order.priority
      )
      .run();

    return (await this.findById(order.id))!;
  }

  async update(
    id: string,
    updates: Partial<Pick<Order, 'patient_name' | 'order_type' | 'status' | 'description' | 'priority'>>
  ): Promise<Order> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.patient_name !== undefined) {
      fields.push('patient_name = ?');
      values.push(updates.patient_name);
    }
    if (updates.order_type !== undefined) {
      fields.push('order_type = ?');
      values.push(updates.order_type);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.priority !== undefined) {
      fields.push('priority = ?');
      values.push(updates.priority);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await this.db
      .prepare(`UPDATE orders SET ${fields.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run();

    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM orders WHERE id = ?')
      .bind(id)
      .run();
  }

  async getStatsByUser(userId: string): Promise<{
    total: number;
    pendiente: number;
    enProceso: number;
    completada: number;
  }> {
    const result = await this.db
      .prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Pendiente' THEN 1 ELSE 0 END) as pendiente,
          SUM(CASE WHEN status = 'En Proceso' THEN 1 ELSE 0 END) as enProceso,
          SUM(CASE WHEN status = 'Completada' THEN 1 ELSE 0 END) as completada
        FROM orders 
        WHERE user_id = ?
      `)
      .bind(userId)
      .first<any>();

    return {
      total: result?.total || 0,
      pendiente: result?.pendiente || 0,
      enProceso: result?.enProceso || 0,
      completada: result?.completada || 0,
    };
  }
}
