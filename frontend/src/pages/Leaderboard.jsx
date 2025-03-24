import { useState } from 'react';
import { Table, Button, Dropdown, Avatar, Pagination, TextInput } from 'flowbite-react';
import { HiSearch, HiMenu } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Leaderboard = () => {
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(10);

  const users = [
    { name: 'Jan', gigs: '71m', rating: 4.5, points: 920, rewards: '🏆 5 Awards' },
    { name: 'Use', gigs: '520', rating: 4.8, points: 620, rewards: '🌟 Top Performer' },
    { name: 'Ree', gigs: '450', rating: 4.2, points: 930, rewards: '🔥 Rising Star' },
    { name: 'Red', gigs: '330', rating: 4.9, points: 720, rewards: '💎 Elite Member' },
    { name: 'Roy', gigs: '930', rating: 4.7, points: 920, rewards: '🏅 Outstanding' },
  ];

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setActivePage(pageNumber);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">🏆 User Leaderboard</h2>
        <div className="flex items-center space-x-3">
          <TextInput icon={HiSearch} placeholder="Search users..." className="w-64" />
          <Button color="gray" size="xs">
            <HiMenu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Top 3 Rankers Carousel */}
      <div className="mb-6">
        <Swiper spaceBetween={10} slidesPerView={3} className="w-full">
          {users.slice(0, 3).map((user, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center bg-blue-100 p-6 rounded-lg shadow-md w-52">
                <Avatar img={`https://i.pravatar.cc/100?img=${index + 1}`} size="xl" rounded />
                <p className="text-lg font-semibold mt-2">{user.name}</p>
                <p className="text-sm text-gray-600">⭐ {user.rating} Rating</p>
                <p className="text-lg mt-2">{user.rewards}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Table */}
      <Table hoverable>
        <Table.Head className="bg-blue-500 text-md text-gray-900">
          <Table.HeadCell>User</Table.HeadCell>
          <Table.HeadCell>Gigs</Table.HeadCell>
          <Table.HeadCell>Rating</Table.HeadCell>
          <Table.HeadCell>Points</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {currentItems.map((user, index) => (
            <Table.Row key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 flex items-center">
                {user.name} {index % 2 === 0 ? '💼' : '🎖️'}
              </Table.Cell>
              <Table.Cell>{user.gigs}</Table.Cell>
              <Table.Cell>{user.rating}</Table.Cell>
              <Table.Cell>{user.points}</Table.Cell>
              <Table.Cell>
                <Dropdown label="Actions" className='' inline>
                  <Dropdown.Item>View Profile</Dropdown.Item>
                  <Dropdown.Item>Send Message</Dropdown.Item>
                </Dropdown>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={activePage}
          onPageChange={paginate}
          totalPages={Math.ceil(users.length / itemsPerPage)}
        />
      </div>
    </div>
  );
};

export default Leaderboard;
