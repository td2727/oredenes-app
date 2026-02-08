globalThis.process ??= {}; globalThis.process.env ??= {};
import { O as OrderRepository, g as generateId } from '../../chunks/db_r9w-Y2rw.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request, locals }) => {
  try {
    console.log("📋 GET /api/orders - Inicio");
    const db = locals?.runtime?.env?.DB;
    console.log("🗄️  DB presente:", !!db);
    if (!db) {
      console.error("❌ DB no configurada");
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const isAdmin = url.searchParams.get("isAdmin") === "true";
    console.log("👤 userId:", userId);
    console.log("🔑 isAdmin:", isAdmin);
    const orderRepo = new OrderRepository(db);
    let orders;
    if (isAdmin) {
      console.log("📊 Obteniendo todas las órdenes (admin)");
      orders = await orderRepo.findAll();
    } else if (userId) {
      console.log("📊 Obteniendo órdenes del usuario:", userId);
      orders = await orderRepo.findByUserId(userId);
    } else {
      console.error("❌ userId no proporcionado");
      return new Response(
        JSON.stringify({ error: "userId es requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log("✅ Órdenes obtenidas:", orders.length);
    return new Response(
      JSON.stringify({ orders }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("❌ Get orders error:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener órdenes", details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const POST = async ({ request, locals }) => {
  try {
    console.log("➕ POST /api/orders - Inicio");
    const db = locals?.runtime?.env?.DB;
    if (!db) {
      console.error("❌ DB no configurada");
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const body = await request.json();
    const { userId, patientName, orderType, description, priority } = body;
    console.log("📝 Datos recibidos:", { userId, patientName, orderType, priority });
    if (!userId || !patientName || !orderType || !priority) {
      console.error("❌ Campos faltantes");
      return new Response(
        JSON.stringify({ error: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const validOrderTypes = ["Tomografía", "Radiografía", "Ortodoncia", "Cefalometría"];
    if (!validOrderTypes.includes(orderType)) {
      console.error("❌ Tipo de orden inválido:", orderType);
      return new Response(
        JSON.stringify({ error: "Tipo de orden inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const validPriorities = ["Alta", "Media", "Baja"];
    if (!validPriorities.includes(priority)) {
      console.error("❌ Prioridad inválida:", priority);
      return new Response(
        JSON.stringify({ error: "Prioridad inválida" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const orderRepo = new OrderRepository(db);
    const orderId = generateId("order-");
    console.log("💾 Creando orden con ID:", orderId);
    const newOrder = await orderRepo.create({
      id: orderId,
      user_id: userId,
      patient_name: patientName,
      order_type: orderType,
      status: "Pendiente",
      description: description || null,
      priority
    });
    console.log("✅ Orden creada exitosamente");
    return new Response(
      JSON.stringify({
        success: true,
        order: newOrder
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("❌ Create order error:", error);
    return new Response(
      JSON.stringify({ error: "Error al crear orden", details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
