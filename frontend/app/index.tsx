import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to welcome screen
    router.replace('/welcome');
  }, [router]);

  return null; // No UI needed as we're redirecting
}
