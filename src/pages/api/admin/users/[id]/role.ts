import type { APIRoute } from 'astro';
import { UserRepository } from '../../../../../lib/db';

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
        JSON.stringify({ error: 'ID de usuario requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que el usuario sea admin
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userRepo = new UserRepository(db);
    const currentUser = await userRepo.findById(authHeader);

    if (!currentUser || currentUser.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'No tienes permisos de administrador' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !['admin', 'user'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Rol inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // No permitir que un admin se quite sus propios permisos
    if (id === currentUser.id && role === 'user') {
      return new Response(
        JSON.stringify({ error: 'No puedes quitarte tus propios permisos de administrador' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await userRepo.updateRole(id, role);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Update role error:', error);
    return new Response(
      JSON.stringify({ error: 'Error al actualizar el rol' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
