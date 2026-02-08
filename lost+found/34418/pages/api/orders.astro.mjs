globalThis.process ??= {}; globalThis.process.env ??= {};
import { O as OrderRepository, g as generateId } from '../../chunks/db_r9w-Y2rw.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request, locals }) => {
  try {
    const db = locals?.runtime?.env?.DB;
    if (!db) {
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const isAdmin = url.searchParams.get("isAdmin") === "true";
    const orderRepo = new OrderRepository(db);
    let orders;
    if (isAdmin) {
      orders = await orderRepo.findAll();
    } else if (userId) {
      orders = await orderRepo.findByUserId(userId);
    } else {
      return new Response(
        JSON.stringify({ error: "userId es requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ orders }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Get orders error:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener órdenes" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const POST = async ({ request, locals }) => {
  try {
    const db = locals?.runtime?.env?.DB;
    if (!db) {
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const body = await request.json();
    const { userId, patientName, orderType, description, priority } = body;
    if (!userId || !patientName || !orderType || !priority) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const validOrderTypes = ["Tomografía", "Radiografía", "Ortodoncia", "Cefalometría"];
    if (!validOrderTypes.includes(orderType)) {
      return new Response(
        JSON.stringify({ error: "Tipo de orden inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const validPriorities = ["Alta", "Media", "Baja"];
    if (!validPriorities.includes(priority)) {
      return new Response(
        JSON.stringify({ error: "Prioridad inválida" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const orderRepo = new OrderRepository(db);
    const orderId = generateId("order-");
    const newOrder = await orderRepo.create({
      id: orderId,
      user_id: userId,
      patient_name: patientName,
      order_type: orderType,
      status: "Pendiente",
      description: description || null,
      priority
    });
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
    console.error("Create order error:", error);
    return new Response(
      JSON.stringify({ error: "Error al crear orden" }),
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
