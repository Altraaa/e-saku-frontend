const FormSekeleton = () => {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-gray-200 rounded-md"></div>
        <div className="h-4 w-72 bg-gray-200 rounded-md mt-2"></div>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
        <div className="border-b bg-gray-200 p-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-gray-300 rounded-md"></div>
            <div className="h-6 w-40 bg-gray-300 rounded-md"></div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-24 bg-gray-200 rounded-md"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md"></div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="h-5 w-24 bg-gray-200 rounded-md"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md"></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md"></div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="h-5 w-24 bg-gray-200 rounded-md"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
              <div className="h-32 w-full bg-gray-200 rounded-md"></div>
            </div>

            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded-md"></div>
              <div className="h-24 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 pb-6 px-6 border-t pt-4">
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-44 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSekeleton;
