globalThis.process ??= {}; globalThis.process.env ??= {};
function generateId(prefix = "") {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
class UserRepository {
  constructor(db) {
    this.db = db;
  }
  async findByEmail(email) {
    const result = await this.db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    return result;
  }
  async findById(id) {
    const result = await this.db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
    return result;
  }
  async create(user) {
    await this.db.prepare(
      "INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)"
    ).bind(user.id, user.email, user.password_hash, user.name, user.role).run();
    return await this.findById(user.id);
  }
  async updateRole(userId, role) {
    await this.db.prepare("UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(role, userId).run();
  }
  async listAll() {
    const result = await this.db.prepare("SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC").all();
    return result.results || [];
  }
  async delete(userId) {
    await this.db.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();
  }
}
class OrderRepository {
  constructor(db) {
    this.db = db;
  }
  async findById(id) {
    const result = await this.db.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
    return result;
  }
  async findByUserId(userId) {
    const result = await this.db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").bind(userId).all();
    return result.results || [];
  }
  async findAll() {
    const result = await this.db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
    return result.results || [];
  }
  async create(order) {
    await this.db.prepare(
      "INSERT INTO orders (id, user_id, patient_name, order_type, status, description, priority) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      order.id,
      order.user_id,
      order.patient_name,
      order.order_type,
      order.status,
      order.description || null,
      order.priority
    ).run();
    return await this.findById(order.id);
  }
  async update(id, updates) {
    const fields = [];
    const values = [];
    if (updates.patient_name !== void 0) {
      fields.push("patient_name = ?");
      values.push(updates.patient_name);
    }
    if (updates.order_type !== void 0) {
      fields.push("order_type = ?");
      values.push(updates.order_type);
    }
    if (updates.status !== void 0) {
      fields.push("status = ?");
      values.push(updates.status);
    }
    if (updates.description !== void 0) {
      fields.push("description = ?");
      values.push(updates.description);
    }
    if (updates.priority !== void 0) {
      fields.push("priority = ?");
      values.push(updates.priority);
    }
    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);
    await this.db.prepare(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();
    return await this.findById(id);
  }
  async delete(id) {
    await this.db.prepare("DELETE FROM orders WHERE id = ?").bind(id).run();
  }
  async getStatsByUser(userId) {
    const result = await this.db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Pendiente' THEN 1 ELSE 0 END) as pendiente,
          SUM(CASE WHEN status = 'En Proceso' THEN 1 ELSE 0 END) as enProceso,
          SUM(CASE WHEN status = 'Completada' THEN 1 ELSE 0 END) as completada
        FROM orders 
        WHERE user_id = ?
      `).bind(userId).first();
    return {
      total: result?.total || 0,
      pendiente: result?.pendiente || 0,
      enProceso: result?.enProceso || 0,
      completada: result?.completada || 0
    };
  }
}

export { OrderRepository as O, UserRepository as U, generateId as g, hashPassword as h, verifyPassword as v };
