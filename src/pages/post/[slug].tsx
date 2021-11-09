/* eslint-disable react/no-array-index-key */
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import PrismicDOM from 'prismic-dom';
import {
  MdOutlineCalendarToday,
  MdOutlinePerson,
  MdOutlineLockClock,
} from 'react-icons/md';

import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

function getTotalWords(post: Post): number {
  let words = 0;

  for (let idx = 0; idx < post.data.content.length; idx += 1) {
    const el = post.data.content[idx];

    let localWords = el.heading.split(/\s+/);
    words += localWords.length;

    localWords = PrismicDOM.RichText.asText(el.body).split(/\s+/);
    words += localWords.length;
  }

  return words;
}

function getEstimatedReadTime(post: Post): number {
  const meanReadTimePerMinute = 200;
  const totalWords = getTotalWords(post);

  return Math.ceil(totalWords / meanReadTimePerMinute);
}

const Post: NextPage<PostProps> = ({ post }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Header />

      <div className={styles.banner}>
        <Image
          className={styles.image}
          src={post.data.banner.url}
          alt="logo"
          width={1440}
          height={400}
        />
      </div>

      <main className={styles.container}>
        <h1>{post.data.title}</h1>

        <div className={commonStyles.moreInfos}>
          <span>
            <MdOutlineCalendarToday />
            {format(new Date(post.first_publication_date), 'd MMM yyyy', {
              locale: ptBR,
            })}
          </span>
          <span>
            <MdOutlinePerson />
            {post.data.author}
          </span>
          <span>
            <MdOutlineLockClock />
            {getEstimatedReadTime(post)} min
          </span>
        </div>

        {post.data.content.map((item, index) => (
          <span key={index}>
            <h2>{item.heading}</h2>

            {item.body.map((item2, index2) => (
              <p key={index2}>{item2.text}</p>
            ))}
          </span>
        ))}
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const { results } = await prismic.query('');

  const paths = results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(params.slug), {});

  return {
    props: {
      post: response,
    },
  };
};

export default Post;
