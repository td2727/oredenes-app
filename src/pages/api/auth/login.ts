import type { APIRoute } from 'astro';
import { UserRepository, verifyPassword } from '../../../lib/db';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = locals?.runtime?.env?.DB;
    
    if (!db) {
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email y contraseña son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userRepo = new UserRepository(db);
    const user = await userRepo.findByEmail(email);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Credenciales inválidas' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Credenciales inválidas' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // No enviar el password_hash al cliente
    const { password_hash, ...userWithoutPassword } = user;

    return new Response(
      JSON.stringify({
        success: true,
        user: userWithoutPassword
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Error al iniciar sesión' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
