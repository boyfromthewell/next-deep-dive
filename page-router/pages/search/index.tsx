import books from "@/mock/books.json";
import { ReactNode } from "react";
import SearchableLayout from "../../components/searchableLayout";
import BookItem from "@/components/bookItem";

export default function Page() {
  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
