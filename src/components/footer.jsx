import Link from "next/link"
import styles from "../static/styles/Main.style.scss"


export default () => {
    return (
        <footer className={styles.footer}>
            <span>
                &copy; {new Date().getFullYear().toString()}
            </span>
            <div>
                <span>Made by </span>
                <Link href="https://koshelnyi-portfolio.pp.ua/" target="_blank">@osh</Link>
            </div>
        </footer>
    )
}