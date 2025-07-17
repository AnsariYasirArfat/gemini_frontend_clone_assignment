export default function SearchListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul>
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="flex items-center justify-between border-b border-zinc-800 p-4"
        >
          <div className="flex-1">
            <div className="h-4 w-2/3 bg-zinc-700 rounded mb-2 animate-pulse" />
            <div className="h-3 w-1/3 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="h-3 w-12 bg-zinc-700 rounded ml-4 animate-pulse" />
        </li>
      ))}
    </ul>
  );
}