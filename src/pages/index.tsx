import { useState } from 'react';
import { MdOutlineCalendarToday, MdOutlinePerson } from 'react-icons/md';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const Home: NextPage<HomeProps> = ({ postsPagination }) => {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const handlePostPagination = async (): Promise<void> => {
    const response = await fetch(postsPagination.next_page);
    const { results, next_page }: PostPagination = await response.json();
    setPosts([...posts, ...results]);
    setNextPage(next_page);
  };

  return (
    <>
      <Header />

      <main className={styles.container}>
        <div className={styles.containerPosts}>
          {posts.map(post => (
            <div key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <h1>{post.data.title}</h1>
                </a>
              </Link>

              <p>{post.data.subtitle}</p>
              <div className={commonStyles.moreInfos}>
                <span>
                  <MdOutlineCalendarToday />
                  {format(
                    new Date(post.first_publication_date),
                    'dd LLL yyyy',
                    {
                      locale: ptBR,
                    }
                  )}
                </span>
                <span>
                  <MdOutlinePerson />
                  {post.data.author}
                </span>
              </div>
            </div>
          ))}
        </div>

        {nextPage && (
          <button type="button" onClick={handlePostPagination}>
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse: PostPagination = await prismic.query('', {
    pageSize: 1,
  });

  return { props: { postsPagination: postsResponse } };
};

export default Home;
