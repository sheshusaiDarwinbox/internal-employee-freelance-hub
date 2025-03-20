import { useState, useEffect } from 'react';
import {
  Table,
  Avatar,
  Pagination,
  TextInput,
  Modal,
  Button,
} from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import {
  HiSearch,
  HiStar,
  HiChatAlt2,
  HiUserCircle,
  HiClock,
  HiSparkles,
} from 'react-icons/hi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import defaultAvatar from "../assets/profile-avatar.png";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredUserScore, setHoveredUserScore] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/emp', { credentials: 'include' });
        const data = await response.json();
        const usersWithGigs = await Promise.all(
          data.docs.map(async (user) => {
            const gigsResponse = await fetch(`http://localhost:3000/api/gigs/my-gigs`, { credentials: 'include' });
            const gigsData = await gigsResponse.json();
            const pointsResponse = await fetch(`http://localhost:3000/api/users/total-rewards/${user.EID}`, { credentials: 'include' });
            const pointsData = await pointsResponse.json();
            return {
              ...user,
              name: user.fullName,
              gigs: gigsData.totalDocs,
              rating: user.freelanceRating,
              points: pointsData.totalRewards,
              rewards: `🏆 ${pointsData.gigsWithRewardsCount !== undefined ? pointsData.gigsWithRewardsCount : 0} Rewards`
            };
          })
        );
        setUsers(usersWithGigs);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (selectedUser && selectedUser.DID) {
        try {
          const response = await fetch(`http://localhost:3000/api/departments/${selectedUser.DID}`, { credentials: 'include' });
          const data = await response.json();
          setDepartment(data);
        } catch (error) {
          console.error('Error fetching department:', error);
          setDepartment(null);
        }
      } else {
        setDepartment(null);
      }
    };

    fetchDepartment();
  }, [selectedUser]);

  const calculateScore = (user, allUsers) => {
    const maxRating = Math.max(...allUsers.map(u => u.rating || 0));
    const maxPoints = Math.max(...allUsers.map(u => u.points || 0));

    const ratingScore = (user.rating || 0) / maxRating;
    const pointsScore = (user.points || 0) / maxPoints;

    return (ratingScore * 0.5) + (pointsScore * 0.5);
  };

  const rankedUsers = [...users].sort((a, b) => calculateScore(b, users) - calculateScore(a, users));
  const topRankers = rankedUsers.slice(0, 3).map(user => ({
    ...user,
    score: calculateScore(user, rankedUsers).toFixed(2)
  }));

  const filteredUsers = rankedUsers.filter(user =>
    (user.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setActivePage(pageNumber);

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const getTopRankerStyle = (index) => {
    const baseStyles = "transform hover:scale-105 transition-transform duration-300 border-2";
    switch (index) {
      case 0:
        return `${baseStyles} bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400 shadow-yellow-200`;
      case 1:
        return `${baseStyles} bg-gradient-to-br from-gray-50 to-gray-100 border-gray-400 shadow-gray-200`;
      case 2:
        return `${baseStyles} bg-gradient-to-br from-amber-100 to-amber-300 border-amber-700 shadow-amber-400`;
      default:
        return '';
    }
  };

  const getTrophyColor = (index) => {
    switch (index) {
      case 0: return "text-yellow-500";
      case 1: return "text-gray-400";
      case 2: return "text-amber-800";
      default: return "";
    }
  };

  const handleMouseEnter = (user, event) => {
    setHoveredUserScore(user.score);
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredUserScore(null);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-500" />);
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold  mb-4">
        🏆 <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>Global Leaderboard</span>
        </h2>
        <p className="text-gray-600 text-lg">Celebrating Our Top Performers</p>
      </div>

      <div className="flex justify-center mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {topRankers.map((user, index) => (
          <div
            key={index}
            className={`${getTopRankerStyle(
              index
            )} rounded-2xl shadow-xl py-8 p-16 relative overflow-hidden`}
            onMouseEnter={(event) => handleMouseEnter(user, event)}
            onMouseLeave={handleMouseLeave}
          >
            {index === 0 && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-200 rounded-full -mr-12 -mt-12 opacity-50" />
            )}
            <div className="relative">
              <Avatar
                img={user.img || defaultAvatar}
                size="lg"
                rounded
              />
              <HiStar
                className={`absolute -top-2 -right-2 text-3xl ${getTrophyColor(
                  index
                )}`}
              />
            </div>
            <h3 className="text-xl font-bold mt-2 text-gray-800 text-center">
              {user.name}
            </h3>
            <div className="flex items-center justify-center mt-1 text-gray-600">
              <div className="text-yellow-500 mr-1" />
              {renderStars(user.rating || 0)}
            </div>
            <div className="mt-2 text-center">
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                {user.points || 0} Points
              </span>
            </div>
            <div className="mt-1 text-center text-gray-600">{user.rewards}</div>
            {hoveredUserScore === user.score && (
              <div
                className="absolute bg-gray-800 text-white p-1 rounded-md text-xs"
                style={{
                  left: hoverPosition.x + 10,
                  top: hoverPosition.y + 10,
                }}
              >
                Score: {user.score}
              </div>
            )}
          </div>
        ))}
      </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <TextInput
            icon={HiSearch}
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96"
          />
          <div className="flex items-center gap-2 text-gray-600">
            <HiSparkles className="text-purple-500" />
            <span>Total Users: {users.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table hoverable className="w-full">
            <Table.Head className="bg-blue-600 border-b border-gray-300">
              <Table.HeadCell className="text-blue border-r">Rank</Table.HeadCell>
              <Table.HeadCell className="text-blue border-r">User</Table.HeadCell>
              <Table.HeadCell className="text-blue border-r">Gigs</Table.HeadCell>
              <Table.HeadCell className="text-blue border-r">Rating</Table.HeadCell>
              <Table.HeadCell className="text-blue border-r">Points</Table.HeadCell>
              <Table.HeadCell className="text-blue">Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-gray-200">
              {currentItems.map((user, index) => (
                <Table.Row
                  key={index}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? '' : 'bg-gray-100'}`}
                >
                  <Table.Cell className="font-medium text-gray-900">
                    #{indexOfFirstItem + index + 1}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 flex items-center gap-2">
                    <Avatar
                      img={user.img || defaultAvatar}
                      size="sm"
                      rounded
                    />
                    <span>{user.name}</span>
                    {index < 3 && <HiStar className={getTrophyColor(index)} />}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1">
                      <HiClock className="text-blue-500" />
                      {user.gigs || 0}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center">
                      <HiStar className="text-yellow-500 mr-1" />
                      {user.rating || 'N/A'}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-semibold text-purple-600">
                      {user.points || 0}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="light"
                        onClick={() => handleViewProfile(user)}
                      >
                        <HiUserCircle className="mr-2" /> Profile
                      </Button>
                      <Button
                        size="sm"
                        color="light"
                        onClick={() => navigate('/user/chat')}
                      >
                        <HiChatAlt2 className="mr-2" /> Chat
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={activePage}
            onPageChange={paginate}
            totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
            className="inline-flex gap-2"
          />
        </div>
      </div>

      <Modal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        size="md"
      >
        <Modal.Header className="bg-blue-200 text-white">
          User Profile
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <Avatar
                  img={selectedUser.img || defaultAvatar}
                  size="xl"
                  rounded
                  className=""
                />
                <h3 className="text-xl font-bold mt-4">{selectedUser.name}</h3>
                <div className="flex items-center mt-2 text-gray-600">
                  <HiStar className="text-yellow-500 mr-1" />
                  <span>{selectedUser.rating || 'N/A'} Rating</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Total Gigs</p>
                  <p className="text-xl font-bold">{selectedUser.gigs || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Points</p>
                  <p className="text-xl font-bold text-purple-600">
                    {selectedUser.points || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 ">
              <p className="text-sm text-gray-500">Email</p>
              <p className="">
                {selectedUser.email || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 ">
              <p className="text-sm text-gray-500">Address</p>
              <p className="">
                {selectedUser.address || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 ">
              <p className="text-sm text-gray-500">Work Mode</p>
              <p className="">
                {selectedUser.workMode || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 ">
              <p className="text-sm text-gray-500">Department</p>
              <p className="">
                {department ? department.name : 'N/A'}
              </p>
            </div>
          </div>

              <div className="mt-6 ml-5">
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.skills && selectedUser.skills.length > 0 ? (
                    selectedUser.skills.filter(skill => typeof skill === 'object' && skill.skill).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {skill.skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No skills listed</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="gray"
            onClick={() => setShowProfileModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Leaderboard;