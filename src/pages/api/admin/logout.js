export function GET() {
  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        'Set-Cookie': 'auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict' + (process.env.NODE_ENV === 'production' ? '; Secure' : ''),
        'Content-Type': 'application/json'
      }
    }
  );
}
