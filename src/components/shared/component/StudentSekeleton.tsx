const StudentSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-2 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <div className="h-8 w-56 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
          <div className="w-full sm:w-32">
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="relative w-full sm:w-48">
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="relative w-full sm:w-72">
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-8 mt-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="w-2 h-full absolute left-0 top-0 bg-green-100 rounded-l-lg"></div>
            <div className="py-8 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200"></div>
              <div className="mt-4 h-6 w-32 bg-gray-200 rounded-md"></div>
              <div className="mt-2 h-4 w-16 bg-gray-200 rounded-md"></div>
              <div className="mt-2 flex items-center px-4">
                <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSkeleton;