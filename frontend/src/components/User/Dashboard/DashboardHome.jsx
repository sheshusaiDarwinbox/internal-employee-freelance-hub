import { Alert} from "flowbite-react";

export const DashboardHome = () => {
  return (
    <div>
         <div className="flex-1 text-center p-8 w-full">
          <Alert color="success" className="mb-6 shadow-sm text-center">
            Welcome! Stay updated with your tasks.
          </Alert>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Your Work</h2>
          <p className="text-gray-600">All your tasks and progress in one place.</p>
          
        </div>
    </div>
  )
}
