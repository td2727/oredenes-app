import type { APIRoute } from 'astro';
import { OrderRepository, generateId } from '../../../lib/db';

// GET - Obtener órdenes (todas si es admin, solo del usuario si no)
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    console.log('📋 GET /api/orders - Inicio');
    const db = locals?.runtime?.env?.DB;

    console.log('🗄️  DB presente:', !!db);

    if (!db) {
      console.error('❌ DB no configurada');
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const isAdmin = url.searchParams.get('isAdmin') === 'true';

    console.log('👤 userId:', userId);
    console.log('🔑 isAdmin:', isAdmin);

    const orderRepo = new OrderRepository(db);
    let orders;

    if (isAdmin) {
      console.log('📊 Obteniendo todas las órdenes (admin)');
      orders = await orderRepo.findAll();
    } else if (userId) {
      console.log('📊 Obteniendo órdenes del usuario:', userId);
      orders = await orderRepo.findByUserId(userId);
    } else {
      console.error('❌ userId no proporcionado');
      return new Response(
        JSON.stringify({ error: 'userId es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Órdenes obtenidas:', orders.length);

    return new Response(
      JSON.stringify({ orders }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Get orders error:', error);
    return new Response(
      JSON.stringify({
        error: 'Error al obtener órdenes',
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST - Crear nueva orden
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    console.log('➕ POST /api/orders - Inicio');
    const db = locals?.runtime?.env?.DB;

    if (!db) {
      console.error('❌ DB no configurada');
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();

    // ✅ NUEVO: ya no usamos priority/notes
    const {
      userId,
      patientName,
      patientId,
      phoneNumber,
      email,
      orderType,
      description,
      printRequired, // boolean esperado
    } = body;

    console.log('📝 Datos recibidos:', {
      userId,
      patientName,
      patientId,
      phoneNumber,
      email,
      orderType,
      printRequired,
    });

    // ✅ Campos requeridos (ajusta si quieres)
    if (!userId || !patientName || !patientId || !phoneNumber ) {
      console.error('❌ Campos faltantes');
      return new Response(
        JSON.stringify({ error: 'Todos los campos requeridos deben completarse' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar tipo de orden
    const validOrderTypes = ['Tomografía', 'Radiografía', 'Ortodoncia', 'Cefalometría'];
    if (!validOrderTypes.includes(orderType)) {
      console.error('❌ Tipo de orden inválido:', orderType);
      return new Response(
        JSON.stringify({ error: 'Tipo de orden inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar printRequired si viene
    // (si no viene, lo tratamos como false)
    const printRequiredBool = Boolean(printRequired);

    const orderRepo = new OrderRepository(db);
    const orderId = generateId('order-');

    console.log('💾 Creando orden con ID:', orderId);

    // ⚠️ IMPORTANTE:
    // Aquí debes alinear los nombres con tu tabla y con OrderRepository.create(...)
    // Si tu tabla aún no tiene estas columnas, primero hay que agregarlas (ALTER TABLE) y actualizar el repo.

    const newOrder = await orderRepo.create({
      id: orderId,
      user_id: userId,

      // AJUSTA AQUÍ si tus columnas tienen otro nombre:
      patient_name: patientName,

      // Si tu DB NO tiene estos campos, comenta estas líneas por ahora:
      patient_id: patientId,         // <-- AJUSTA AQUÍ
      phone_number: phoneNumber,     // <-- AJUSTA AQUÍ
      email: email || null,          // <-- AJUSTA AQUÍ

      order_type: orderType,
      status: 'Pendiente',
      description: description || null,

      // NUEVO:
      print_required: printRequiredBool ? 1 : 0, // <-- si tu DB lo maneja como INTEGER
    });

    console.log('✅ Orden creada exitosamente');

    return new Response(
      JSON.stringify({
        success: true,
        order: newOrder,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Create order error:', error);
    return new Response(
      JSON.stringify({
        error: 'Error al crear orden',
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
