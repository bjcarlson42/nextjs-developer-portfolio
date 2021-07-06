import fs from 'fs'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import dynamic from 'next/dynamic'
import path from 'path'
import { postFilePaths, POSTS_PATH } from '../../lib/mdxUtils'
import {
    Flex,
    Heading,
    Text,
    Link,
    Divider
} from '@chakra-ui/react'
import Container from '../../components/Container'
import BlogSeo from '../../components/BlogSEO'
import { useRouter } from 'next/router'

const CustomA = (props) => (
    <Link color="blue.500" {...props} />
)

const components = {
    a: CustomA,
    DarkModeSwitch: dynamic(() => import('../../components/DarkModeSwitch')),
}

export default function PostPage({ source, frontMatter }) {
    const router = useRouter()
    const slug = router.asPath.replace('/blog', '')
    return (
        <>
            <BlogSeo url={`https://example.io/blog${slug}`} {...frontMatter} />
            <Container>
                <Flex flexDir="column">
                    <Heading as="h1">{frontMatter.title}</Heading>
                    <Text>{frontMatter.description}</Text>
                </Flex>
                <Divider my={4} />
                <Flex as="main" flexDir="column">
                    <MDXRemote {...source} components={components} />
                </Flex>
            </Container>
        </>
    )
}

export const getStaticProps = async ({ params }) => {
    const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`)
    const source = fs.readFileSync(postFilePath)

    const { content, data } = matter(source)

    const mdxSource = await serialize(content, {
        // Optionally pass remark/rehype plugins
        mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
        },
        scope: data,
    })

    return {
        props: {
            source: mdxSource,
            frontMatter: data,
        },
    }
}

export const getStaticPaths = async () => {
    const paths = postFilePaths
        // Remove file extensions for page paths
        .map((path) => path.replace(/\.mdx?$/, ''))
        // Map the path into the static paths object required by Next.js
        .map((slug) => ({ params: { slug } }))

    return {
        paths,
        fallback: false,
    }
}