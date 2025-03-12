import { useState, useEffect } from 'react';
import {
  Table,
  Dropdown,
  Avatar,
  Pagination,
  TextInput,
  Modal, // Import Modal from flowbite-react
  Button, // Import Button from flowbite-react
} from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { HiSearch } from 'react-icons/hi';
import defaultAvatar from "../assets/profile-avatar.png"

const Leaderboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user
  const [showProfileModal, setShowProfileModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/emp', {
          credentials: 'include',
        });
        const data = await response.json();
        const usersWithGigs = await Promise.all(
          data.docs.map(async (user) => {
            const gigsResponse = await fetch(`http://localhost:3000/api/my-gigs`, {
              credentials: 'include',
            });
            const gigsData = await gigsResponse.json();
            const pointsResponse = await fetch(`http://localhost:3000/api/users/total-rewards/${user.EID}`, {
              credentials: 'include',
            });
            const pointsData = await pointsResponse.json();
            return {
              ...user, // Include all user properties
              name: user.fullName,
              gigs: gigsData.totalDocs,
              rating: user.freelanceRating,
              points: pointsData.totalRewards,
              rewards: '🏆 5 Awards',
            };
          })
        );
        setUsers(usersWithGigs);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  },);

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setActivePage(pageNumber);

  const handleViewProfile = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowProfileModal(true); // Show the modal
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-700 text-center my-4">
        🏆 User Leaderboard
      </h2>
      <div className="">
        <div className="mb-6 flex justify-center gap-4">
          {users.slice(0, 3).map((user, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-blue-100 p-6 rounded-lg shadow-md w-64"
            >
              <Avatar
                img={`https://i.pravatar.cc/100?img=${index + 1}`}
                size="xl"
                rounded
              />
              <p className="text-lg font-semibold mt-2">{user.fullName}</p>
              <p className="text-sm text-gray-600">⭐ {user.freelanceRating} Rating</p>
              <p className="text-lg mt-2">{user.rewards}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 bg-white dark:bg-blue-400 rounded-lg shadow-lg w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-end space-x-3 ">
            <TextInput
              icon={HiSearch}
              placeholder="Search users..."
              className="w-64"
            />
          </div>
        </div>
        <Table hoverable>
          <Table.Head className="bg-blue-500 text-md text-gray-900">
            <Table.HeadCell>User</Table.HeadCell>
            <Table.HeadCell>Gigs</Table.HeadCell>
            <Table.HeadCell>Rating</Table.HeadCell>
            <Table.HeadCell>Points</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>

          </Table.Head>
          <Table.Body className="divide-y">
            {currentItems && currentItems.map((user, index) => (
              <Table.Row
                key={index}
                className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 flex items-center">
                  {user.name} {index % 2 === 0 ? '💼' : '🎖️'}
                </Table.Cell>
                <Table.Cell>{user.gigs || 0}</Table.Cell>
                <Table.Cell>{user.rating || 'N/A'}</Table.Cell>
                <Table.Cell>{user.points || 0}</Table.Cell>
                <Table.Cell>
                  <Dropdown label="Actions" className="" inline>
                    <Dropdown.Item
                      onClick={() => handleViewProfile(user)} // Call handleViewProfile
                    >
                      View Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate('/user/chat')}>
                      Send Message
                    </Dropdown.Item>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={activePage}
            onPageChange={paginate}
            totalPages={Math.ceil(users.length / itemsPerPage)}
          />
        </div>
      </div>
      {/* Profile Modal */}
      <Modal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        size="md"
      >
        <Modal.Header>User Profile</Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Avatar
                img={selectedUser.img ? selectedUser.img : {defaultAvatar}}
                size="xl"
                rounded
                className="mx-auto mb-4"
              />
              <p>
                <strong>Name:</strong> {selectedUser.name || ' --'}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email || ' --'}
              </p>
              <p>
                <strong>Gigs:</strong> {selectedUser.gigs || ' --'}
              </p>
              <p>
                <strong>Rating:</strong> {selectedUser.rating || ' --'}
              </p>
              <p>
                <strong>Points:</strong> {selectedUser.points || ' --'}
              </p>
              <p>
              <strong>Skills:</strong>{' '}
                {selectedUser.skills && selectedUser.skills.length > 0
                  ? selectedUser.skills.join(', ')
                  : ' --'}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Leaderboard;