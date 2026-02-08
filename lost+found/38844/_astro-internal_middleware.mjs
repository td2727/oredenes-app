globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as defineMiddleware, s as sequence } from './chunks/index_l7IkEuBm.mjs';
import { h as hashPassword } from './chunks/db_r9w-Y2rw.mjs';
import './chunks/astro-designed-error-pages_BA9zK58z.mjs';
import './chunks/astro/server_CAomdprQ.mjs';

const devDatabase = {
  users: [],
  orders: [],
  initialized: false
};
async function initializeDevDatabase() {
  if (devDatabase.initialized) return;
  const adminPasswordHash = await hashPassword("3008david");
  devDatabase.users.push({
    id: "admin-main",
    email: "loradavid000@gmail.com",
    password_hash: adminPasswordHash,
    name: "David Lora",
    role: "admin",
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  devDatabase.initialized = true;
  console.log("✅ Base de datos de desarrollo inicializada");
  console.log("📧 Admin: loradavid000@gmail.com / 3008david");
}
const createDevD1Simulator = () => {
  return {
    prepare: (query) => {
      const preparedQuery = {
        bind: (...params) => {
          return {
            first: async () => {
              try {
                if (query.includes("SELECT * FROM users WHERE email")) {
                  const email = params[0];
                  const user = devDatabase.users.find((u) => u.email === email);
                  return user || null;
                }
                if (query.includes("SELECT * FROM users WHERE id")) {
                  const id = params[0];
                  const user = devDatabase.users.find((u) => u.id === id);
                  return user || null;
                }
                if (query.includes("SELECT * FROM orders WHERE id")) {
                  const id = params[0];
                  const order = devDatabase.orders.find((o) => o.id === id);
                  return order || null;
                }
                return null;
              } catch (error) {
                console.error("Error in first():", error);
                return null;
              }
            },
            all: async () => {
              try {
                if (query.includes("SELECT id, email, name, role, created_at FROM users")) {
                  return {
                    results: devDatabase.users.map((u) => ({
                      id: u.id,
                      email: u.email,
                      name: u.name,
                      role: u.role,
                      created_at: u.created_at
                    }))
                  };
                }
                if (query.includes("SELECT * FROM orders WHERE user_id")) {
                  const userId = params[0];
                  const userOrders = devDatabase.orders.filter((o) => o.user_id === userId);
                  return { results: userOrders };
                }
                if (query.includes("SELECT * FROM orders ORDER BY created_at")) {
                  return { results: devDatabase.orders };
                }
                if (query.includes("COUNT(*) as total")) {
                  const userId = params[0];
                  const userOrders = devDatabase.orders.filter((o) => o.user_id === userId);
                  const stats = {
                    total: userOrders.length,
                    pendiente: userOrders.filter((o) => o.status === "Pendiente").length,
                    enProceso: userOrders.filter((o) => o.status === "En Proceso").length,
                    completada: userOrders.filter((o) => o.status === "Completada").length
                  };
                  return { results: [stats] };
                }
                return { results: [] };
              } catch (error) {
                console.error("Error in all():", error);
                return { results: [] };
              }
            },
            run: async () => {
              try {
                if (query.includes("INSERT INTO users")) {
                  const [id, email, password_hash, name, role] = params;
                  const newUser = {
                    id,
                    email,
                    password_hash,
                    name,
                    role,
                    created_at: (/* @__PURE__ */ new Date()).toISOString(),
                    updated_at: (/* @__PURE__ */ new Date()).toISOString()
                  };
                  devDatabase.users.push(newUser);
                  console.log("✅ Usuario creado:", email);
                } else if (query.includes("INSERT INTO orders")) {
                  const [id, user_id, patient_name, order_type, status, description, priority] = params;
                  const newOrder = {
                    id,
                    user_id,
                    patient_name,
                    order_type,
                    status,
                    description,
                    priority,
                    created_at: (/* @__PURE__ */ new Date()).toISOString(),
                    updated_at: (/* @__PURE__ */ new Date()).toISOString()
                  };
                  devDatabase.orders.push(newOrder);
                  console.log("✅ Orden creada:", patient_name, "-", order_type);
                } else if (query.includes("UPDATE users SET role")) {
                  const [role, userId] = params.slice(-2);
                  const userIndex = devDatabase.users.findIndex((u) => u.id === userId);
                  if (userIndex !== -1) {
                    devDatabase.users[userIndex].role = role;
                    devDatabase.users[userIndex].updated_at = (/* @__PURE__ */ new Date()).toISOString();
                    console.log("✅ Rol actualizado:", devDatabase.users[userIndex].email, "→", role);
                  }
                } else if (query.includes("UPDATE orders SET")) {
                  const orderId = params[params.length - 1];
                  const orderIndex = devDatabase.orders.findIndex((o) => o.id === orderId);
                  if (orderIndex !== -1) {
                    const order = devDatabase.orders[orderIndex];
                    if (query.includes("status = ?")) {
                      order.status = params[0];
                    }
                    if (query.includes("patient_name = ?")) {
                      const patientNameIndex = query.split(",").findIndex((s) => s.includes("patient_name"));
                      if (patientNameIndex !== -1) {
                        order.patient_name = params[patientNameIndex];
                      }
                    }
                    if (query.includes("order_type = ?")) {
                      const orderTypeIndex = query.split(",").findIndex((s) => s.includes("order_type"));
                      if (orderTypeIndex !== -1) {
                        order.order_type = params[orderTypeIndex];
                      }
                    }
                    if (query.includes("description = ?")) {
                      const descIndex = query.split(",").findIndex((s) => s.includes("description"));
                      if (descIndex !== -1) {
                        order.description = params[descIndex];
                      }
                    }
                    if (query.includes("priority = ?")) {
                      const priorityIndex = query.split(",").findIndex((s) => s.includes("priority"));
                      if (priorityIndex !== -1) {
                        order.priority = params[priorityIndex];
                      }
                    }
                    order.updated_at = (/* @__PURE__ */ new Date()).toISOString();
                    console.log("✅ Orden actualizada:", order.patient_name);
                  }
                } else if (query.includes("DELETE FROM users WHERE id")) {
                  const id = params[0];
                  const index = devDatabase.users.findIndex((u) => u.id === id);
                  if (index !== -1) {
                    const deletedUser = devDatabase.users[index];
                    devDatabase.users.splice(index, 1);
                    devDatabase.orders = devDatabase.orders.filter((o) => o.user_id !== id);
                    console.log("❌ Usuario eliminado:", deletedUser.email);
                  }
                } else if (query.includes("DELETE FROM orders WHERE id")) {
                  const id = params[0];
                  const index = devDatabase.orders.findIndex((o) => o.id === id);
                  if (index !== -1) {
                    const deletedOrder = devDatabase.orders[index];
                    devDatabase.orders.splice(index, 1);
                    console.log("❌ Orden eliminada:", deletedOrder.patient_name);
                  }
                }
                return { success: true };
              } catch (error) {
                console.error("Error in run():", error);
                return { success: false, error };
              }
            }
          };
        },
        // Métodos directos sin bind (para queries sin parámetros)
        all: async () => {
          try {
            if (query.includes("SELECT * FROM orders ORDER BY created_at")) {
              return { results: devDatabase.orders };
            }
            if (query.includes("SELECT id, email, name, role, created_at FROM users")) {
              return {
                results: devDatabase.users.map((u) => ({
                  id: u.id,
                  email: u.email,
                  name: u.name,
                  role: u.role,
                  created_at: u.created_at
                }))
              };
            }
            return { results: [] };
          } catch (error) {
            console.error("Error in direct all():", error);
            return { results: [] };
          }
        },
        first: async () => {
          try {
            return null;
          } catch (error) {
            console.error("Error in direct first():", error);
            return null;
          }
        }
      };
      return preparedQuery;
    }
  };
};
const onRequest$2 = defineMiddleware(async (context, next) => {
  if (!context.locals?.runtime?.env?.DB) {
    await initializeDevDatabase();
    if (!context.locals.runtime) {
      context.locals.runtime = {};
    }
    if (!context.locals.runtime.env) {
      context.locals.runtime.env = {};
    }
    context.locals.runtime.env.DB = createDevD1Simulator();
  }
  return next();
});

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	onRequest$2
	
);

export { onRequest };
