'use server';

import { getServerSession } from 'next-auth';

export async function GetSession() {
  const currentUser = await getServerSession();
  return currentUser;
}
