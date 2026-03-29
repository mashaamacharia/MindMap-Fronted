import { redirect } from 'next/navigation';

/**
 * Register page - redirects to login
 * The new auth flow uses detect-path from the login page
 * to determine if user should sign up or sign in
 */
export default function RegisterPage() {
  redirect('/auth/login');
}
