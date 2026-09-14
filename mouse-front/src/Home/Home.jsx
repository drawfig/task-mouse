import './Home.css';
import {useNavigate} from "react-router";
import {send_request} from "colby-jack";
import {useEffect, useState} from "react";

function Home({user}) {
    const navigate = useNavigate();
    const [stats, setStats] = useState({total:0, completed:0, active:0});
    const [completionRate, setCompletionRate] = useState(0);

    useEffect(() => {
        async function getStats() {
            let resp = await send_request("/api/get_stats", {user_id: user.user_id}, true);
            if(resp.status && resp.status === "success") {
                setStats(resp.data);
            }
        }

        if(user) {
            getStats();
        }
    }, [user]);

    useEffect(() => {
        function getCompletionRate() {
            if(stats.total === 0) {
                setCompletionRate(100);
                return;
            }
            const percent = (stats.completed / stats.total) * 100;
            setCompletionRate(+percent.toFixed(1));
        }

        getCompletionRate();
    }, [stats]);
    async function handleLogout() {
        await send_request("/api/logout", {user_id: user.user_id}, true);
    }

    function colorCalc() {
        const red = Math.floor(256 - (256 * (completionRate / 100)));
        const green = Math.floor(256 * (completionRate / 100));

        return `rgb(${red}, ${green}, 0)`;
    }

    if(user) {
        return (
            <>
                <div className="container">
                    <div className="navbar">
                        <div className="app-name">Task Mouse 🐭</div>
                        <button className="logout-btn" style={{fontSize:15, marginLeft:"auto", marginRight:20}} onClick={handleLogout}>Logout</button>
                    </div>
                    <div className="home-container">
                        <div className="greeting-txt">Welcome back, {user.username}.</div>
                        <div className="card">
                            <div className="card-title">List Stats</div>
                            <div className="status-group">
                                <StatBox title="Total Tasks" value={stats.total}></StatBox>
                                <StatBox title="Active Tasks" value={stats.active} color={"var(--alert)"}></StatBox>
                                <StatBox title="Completed Tasks" value={stats.completed} color={"var(--success)"}></StatBox>
                                <StatBox title="Completion Rate" value={`${completionRate}%`} color={colorCalc()}></StatBox>
                            </div>
                            <button className="primary-btn" style={{marginTop:"1rem"}} onClick={() => navigate("/tasks")}>Back to Tasks</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return(
        <>
            <div className="container home-container">
                <div className="card">
                    <div className="welcome-text">Welcome to Task Mouse 🐭</div>
                    <div className="subtitle">Please Login</div>
                    <button className="primary-btn" style={{marginTop:"5rem"}} onClick={() => navigate("/login")}>Login</button>
                    <button className="secondary-btn" style={{marginTop:"1rem"}} onClick={() => navigate("/register")}>Create Account</button>
                </div>
            </div>
        </>
    );
}

function StatBox({title, value, color="var(--text)"}) {
    return(
        <div className="status-container">
            <div>{title}</div>
            <div style={{color:color, fontSize:60, marginBottom:20}}>{value}</div>
        </div>
    );
}

export default Home;