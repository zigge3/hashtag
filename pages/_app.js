import "../styles/globals.css";
import { useMemo } from "react";
function MyApp({ Component, pageProps }) {
  return useMemo(() => <Component {...pageProps} />, [pageProps]);
}

export default MyApp;
