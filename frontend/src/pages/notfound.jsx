import { Link } from "react-router-dom";
import "@css/404.css"
export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <span className="notfound-code">404</span>
        <h1>Page not found</h1>
        <p>
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Link to="/login" className="notfound-btn">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
