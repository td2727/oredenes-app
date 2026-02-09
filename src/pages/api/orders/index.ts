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
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
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
    const { userId, patientName, orderType, description, printRequired } = body;

    console.log('📝 Datos recibidos:', { userId, patientName, orderType, printRequired });

    // ✅ priority ya NO es requerido desde el frontend
    if (!userId || !patientName || !orderType) {
      console.error('❌ Campos faltantes');
      return new Response(
        JSON.stringify({ error: 'Todos los campos son requeridos' }),
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

    const orderRepo = new OrderRepository(db);
    const orderId = generateId('order-');

    console.log('💾 Creando orden con ID:', orderId);

    // ✅ DEFINITIVO: priority fijo "Media"
    // ✅ Guardar print_required (0/1)
    const newOrder = await orderRepo.create({
      id: orderId,
      user_id: userId,
      patient_name: patientName,
      order_type: orderType,
      status: 'Pendiente',
      description: description || null,
      priority: 'Media',
      print_required: printRequired ? 1 : 0,
    } as any);

    console.log('✅ Orden creada exitosamente');

    return new Response(
      JSON.stringify({ success: true, order: newOrder }),
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
