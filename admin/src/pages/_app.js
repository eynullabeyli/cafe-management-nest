import '../styles/globals.css';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add event listeners for route changes
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Clean up event listeners
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Get any layout defined at the page level, otherwise use default layout
  const getLayout = Component.getLayout || ((page) => (
    <Layout>
      {page}
    </Layout>
  ));

  return (
    <>
      {/* Loading animation */}
      {isLoading && (
        <div className="page-loader">
          <div className="spinner"></div>
        </div>
      )}
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export default MyApp;