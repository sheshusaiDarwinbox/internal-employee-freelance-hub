import { Button } from "flowbite-react";

const PaginationControls = ({
  setCurrentPage,
  totalPages,
  currentPage,
  loading,
}) => {
  function createArray(n) {
    return Array.from({ length: n }, (_, index) => index + 1);
  }

  return (
    <div className="flex justify-between items-center mt-4 px-4">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="px-3 py-1"
          disabled={currentPage === 1 || loading}
          onClick={() => setCurrentPage(1)}
        >
          First
        </Button>
        <Button
          size="sm"
          className="px-3 py-1"
          disabled={currentPage === 1 || loading}
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        >
          Previous
        </Button>

        <div className="flex gap-1">
          {createArray(totalPages).map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-3 py-1">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={page === currentPage || loading}
                className={`
                  px-3 py-1 rounded-md min-w-[2.5rem] text-sm font-medium
                  ${
                    page === currentPage
                      ? "bg-[#678DC6] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }
                  ${
                    loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }
                  transition-colors duration-200
                `}
              >
                {page}
              </button>
            )
          )}
        </div>

        <Button
          size="sm"
          className="px-3 py-1"
          disabled={currentPage === totalPages || loading}
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
        >
          Next
        </Button>
        <Button
          size="sm"
          className="px-3 py-1"
          disabled={currentPage === totalPages || loading}
          onClick={() => setCurrentPage(totalPages)}
        >
          Last
        </Button>
      </div>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default PaginationControls;
