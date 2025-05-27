export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Validar los datos del formulario
    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nombre, email y mensaje son campos requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // En un entorno real, aquí se guardaría el mensaje en una base de datos
    console.log('Nuevo mensaje de contacto recibido:', {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject || 'Sin asunto',
      message: data.message,
      receivedAt: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.'
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
