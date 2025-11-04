'use client';

export default function TestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Dashboard Enterprise - Test Page</h1>
        <p className="text-xl">If you see this, Next.js is working!</p>
        <div className="mt-8">
          <a href="/login" className="text-blue-600 hover:underline">Go to Login</a>
        </div>
      </div>
    </div>
  );
}
