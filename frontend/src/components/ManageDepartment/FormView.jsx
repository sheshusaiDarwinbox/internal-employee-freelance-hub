import { Button, TextInput, Label, Select } from "flowbite-react";
import { DepartmentFunctions } from "../../pages/ManageDepartment";

const FormView = ({ handleSubmit, setFormData, formData }) => (
  <div className="space-y-4">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Department Name</Label>
        <TextInput
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <TextInput
          id="description"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="location">Function</Label>
        <Select
          id="function"
          required
          value={formData.function}
          onChange={(e) =>
            setFormData({ ...formData, function: e.target.value })
          }
        >
          {Object.values(DepartmentFunctions).map((func) => (
            <option key={func} value={func}>
              {func}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="teamSize">teamSize</Label>
        <TextInput
          id="teamSize"
          required
          value={formData.teamSize}
          onChange={(e) =>
            setFormData({ ...formData, teamSize: e.target.value })
          }
        />
      </div>
      <Button type="submit" className="bg-blue-400">
        {formData.id ? "Update Department" : "Create Department"}
      </Button>
    </form>
  </div>
);

export default FormView;
