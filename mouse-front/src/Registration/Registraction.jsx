import "./Registration.css";
import {useState} from "react";
import {send_request} from "colby-jack";
import {useNavigate} from "react-router";

function Registration() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(0);
    const [submitBtn, setSubmitBtn] = useState(true);

    const max = 32;

    function passDisp(vis) {
        if(vis) {
            return "text";
        }
        return "password";
    }

    function handleChange(e, max, handler) {
        if(e.target.value.length <= max) {
            handler(e.target.value);
        }
    }

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
        if(confirmPassword.length <= 0) {
            setError(3);
            setLoading(false);
            return;
        }
        if(password !== confirmPassword) {
            setError(4);
            setLoading(false);
            return;
        }

        const data = {
            username: username,
            password: password,
        };

        let resp = await send_request("/api/create_user", data);

        if(resp.status && resp.status === "success") {
            setSubmitBtn(false);
            setError(0);
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setLoading(false);
        }
        else {
            setError(5);
            setLoading(false);
        }
    }

    function errorDisplay() {
        switch (error) {
            case 1:
                return <div className="error-text" style={{marginBottom:10}}>Username must be at least 1 character long</div>;
            case 2:
                return <div className="error-text" style={{marginBottom:10}}>Password must be at least 1 character long</div>;
            case 3:
                return <div className="error-text" style={{marginBottom:10}}>Confirm Password must be at least 1 character long</div>;
            case 4:
                return <div className="error-text" style={{marginBottom:10}}>Passwords must match</div>;
            case 5:
                return <div className="error-text" style={{marginBottom:10}}>Username already exists</div>;
            default:
                return <div className="error-text" style={{color:"transparent", userSelect:"none", marginBottom:10}}>fill</div>;
        }
    }

    async function handleKeyPress(e) {
        if(e.key === "Enter") {
            e.preventDefault();
            await handleSubmit();
        }
    }

    return (
        <>
            <div className="container registration-form">
                <div className="card">
                    <div className="card-title">Create a User Account</div>
                    <div className="form-body">
                        <div className="form-label">Username</div>
                        <input
                            type="text"
                            placeholder="Username"
                            className="form-input"
                            onKeyDown={(e) => handleKeyPress(e)}
                            value={username}
                            onChange={(e) => handleChange(e, max, setUsername)}
                        ></input>
                        <Counter text={username} max={max}></Counter>
                        <div className="form-label">Password</div>
                        <div className="line-combine">
                            <input
                                type={passDisp(passwordVisible)}
                                placeholder="Password"
                                className="form-input"
                                onKeyDown={(e) => handleKeyPress(e)}
                                value={password}
                                onChange={(e) => handleChange(e, max, setPassword)}
                            />
                            <VisibilityToggle visible={passwordVisible} setVisible={setPasswordVisible}></VisibilityToggle>
                        </div>
                        <Counter text={password} max={max}></Counter>
                        <div className="form-label">Confirm Password</div>
                        <div className="line-combine">
                            <input
                                type={passDisp(confirmPasswordVisible)}
                                placeholder="Confirm Password"
                                className="form-input"
                                onKeyDown={(e) => handleKeyPress(e)}
                                value={confirmPassword}
                                onChange={(e) => handleChange(e, max, setConfirmPassword)}
                            />
                            <VisibilityToggle visible={confirmPasswordVisible} setVisible={setConfirmPasswordVisible}></VisibilityToggle>
                        </div>
                        <Counter text={confirmPassword} max={max}></Counter>
                        {errorDisplay()}
                    </div>
                    <SubmitBtn text="Create Account" handler={handleSubmit} loading={loading} visible={submitBtn}></SubmitBtn>
                </div>
            </div>
        </>
    );
}

function SubmitBtn({loading, text, handler, visible = true}) {
    const navigate = useNavigate();

    if(!visible) {
        return(
            <>
                <div className="success-message">The User was Successfully Created! Click the button below to login.</div>
                <button className="primary-btn" onClick={() => navigate("/login")}>Login</button>
            </>
        );
    }

    if(loading) {
        return (
            <div className="primary-btn loading">
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
        <div className="primary-btn" onClick={handler}>{text}</div>
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

function Counter({text, max}) {
    return(
        <div className="counter" style={{color: text.length > max ? "var(--alert)" : "var(--secondary)"}}>{text.length}/{max}</div>
    );
}

export default Registration;