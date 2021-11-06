import { GetStaticProps, NextPage } from 'next';
import { MdOutlineCalendarToday, MdOutlinePerson } from 'react-icons/md';

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
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const Home: NextPage<PostPagination> = ({ next_page, results }) => {
  return (
    <div className={styles.container}>
      <img src="/img/logo.svg" alt="logo" />

      <div className={styles.containerPosts}>
        {results.map(post => (
          <div key={post.uid}>
            <h1>{post.data.title}</h1>
            <p>{post.data.subtitle}</p>
            <span>
              <MdOutlineCalendarToday />
              {post.first_publication_date}
            </span>
            <span>
              <MdOutlinePerson />
              {post.data.author}
            </span>
          </div>
        ))}
      </div>

      <button type="button"> Carregar mais posts</button>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('', { pageSize: 5 });

  return { props: postsResponse };
};

export default Home;
