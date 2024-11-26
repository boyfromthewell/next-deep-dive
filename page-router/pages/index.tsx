import { ReactNode } from "react";
import SearchableLayout from "./components/searchableLayout";

export default function Home() {
  return <div>home</div>;
}

Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
