import { Button } from "flowbite-react";
import HeroImg from "../../assets/hero-img.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center">
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col md:flex-row items-center justify-center px-6 py-12">
        {/* Left Content */}
        <div className="w-full md:w-1/2 mx-auto text-center md:text-left">
          <h2 className="text-5xl font-bold w-2/3 text-gray-800">
            Elegant and creative solutions
          </h2>
          <p className="text-gray-600 text-lg mt-4">
            Bringing together talented professionals to craft exceptional initiatives
          </p>
          <div className="mt-6 flex justify-center md:justify-start space-x-4">
            <Link to="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 text-xl rounded-full">
              Get Started
            </Button>
            </Link>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <motion.img
            src={HeroImg}
            alt="Hero Illustration"
            className="w-[85%]"
            animate={{
              y: [0, -10, 0], // Moves up by 10px and back down
            }}
            transition={{
              duration: 2, // 2 seconds for one complete cycle
              repeat: Infinity, // Runs infinitely
              ease: "easeInOut", // Smooth animation
            }}
          />
        </div>
        
      </section>
    </div>
  );
};

export default Homepage;
