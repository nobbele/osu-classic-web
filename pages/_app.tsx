import { AuthContextProvider } from 'contexts/AuthContext';
import { CookiesProvider } from 'react-cookie';
import '../styles/globals.scss'

function MyApp({ Component, pageProps }: any) {
  return (
    <CookiesProvider>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </CookiesProvider>
  );
}

export default MyApp
