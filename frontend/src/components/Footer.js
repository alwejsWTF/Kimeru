import "../styles/Footer.css";

export default function Footer() {
    return(
        <footer className="font footer">
            <div className="container">
                <div className="row">
                    <p className="fo-text">&copy; {new Date().getFullYear()} Kimeru</p>
                </div>
            </div>
        </footer>
    )
}
