import { Button, TextInput, Label } from "flowbite-react";

const FormView = ({ handleCreate, setFormData, formData }) => (
  <div className="space-y-4">
    <form onSubmit={handleCreate} className="space-y-4">
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
        <Label htmlFor="location">Location</Label>
        <TextInput
          id="location"
          required
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="manager">Manager</Label>
        <TextInput
          id="manager"
          required
          value={formData.manager}
          onChange={(e) =>
            setFormData({ ...formData, manager: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="budget">Budget</Label>
        <TextInput
          id="budget"
          type="number"
          required
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
        />
      </div>
      <Button type="submit" className="bg-blue-400">
        {formData.id ? "Update Department" : "Create Department"}
      </Button>
    </form>
  </div>
);

export default FormView;
