import Auth from '@/components/auth';
import Chat from '@/components/Chat';

const Home = ({ searchParams }) => {
  const params = new URLSearchParams(searchParams);
  const room = params.get('room');
  return (
    <div>
      <Auth />
      <Chat room={room} />
    </div>
  );
};

export default Home;
