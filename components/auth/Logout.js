'use client';
import { signOut } from 'next-auth/react';

export default function Logout() {
  return (
    <button className="border rounded-lg px-2" onClick={() => signOut()}>
      Sign out
    </button>
  );
}
