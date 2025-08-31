import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <h1>Sergio Mamani - Developer</h1>
        <h2>Mi portfolio</h2>
        <p>Utilizando:</p>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

      </main>
      
    </div>
  );
}
