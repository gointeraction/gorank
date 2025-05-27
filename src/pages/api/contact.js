import { db } from 'astro:db';

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Validar los datos del formulario
    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nombre, email y mensaje son campos requeridos' }),
        { status: 400 }
      );
    }

    // Insertar el mensaje en la base de datos
    const newMessage = await db.insert('contactMessages').values({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject || 'Sin asunto',
      message: data.message,
      createdAt: new Date(),
      isRead: false,
      status: 'new'
    }).run();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Mensaje enviado correctamente',
        data: newMessage 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error al procesar el formulario',
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
