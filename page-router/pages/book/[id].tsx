import Image from "next/image";
import * as styles from "./[id].css";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import fetchOneBook from "@/lib/fetchOneBook";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context.params!.id;
  const book = await fetchOneBook(Number(id));

  return {
    props: {
      book,
    },
  };
};

export default function Page({
  book,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
