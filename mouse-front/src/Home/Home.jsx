import './Home.css';
import {useNavigate} from "react-router";

function Home() {
    const navigate = useNavigate();

    return(
        <>
            <div className="container home-container">
                <div className="card">
                    <div className="welcome-text">Welcome to Task Mouse 🐭</div>
                    <button className="primary-btn" onClick={() => navigate("/tasks")}>Get Started</button>
                </div>
            </div>
        </>
    );
}

export default Home;