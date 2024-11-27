import { ReactNode } from "react";
import SearchableLayout from "../components/searchableLayout";
import * as styles from "./home.css";
import books from "@/mock/books.json";
import BookItem from "@/components/bookItem";

export default function Home() {
  return (
    <div className={styles.container}>
      <section>
        <h3 className={styles.title}>지금 추천하는 도서</h3>
        {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
      <section>
        <h3 className={styles.title}>등록된 모든 도서</h3>
        {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
    </div>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
