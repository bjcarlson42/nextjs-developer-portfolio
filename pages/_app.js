import { ChakraProvider } from "@chakra-ui/react"
import SEO from '../next-seo.config'
import { DefaultSeo } from 'next-seo'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
