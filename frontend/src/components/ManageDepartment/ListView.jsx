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
      type: "",
      teamSize: "",
    });

    const initiateUpdate = (department) => {
      setDepartmentToUpdate(department);
      setUpdateFormData({
        name: department.name,
        description: department.description,
        type: department.type,
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
      handleDelete(departmentToDelete._id);
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
              .map((department) => (
                <Table.Row key={department._id}>
                  <Table.Cell>{department.name}</Table.Cell>
                  <Table.Cell>{department.description}</Table.Cell>
                  <Table.Cell>{department.type}</Table.Cell>
                  <Table.Cell>{department.teamSize}</Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        color="yellow"
                        onClick={() => initiateUpdate(department)}
                      >
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        color="red"
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
