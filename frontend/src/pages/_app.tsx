// pages/_app.js
import "../styles/globals.css"
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { theme } from '../chakra/theme'
import Layout from '../components/Layout/Layout'
import { RecoilRoot } from "recoil"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  )
}

export default MyApp