'use client';

import css from './AuthNavigation.module.css';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store/authStore';
import { logout } from '../../lib/api/clientApi';
import { useRouter } from 'next/navigation';

const AuthNavigation = () => {
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
    } catch {

    } finally {
      clearIsAuthenticated();
      router.push('/sign-in');
    } 
  }
    return isAuthenticated ? (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>

        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email}</p>
          <button onClick={handleLogout} className={css.logoutButton}>
            Logout
          </button>
        </li>
      </>
    ) : (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
            Login
          </Link>
        </li>

        <li className={css.navigationItem}>
          <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
            Sign up
          </Link>
        </li>
      </>
    )

  }

  export default AuthNavigation;
