'use client';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const onSubmit = (e) => {
    e.preventDefault();
    signIn('credentials', {
      email: e.target.email.value,
      password: e.target.password.value,
    });
  };
  return (
    <section>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="password" required />
        <button type="submit">Sign in</button>
      </form>
    </section>
  );
}
