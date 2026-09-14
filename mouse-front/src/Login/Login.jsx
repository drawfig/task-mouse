import './Login.css';
import {useState} from "react";
import {useNavigate} from "react-router";
import {send_request} from "colby-jack";

function Login({setUser}) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(0);

    const navigate = useNavigate();

    async function handleSubmit() {
        setLoading(true);

        if(username.length <= 0) {
            setError(1);
            setLoading(false);
            return;
        }
        if(password.length <= 0) {
            setError(2);
            setLoading(false);
            return;
        }

        const data = {
            username: username,
            password: password,
        };

        let resp = await send_request("/api/login", data);
        if(resp.status && resp.status === "success") {
            setUser(resp.data);
            setUsername("");
            setPassword("");
            setLoading(false);
            navigate("/");
        }
        else {
            setPassword("");
            setError(3);
            setLoading(false);
        }
    }

    async function handleKeyPress(e) {
        if(e.key === "Enter") {
            e.preventDefault();
            await handleSubmit();
        }
    }

    function passDisp(vis) {
        if(vis) {
            return "text";
        }
        return "password";
    }

    function errorDisplay() {
        switch (error) {
            case 1:
                return <div className="error-text">Please enter a username</div>;
            case 2:
                return <div className="error-text">Please enter a password</div>;
            case 3:
                return <div className="error-text">Invalid Username or Password</div>;
            default:
                return <div className="error-text" style={{color:"transparent", userSelect:"none"}}>fill</div>;
        }
    }

    return (
        <>
            <div className="container login-form">
                <div className="card">
                    <div className="card-title">Login</div>
                    <div className="form-body" style={{maxWidth:"300px"}}>
                        <div className="form-label">Username</div>
                        <input
                            type="text"
                            placeholder="Username"
                            className="form-input"
                            onKeyDown={(e) => handleKeyPress(e)}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        ></input>
                        <div className="form-label">Password</div>
                        <div className="line-combine">
                            <input
                                type={passDisp(showPassword)}
                                placeholder="Password"
                                className="form-input"
                                onKeyDown={(e) => handleKeyPress(e)}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>
                            <VisibilityToggle visible={showPassword} setVisible={setShowPassword}></VisibilityToggle>
                        </div>
                        {errorDisplay()}
                    </div>
                    <SubmitBtn loading={loading} handler={handleSubmit} text="Login"></SubmitBtn>
                    <button className="secondary-btn" style={{marginTop:"1rem"}} onClick={() => navigate("/register")}>Create Account</button>
                </div>
            </div>
        </>
    );
}

function SubmitBtn({loading, text, handler}) {
    if(loading) {
        return (
            <div className="primary-btn loading" style={{marginTop:"1rem"}}>
                <div className="loading-spinner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-refresh-cw-icon lucide-refresh-cw">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M8 16H3v5"/>
                    </svg>
                </div>
            </div>
        );
    }

    return(
        <div className="primary-btn" style={{marginTop:"1rem"}} onClick={handler}>{text}</div>
    );
}

function VisibilityToggle({visible, setVisible}) {
    if(visible) {
        return(
            <div className="visibility-toggle" onClick={() => setVisible(!visible)}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-eye-off-icon lucide-eye-off">
                        <path
                            d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
                        <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                        <path
                            d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
                        <path d="m2 2 20 20"/>
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className="visibility-toggle" onClick={() => setVisible(!visible)}>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-eye-icon lucide-eye">
                    <path
                        d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            </div>
        </div>
    );
}

export default Login;