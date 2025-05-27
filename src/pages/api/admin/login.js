import { db } from 'astro:db';

// En un entorno real, esto debería estar en variables de entorno
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // ¡Cambia esto en producción!

export async function POST({ request }) {
  try {
    const { username, password } = await request.json();
    
    // Validar credenciales
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // En un entorno real, aquí generarías un token JWT seguro
      const token = Buffer.from(`${username}:${password}`).toString('base64');
      
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            'Set-Cookie': `auth=${token}; Path=/; HttpOnly; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Credenciales inválidas' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error en el login:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
