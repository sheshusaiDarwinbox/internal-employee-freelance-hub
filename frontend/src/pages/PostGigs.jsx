import { useState, useEffect } from "react";
import { Label, Textarea, Button, Alert } from "flowbite-react";
import { useDispatch, useSelector } from 'react-redux';
import { postGigAsync, clearGigState } from '../redux/slices/gigsSlice';

const PostGigs = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.gigs);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    ManagerID: user?.EID,
    title: "", 
    description: "",
    deadline: "",
    ongoingStatus: "",
    skillsRequired: [],
    assignedAt: "",
    rewardPoints: "",
    rating: "",
    amount: "",
    feedback: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (success) {
      alert("Job posted successfully!");
      dispatch(clearGigState());
      setFormData({
        ManagerID: user?.EID || "",
        title: "",
        description: "",
        deadline: "",
        ongoingStatus: "",
        skillsRequired: [],
        assignedAt: "",
        rewardPoints: "",
        rating: "",
        amount: "",
        feedback: "",
      });
    }
  }, [success, dispatch, user?.EID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    if (!/^[a-zA-Z0-9\s.,!?()&]+$/.test(formData.description)) {
      newErrors.description = "Description contains invalid characters.";
    }
    if (!formData.skillsRequired || formData.skillsRequired.length === 0) newErrors.skillsRequired = "Skills Required is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    dispatch(postGigAsync({
      ...formData,
      ManagerID: user?.EID || "",
      skillsRequired: formData.skillsRequired.split(',').map(skill => skill.trim()),
      amount: formData.amount ? parseInt(formData.amount, 10) : 0,
      deadline: new Date(formData.deadline).toISOString(),
      assignedAt: formData.assignedAt ? new Date(formData.assignedAt).toISOString() : undefined,
    }));
  };

  return (
    <>
      {success && <div className="success">Gig posted successfully!</div>}
      
      <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Post a Gig</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Title", name: "title", type: "text" },
            { label: "Description", name: "description", type: "textarea" },
            { label: "Deadline", name: "deadline", type: "date" },
            { label: "Ongoing Status", name: "ongoingStatus", type: "text" },
            { label: "Skills Required (comma separated)", name: "skillsRequired", type: "text" },
            { label: "Assigned At", name: "assignedAt", type: "date" },
            { label: "Reward Points", name: "rewardPoints", type: "number" },
            { label: "Rating", name: "rating", type: "number" },
            { label: "Amount", name: "amount", type: "number" },
            { label: "Feedback", name: "feedback", type: "textarea" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <Label htmlFor={name}>{label}</Label>
              {type === "textarea" ? (
                <Textarea
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border rounded-md border-gray-500 py-2 px-6"
                />
              ) : (
                <input
                  id={name}
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border rounded-md border-gray-300 py-2 px-6"
                />
              )}
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
            </div>
          ))}
          <Button type="submit" className="w-1/2 mx-auto py-2 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
          {error && (
            <Alert color="failure" className="mt-4">
              <span>{error}</span>
            </Alert>
          )}
        </form>
      </div>
    </>
  );
};

export default PostGigs;