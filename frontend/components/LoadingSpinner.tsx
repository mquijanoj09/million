interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "white" | "gray";
}

export default function LoadingSpinner({
  size = "md",
  color = "blue",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colorClasses = {
    blue: "border-indigo-600",
    white: "border-white",
    gray: "border-gray-600",
  };

  return (
    <div
      className={`animate-spin rounded-full m-auto border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
    ></div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="animate-pulse h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
