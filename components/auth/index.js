import { GetSession } from '@/actions/GetSession';
import Logout from './Logout';
import SignIn from './SignIn';

export default async function Auth() {
  const currentUser = await GetSession();
  if (!currentUser) return <SignIn />;
  return (
    <section>
      <h1>Hi {currentUser.user.email}</h1>
      <Logout />
    </section>
  );
}
