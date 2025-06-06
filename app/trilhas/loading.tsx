export default function Loading() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="h-10 w-2/3 bg-muted rounded-md animate-pulse" />
        <div className="h-6 w-1/2 bg-muted rounded-md animate-pulse" />

        <div className="h-16 w-full bg-muted rounded-md animate-pulse mt-4" />

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-9 w-40 bg-muted rounded-md animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg border h-[300px] animate-pulse bg-muted"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
