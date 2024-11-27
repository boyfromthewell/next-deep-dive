import Image from "next/image";
import * as styles from "@/styles/[id].css";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import fetchOneBook from "@/lib/fetchOneBook";
import { useRouter } from "next/router";

export const getStaticPaths = () => {
  return {
    paths: [
      {
        params: { id: "1" },
      },
      {
        params: { id: "2" },
      },
      {
        params: { id: "3" },
      },
    ],
    fallback: true,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params!.id;
  const book = await fetchOneBook(Number(id));

  if (!book) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      book,
    },
  };
};

export default function Page({
  book,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (router.isFallback) return "로딩중 입니다.";
  if (!book) return "문제가 발생 했습니다. 다시 시도 하세요!";

  const { title, subTitle, description, author, publisher, coverImgUrl } = book;

  return (
    <div className={styles.container}>
      <div
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
        className={styles.coverImgContainer}
      >
        <Image
          src={coverImgUrl}
          alt="cover img"
          className={styles.coverImg}
          width={350}
          height={300}
        />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.subTitle}>{subTitle}</div>
      <div className={styles.subTitle}>
        {author} | {publisher}
      </div>
      <div className={styles.desc}>{description}</div>
    </div>
  );
}
