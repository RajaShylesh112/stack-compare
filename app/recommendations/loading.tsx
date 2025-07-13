export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="h-4 bg-violet-200 dark:bg-violet-900 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-violet-200 dark:bg-violet-900 rounded w-1/2 mx-auto mb-8"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
