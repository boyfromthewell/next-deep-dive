import { useRouter } from "next/router";
import { ReactNode } from "react";
import SearchableLayout from "../components/searchableLayout";

export default function Page() {
  const router = useRouter();
  const { q } = router.query;

  return <div>search {q}</div>;
}

Page.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
