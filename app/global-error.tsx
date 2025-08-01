'use client';

import React from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <html>
            <body>
                <h2>Something went wrong!</h2>
                <p>{error.message}</p>
                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    );
}
