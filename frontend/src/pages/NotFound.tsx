export default function NotFound() {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="text-gray-600 mt-2">Page not found</p>
        <a href="/" className="mt-4 text-blue-600">
          Go Home
        </a>
      </div>
    );
  }