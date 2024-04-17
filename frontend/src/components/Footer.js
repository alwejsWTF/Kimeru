import "../styles/Footer.css";

export default function Footer() {
    return(
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <p className="fo-text">&copy; {new Date().getFullYear()} SPOJ</p>
                </div>
            </div>
        </footer>
    )
}