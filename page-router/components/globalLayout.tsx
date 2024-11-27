import { ReactNode } from "react";
import Link from "next/link";
import * as styles from "./globalLayout.css";

export default function GlobalLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href={"/"} className={styles.headerLink}>
          📚 ONEBITE BOOKS
        </Link>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>Made @boyfromthewell</footer>
    </div>
  );
}
