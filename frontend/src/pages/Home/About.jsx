import {
  FaCheckCircle,
  FaProjectDiagram,
  FaUsers,
  FaClock,
  FaBuilding,
} from "react-icons/fa";
import aboutImg from "../../assets/about.png";
import { memo } from "react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-y-16">
        {/* Left - Image Section */}
        <div className="md:w-1/2 flex justify-center">
          <img src={aboutImg} alt="Teamwork" className="w-80 md:w-full" />
        </div>

        {/* Right - Text Section */}
        <div className="md:w-1/2 mt-8 md:mt-0 md:pl-12">
          <h2 className="text-4xl font-bold text-gray-800 text-center md:text-left">
            About Our Internal Freelance System
          </h2>
          <p className="text-gray-600 mt-4 italic text-center md:text-left">
            Our internal freelance platform enables employees to collaborate and
            contribute to projects beyond their core responsibilities.
          </p>

          {/* Bullet Points */}
          <ul className="mt-6 space-y-3 text-gray-700">
            {[
              "Employees can take up projects within the company to earn additional incentives.",
              "Encourages cross-departmental collaboration and skill development.",
              "A transparent bidding system allows fair project allocation.",
              "Employees can track project progress and payments via a centralized dashboard.",
              "Improves employee engagement and retention through flexible work opportunities.",
            ].map((point, index) => (
              <li key={index} className="flex items-start">
                <FaCheckCircle className="text-blue-500 mr-2 mt-1" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Counters Section */}
      <div className="max-w-7xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {[
          { icon: FaProjectDiagram, count: 232, label: "Freelance Projects" },
          { icon: FaUsers, count: 521, label: "Employees" },
          { icon: FaClock, count: 1453, label: "Active Externals" },
          { icon: FaBuilding, count: 32, label: "Departments Involved" },
        ].map(({ icon: Icon, count, label }, index) => (
          <div key={index} className="flex flex-col items-center">
            <Icon className="text-blue-500 text-5xl mb-2" />
            <h3 className="text-4xl font-bold text-blue-500">{count}</h3>
            <p className="text-gray-600">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(About);
