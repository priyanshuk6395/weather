'use client';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ background: '#000', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
          <h2>System Error</h2>
          <p style={{ opacity: 0.7 }}>A critical error occurred.</p>
          <button
            onClick={() => reset()}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px' }}
          >
            Reset
          </button>
        </div>
      </body>
    </html>
  );
}