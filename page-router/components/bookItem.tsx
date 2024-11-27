import type { BookData } from "@/types";
import Image from "next/image";
import Link from "next/link";
import * as styles from "./bookItem.css";

export default function BookItem({
  id,
  title,
  subTitle,
  author,
  publisher,
  coverImgUrl,
}: BookData) {
  return (
    <Link href={`book/${id}`} className={styles.container}>
      <Image src={coverImgUrl} alt="cover img" width={80} height={125} />
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.subTitle}>{subTitle}</div>
        <br />
        <div className={styles.author}>
          {author} | {publisher}
        </div>
      </div>
    </Link>
  );
}
