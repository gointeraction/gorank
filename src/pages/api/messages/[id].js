import { db } from 'astro:db';
import { ContactMessages } from '../../../db/schema';
import { eq } from 'astro:db';

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
    
    // Actualizar el estado del mensaje
    await db.update(ContactMessages)
      .set({ status })
      .where(eq(ContactMessages.id, id));
    
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
