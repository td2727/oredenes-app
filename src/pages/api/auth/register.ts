import type { APIRoute } from 'astro';
import { UserRepository, hashPassword, generateId } from '../../../lib/db';

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
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Email, contraseña y nombre son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Formato de email inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'La contraseña debe tener al menos 6 caracteres' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userRepo = new UserRepository(db);
    
    // Verificar si el email ya existe
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Este email ya está registrado' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Crear nuevo usuario
    const passwordHash = await hashPassword(password);
    const userId = generateId('user-');

    const newUser = await userRepo.create({
      id: userId,
      email,
      password_hash: passwordHash,
      name,
      role: 'user'
    });

    // No enviar el password_hash al cliente
    const { password_hash, ...userWithoutPassword } = newUser;

    return new Response(
      JSON.stringify({
        success: true,
        user: userWithoutPassword
      }),
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    return new Response(
      JSON.stringify({ error: 'Error al registrar usuario' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
