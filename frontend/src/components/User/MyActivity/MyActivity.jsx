import { Card, Button, Modal } from "flowbite-react";
import { CheckCircle, Trophy } from "lucide-react";
import { useState } from "react";

const MyActivity = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Card className="p-6 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-shadow">
        <div className="flex flex-col items-center space-y-3">
          <h3 className="text-xl font-bold text-gray-800">Overall Rating</h3>
          <p className="text-3xl font-semibold text-yellow-800">4.5 ⭐</p>
        </div>
      </Card>

      
        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center space-y-3">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Total Tasks Done</h3>
            <p className="text-3xl font-semibold text-blue-800">10</p>
          </div>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center space-y-3">
            <Trophy className="w-8 h-8 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Rewards Earned</h3>
            <p className="text-3xl font-semibold text-green-800">10</p>
          </div>
        </Card>
      </div>  
      <div className="text-blue-700 font-semibold text-2xl text-center mt-10">CURRENT TASK</div>
      <div className="p-6 bg-white w-full md:w-2/3 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Build A Task Management System</h3>
        <div className="space-y-4">
  {/* Custom Progress Bar with Fixed Width */}
  <div className="relative h-2 bg-gray-300 rounded-full overflow-hidden">
    <div 
      className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-500" 
      style={{ width: "10%" }} 
    ></div>
  </div>
  
  <p className="text-sm text-gray-600">10% Complete</p>

        {/* Buttons */}
        <div className="flex gap-5 justify-start">
          <Button 
            className="w-full md:w-auto bg-green-300 hover:bg-green-400 px-4 py-1 rounded-full text-green-800" 
            onClick={() => setModalOpen(true)}
          >
            Submit
          </Button>
          <Button 
            className="w-full md:w-auto bg-blue-300 hover:bg-blue-400 px-4 py-1 rounded-full text-blue-800"
          >
            Update
          </Button>
        </div>
      </div>

      </div>

      <Modal 
      show={modalOpen} 
      onClose={() => setModalOpen(false)} 
      size="md"
      className="pt-[10%] shadow-2xl rounded-lg  inset-0 bg-black bg-opacity-50"
    >
       {/* Override Modal Background */}
  {/* <div className="fixed inset-0 bg-black bg-opacity-50"></div> */}

      <Modal.Header className="text-xl font-semibold text-gray-900 border-b pb-3 p-5">
        Submit Task
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col space-y-4 mt-6">
          <input 
            type="text" 
            placeholder="Project Link" 
            className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <textarea 
            placeholder="Description" 
            className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500" 
            rows="3"
          ></textarea>
          <input 
            type="file" 
            className="border border-gray-300 p-3 rounded-md cursor-pointer bg-gray-100"
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end space-x-4 pt-4 border-t">
        <Button 
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition"
          onClick={() => setModalOpen(false)}
        >
          Cancel
        </Button>
        <Button 
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          onClick={() => setModalOpen(false)}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>



    </div>
  );
};

export default MyActivity;
