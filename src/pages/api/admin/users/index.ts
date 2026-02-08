import type { APIRoute } from 'astro';
import { UserRepository } from '../../../../lib/db';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const db = locals?.runtime?.env?.DB;
    
    if (!db) {
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
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

    // Obtener todos los usuarios
    const users = await userRepo.listAll();

    return new Response(
      JSON.stringify({ users }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return new Response(
      JSON.stringify({ error: 'Error al obtener usuarios' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
