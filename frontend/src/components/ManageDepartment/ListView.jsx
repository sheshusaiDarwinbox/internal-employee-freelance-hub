import { memo, useState } from "react";
import { Button, Table, Modal, Label, TextInput } from "flowbite-react";
import { HiPencil, HiTrash, HiExclamation } from "react-icons/hi";

const ListView = memo(
  ({ searchQuery, departments, handleUpdate, handleDelete }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);
    const [departmentToUpdate, setDepartmentToUpdate] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({
      name: "",
      description: "",
      function: "",
      teamSize: "",
    });

    const initiateUpdate = (department) => {
      setDepartmentToUpdate(department);
      setUpdateFormData({
        name: department.name,
        description: department.description,
        function: department.function,
        teamSize: department.teamSize,
      });
      setShowUpdateModal(true);
    };

    const handleUpdateSubmit = (e) => {
      e.preventDefault();
      handleUpdate({ ...updateFormData, _id: departmentToUpdate._id });
      setShowUpdateModal(false);
      setDepartmentToUpdate(null);
    };

    const confirmDelete = (department) => {
      setDepartmentToDelete(department);
      setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
      handleDelete(departmentToDelete.DID);
      setShowDeleteModal(false);
      setDepartmentToDelete(null);
    };

    return (
      <>
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Function</Table.HeadCell>
            <Table.HeadCell>TeamSize</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {departments
              .filter((dept) =>
                dept.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((department, index) => (
                <Table.Row
                  key={department.DID}
                  className={`
        border-b border-gray-200 transition-colors duration-150 hover:bg-gray-50
        ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
      `}
                >
                  <Table.Cell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {department.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        ID: {department.DID}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-6 py-4">
                    <p className="text-gray-600 line-clamp-2">
                      {department.description}
                    </p>
                  </Table.Cell>
                  <Table.Cell className="px-6 py-4">
                    <span
                      className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${
            department.function === "Engineering"
              ? "bg-blue-100 text-blue-800"
              : ""
          }
          ${
            department.function === "Product"
              ? "bg-green-100 text-green-800"
              : ""
          }
          ${
            department.function === "Finance"
              ? "bg-yellow-100 text-yellow-800"
              : ""
          }
          ${
            department.function === "Marketing"
              ? "bg-purple-100 text-purple-800"
              : ""
          }
          ${department.function === "Sales" ? "bg-pink-100 text-pink-800" : ""}
          ${
            department.function === "CustomerSupport"
              ? "bg-indigo-100 text-indigo-800"
              : ""
          }
          ${department.function === "Other" ? "bg-gray-100 text-gray-800" : ""}
        `}
                    >
                      {department.function}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                        {department.teamSize}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        members
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-amber-50 hover:bg-amber-100 text-amber-600 border-0"
                        onClick={() => initiateUpdate(department)}
                      >
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-50 hover:bg-red-100 text-red-600 border-0"
                        onClick={() => confirmDelete(department)}
                      >
                        <HiTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>

        <Modal
          show={showDeleteModal}
          size="md"
          onClose={() => setShowDeleteModal(false)}
        >
          <Modal.Header>Confirm Delete</Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <HiExclamation className="mx-auto mb-4 h-14 w-14 text-red-500" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                Are you sure you want to delete department "
                {departmentToDelete?.name}"?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="red" onClick={handleConfirmDelete}>
                  Yes, delete
                </Button>
                <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={showUpdateModal}
          size="md"
          onClose={() => setShowUpdateModal(false)}
        >
          <Modal.Header>Update Department</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Department Name</Label>
                <TextInput
                  id="name"
                  value={updateFormData.name}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <TextInput
                  id="description"
                  value={updateFormData.description}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Function</Label>
                <TextInput
                  id="type"
                  value={updateFormData.type}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      type: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <TextInput
                  id="teamSize"
                  type="number"
                  value={updateFormData.teamSize}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      teamSize: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button color="gray" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="blue">
                  Update Department
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
);

export default ListView;
