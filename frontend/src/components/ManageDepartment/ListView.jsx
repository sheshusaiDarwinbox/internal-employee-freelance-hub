import { memo } from "react";
import { Button, Table } from "flowbite-react";
import { HiPencil, HiTrash } from "react-icons/hi";

const ListView = memo(
  ({ searchQuery, departments, handleUpdate, handleDelete }) => {
    return (
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
                      onClick={() => handleUpdate(department)}
                    >
                      <HiPencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      color="red"
                      onClick={() => handleDelete(department._id)}
                    >
                      <HiTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    );
  }
);

export default ListView;
