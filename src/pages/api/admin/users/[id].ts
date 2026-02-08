import type { APIRoute } from 'astro';
import { UserRepository } from '../../../../lib/db';

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

    // No permitir que un admin se elimine a sí mismo
    if (id === currentUser.id) {
      return new Response(
        JSON.stringify({ error: 'No puedes eliminar tu propia cuenta' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que el usuario existe
    const userToDelete = await userRepo.findById(id);
    if (!userToDelete) {
      return new Response(
        JSON.stringify({ error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Eliminar usuario (cascade eliminará sus órdenes también)
    await userRepo.delete(id);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return new Response(
      JSON.stringify({ error: 'Error al eliminar usuario' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
