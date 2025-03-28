import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import api from "../utils/api";

export default function PostGigs() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    amount: 0,
    deadline: "",
    img: "",
    rewardPoints: 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [weight, setWeight] = useState("");
  const [errors, setErrors] = useState({});
  const imageInputRef = useRef(null);
  const initialFormState = {
    title: "",
    description: "",
    amount: 0,
    deadline: "",
    skills: [],
    img: "",
    rewardPoints: 0,
  };

  const today = new Date().toISOString().split("T")[0];

  const CreateGigZodSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    skills: z.array(
      z.object({
        skill: z.string().min(1),
        weight: z.number().min(0).max(1),
      })
    ),
    amount: z.number().int().gte(0, "Amount must be a number greater than or equal to 0"),
    deadline: z
      .string()
      .refine((val) => val >= today, "Deadline must be today or a future date"),
    img: z.string().optional(),
    rewardPoints: z.number().int().gte(0, "Reward points must be a number greater than or equal to 0"),
  });

  useEffect(() => {
    async function fetchSkills() {
      const response = await api.get("api/util/get-skills", {
        withCredentials: true,
      });
      setSkillsList(response.data);
    }
    fetchSkills();
  }, []);

  const handleReset = () => {
    setFormData(initialFormState);
    setSelectedImage(null);
    setImagePreview("");
    setErrors({});
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    
  };

  const handleAddSkill = () => {
    let skillToAdd = newSkill;
    

    if (skillToAdd && weight && !isNaN(weight) && weight >= 0 && weight <= 100) {
      const newSkillObj = { skill: skillToAdd, weight: parseFloat(weight) / 100 };
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkillObj],
      });
      setNewSkill("");
      setWeight("");
      setErrors({});
      
    } else {
      setErrors({
        skills: "Please enter a valid skill and weight between 0 and 100.",
      });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(({ skill }) => skill !== skillToRemove),
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Parse amount and rewardPoints to integers
    const parsedFormData = {
      ...formData,
      amount: parseInt(formData.amount, 10),
      rewardPoints: parseInt(formData.rewardPoints, 10),
    };

    const validationResult = CreateGigZodSchema.safeParse(parsedFormData);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }

    setLoading(true);

    try {
      if (selectedImage) {
        const fileJson = {
          fileName: selectedImage.name,
        };
        const response = await api.post(
          "api/util/generate-presigned-url",
          fileJson,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const uploadResponse = await fetch(response.data.url, {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": response.contentType,
          },
          body: selectedImage,
        });

        if (uploadResponse.ok) {
          setFormData((prev) => ({
            ...prev,
            img: response.data.key,
          }));
        } else {
          console.error("Error uploading file");
          setLoading(false);
          return;
        }
      } else {
        await api.post("api/gigs/post", parsedFormData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setSuccess(true);
        setLoading(false);
        handleReset();
      }
    } catch (error) {
      console.error("Error submitting gig:", error);
      setLoading(false);
    }
  };


  useEffect(() => {
    const postGig = async () => {
      await api.post("api/gigs/post", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setSuccess(true);
      handleReset();
    };
    if (formData.img && formData.img !== "") {
      postGig();
      setLoading(false);
    }
  }, [formData.img]);

  useEffect(() => {
    const postGig = async () => {
      await api.post("api/gigs/post", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        skills: [],
        amount: 0,
        deadline: "",
      });
    };
    if (formData.img && formData.img !== "") postGig();
    setLoading(false);
  }, [formData]);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4">
      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="bg-gradient-to-r from-slate-400 to-slate-400 px-8 py-6 rounded-md">
            <h1 className="text-2xl font-medium text-white">Create New Gig</h1>
            <p className="mt-2 text-gray-300 text-sm">
              Share an opportunity with your team
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-600">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                    placeholder="Enter gig title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-rose-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="4"
                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                    placeholder="Describe the gig requirements"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-rose-500">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Amount</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                      placeholder="₹"
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-rose-500">
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Deadline</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                    />
                    {errors.deadline && (
                      <p className="mt-1 text-sm text-rose-500">
                        {errors.deadline}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Reward Points
                    </label>
                    <input
                      type="number"
                      value={formData.rewardPoints}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rewardPoints: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                    />
                    {errors.rewardPoints && (
                      <p className="mt-1 text-sm text-rose-500">
                        {errors.rewardPoints}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-600">
                    Required Skills
                  </label>

                  {/* Dropdown to select skill */}
                  <select
                      value={newSkill}
                      onChange={(e) => {
                          setNewSkill(e.target.value);
                          
                      }}
                      className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                  >
                    <option value="">Select a skill</option>
                    {skillsList.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                    </select>
                    

                  {/* Input for weight */}
                  <div className="mt-2">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      min="0"
                      max="100"
                      className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                      placeholder="Weight (0-100%)"
                    />
                  </div>

                  {/* Add skill button */}
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="mt-2 inline-block bg-slate-500 text-white px-4 py-2 rounded-md"
                  >
                    Add Skill
                  </button>

                  {/* Error message */}
                  {errors.skills && (
                    <p className="mt-1 text-sm text-rose-500">
                      {errors.skills}
                    </p>
                  )}
                </div>

                {/* Display the list of selected skills and their weights */}
                <div>
                  <label className="text-sm text-gray-600">
                    Selected Skills
                  </label>
                  <ul className="mt-2">
                    {formData.skills.map(({ skill, weight }, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>{skill}</span>
                        <span>{weight}%</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-red-500 ml-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Gig Image (Optional)
                  </label>
                  <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size <= 2 * 1024 * 1024) {
                            if (file.type.startsWith("image/")) {
                              setSelectedImage(file);
                              setImagePreview(URL.createObjectURL(file));
                            } else {
                              alert("Please upload an image file");
                            }
                          } else {
                            alert("Image size should be less than 2MB");
                          }
                          imageInputRef.current.value = "";
                        }
                      }}
                      className="hidden"
                      accept="image/*"
                    />

                    {imagePreview ? (
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-40 w-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview("");
                            imageInputRef.current.value = "";
                          }}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current.click()}
                        className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-12 h-12 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">Click to upload image</span>
                      </button>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Max file size: 2MB. Supported formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-50
    rounded-md border border-gray-200
    hover:bg-gray-100 hover:border-gray-300
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-gray-200
    transition-all duration-200 ease-in-out"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm font-medium text-white
    bg-gradient-to-r from-slate-700 to-slate-800
    rounded-md shadow-sm
    hover:from-slate-800 hover:to-slate-900
    active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
    transition-all duration-200 ease-in-out
    flex items-center justify-center min-w-[100px]"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  "Create Gig"
                )}
              </button>
            </div>
          </form>
        </div>

        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-md">
            <p className="text-sm text-green-700">Gig posted successfully</p>
          </div>
        )}
      </div>
    </div>
  );
}