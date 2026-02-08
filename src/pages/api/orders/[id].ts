import type { APIRoute } from 'astro';
import { OrderRepository } from '../../../lib/db';

// GET - Obtener una orden específica
export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const db = locals?.runtime?.env?.DB;
    
    if (!db) {
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID de orden requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const orderRepo = new OrderRepository(db);
    const order = await orderRepo.findById(id);

    if (!order) {
      return new Response(
        JSON.stringify({ error: 'Orden no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ order }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Get order error:', error);
    return new Response(
      JSON.stringify({ error: 'Error al obtener orden' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PATCH - Actualizar una orden
export const PATCH: APIRoute = async ({ params, request, locals }) => {
  try {
    const db = locals?.runtime?.env?.DB;
    
    if (!db) {
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID de orden requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { patientName, orderType, status, description, priority, userId, isAdmin } = body;

    const orderRepo = new OrderRepository(db);
    const existingOrder = await orderRepo.findById(id);

    if (!existingOrder) {
      return new Response(
        JSON.stringify({ error: 'Orden no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar permisos: solo el dueño o un admin puede editar
    if (!isAdmin && existingOrder.user_id !== userId) {
      return new Response(
        JSON.stringify({ error: 'No tienes permiso para editar esta orden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updates: any = {};
    
    if (patientName !== undefined) updates.patient_name = patientName;
    if (orderType !== undefined) updates.order_type = orderType;
    if (status !== undefined) updates.status = status;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;

    const updatedOrder = await orderRepo.update(id, updates);

    return new Response(
      JSON.stringify({
        success: true,
        order: updatedOrder
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Update order error:', error);
    return new Response(
      JSON.stringify({ error: 'Error al actualizar orden' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE - Eliminar una orden
export const DELETE: APIRoute = async ({ params, request, locals }) => {
  try {
    const db = locals?.runtime?.env?.DB;
    
    if (!db) {
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID de orden requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const isAdmin = url.searchParams.get('isAdmin') === 'true';

    const orderRepo = new OrderRepository(db);
    const order = await orderRepo.findById(id);

    if (!order) {
      return new Response(
        JSON.stringify({ error: 'Orden no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar permisos: solo el dueño o un admin puede eliminar
    if (!isAdmin && order.user_id !== userId) {
      return new Response(
        JSON.stringify({ error: 'No tienes permiso para eliminar esta orden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await orderRepo.delete(id);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Delete order error:', error);
    return new Response(
      JSON.stringify({ error: 'Error al eliminar orden' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
