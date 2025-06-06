export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16 border-b bg-background"></div>

      <div className="relative h-[40vh] bg-muted animate-pulse"></div>

      <div className="container py-6">
        <div className="h-8 w-1/3 bg-muted rounded-md animate-pulse mb-6"></div>

        <div className="h-12 w-full bg-muted rounded-md animate-pulse mb-6"></div>

        <div className="h-8 w-full bg-muted rounded-md animate-pulse mb-4"></div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="h-6 w-1/4 bg-muted rounded-md animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-muted rounded-md animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-muted rounded-md animate-pulse mb-2"></div>
              <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse"></div>
            </div>

            <div>
              <div className="h-6 w-1/4 bg-muted rounded-md animate-pulse mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse"></div>
                    <div className="h-2 w-full bg-muted rounded-md animate-pulse"></div>
                    <div className="h-4 w-1/3 bg-muted rounded-md animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="h-6 w-1/4 bg-muted rounded-md animate-pulse mb-4"></div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-24 bg-muted rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="h-64 bg-muted rounded-md animate-pulse mb-6"></div>
            <div className="h-64 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
