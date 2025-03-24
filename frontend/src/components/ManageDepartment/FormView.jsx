import { Button, TextInput, Label, Select } from "flowbite-react";
import { DepartmentFunctions } from "../../pages/ManageDepartment";

const FormView = ({ handleSubmit, setFormData, formData }) => (
  <div className=" p-6 bg-white rounded-xl shadow-lg">
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label
          htmlFor="name"
          className="text-sm font-semibold text-gray-700 mb-1"
        >
          Department Name
        </Label>
        <TextInput
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Enter department name"
        />
      </div>

      <div>
        <Label
          htmlFor="description"
          className="text-sm font-semibold text-gray-700 mb-1"
        >
          Description
        </Label>
        <TextInput
          id="description"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Enter department description"
        />
      </div>

      <div>
        <Label
          htmlFor="function"
          className="text-sm font-semibold text-gray-700 mb-1"
        >
          Function
        </Label>
        <Select
          id="function"
          required
          value={formData.function}
          onChange={(e) =>
            setFormData({ ...formData, function: e.target.value })
          }
          className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          {Object.values(DepartmentFunctions).map((func) => (
            <option key={func} value={func}>
              {func}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label
          htmlFor="teamSize"
          className="text-sm font-semibold text-gray-700 mb-1"
        >
          Team Size
        </Label>
        <TextInput
          id="teamSize"
          required
          type="number"
          min="0"
          value={formData.teamSize}
          onChange={(e) =>
            setFormData({ ...formData, teamSize: e.target.value })
          }
          className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Enter team size"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      >
        {formData.id ? "Update Department" : "Create Department"}
      </Button>
    </form>
  </div>
);

export default FormView;
