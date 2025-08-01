'use client';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="mt-4 text-gray-600">The page you're looking for doesn't exist.</p>
            <a
                href="/"
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
                Go back home
            </a>
        </div>
    );
}
