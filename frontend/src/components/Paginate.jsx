import { Button } from "flowbite-react";

const Paginate = ({ currentPage, totalUsers, usersPerPage, paginate }) => {
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="flex justify-center space-x-2 mt-4">
      <Button
        disabled={currentPage === 1}
        onClick={() => paginate(currentPage - 1)}
      >
        Previous
      </Button>
      <span className="flex items-center justify-center text-lg font-semibold">
        {currentPage}
      </span>
      <Button
        disabled={currentPage === totalPages}
        onClick={() => paginate(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default Paginate;
