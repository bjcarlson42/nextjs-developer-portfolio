import fs from 'fs'
import matter from 'gray-matter'
import NextLink from 'next/link'
import path from 'path'
import { postFilePaths, POSTS_PATH } from '../lib/mdxUtils'
import {
    Heading,
    Link,
    UnorderedList,
    ListItem
} from '@chakra-ui/react'
import Container from '../components/Container'

export default function Blog({ posts }) {
    return (
        <Container>
            <Heading as="h1">Posts</Heading>
            <UnorderedList>
                {posts.map((post) => (
                    <ListItem key={post.filePath}>
                        <NextLink
                            as={`/blog/${post.filePath.replace(/\.mdx?$/, '')}`}
                            href={`/blog/[slug]`}
                        >
                            <Link>{post.data.title} - {post.data.description}</Link>
                        </NextLink>
                    </ListItem>
                ))}
            </UnorderedList>
        </Container>
    )
}

export function getStaticProps() {
    const posts = postFilePaths.map((filePath) => {
        const source = fs.readFileSync(path.join(POSTS_PATH, filePath))
        const { content, data } = matter(source)

        return {
            content,
            data,
            filePath,
        }
    })

    return { props: { posts } }
}