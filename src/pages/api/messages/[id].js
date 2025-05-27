// En un entorno real, aquí se actualizaría el estado del mensaje en la base de datos
export async function PATCH({ params, request }) {
  try {
    const { status } = await request.json();
    const { id } = params;
    
    if (!['new', 'in_progress', 'resolved'].includes(status)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Estado no válido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Simular actualización exitosa
    console.log(`Mensaje ${id} actualizado a estado: ${status}`);
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error al actualizar el mensaje:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error al actualizar el mensaje' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
