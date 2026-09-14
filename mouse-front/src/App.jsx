import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./Home/Home.jsx";
import Tasks from "./Tasks/Tasks.jsx";
import {configure, reload_session, set_on_logout} from "colby-jack";
import Registration from "./Registration/Registraction.jsx";
import Login from "./Login/Login.jsx";
import {useEffect, useState} from "react";

configure({
    base_url: import.meta.env.VITE_APP_URL,
    version: import.meta.env.VITE_API_VERSION,
    api_secret: import.meta.env.VITE_API_SECRET,
    refresh_endpoint: "/api/refresh",
    reload_endpoint:"/api/reload",
    keep_logged_in: true,
});

function App() {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [logoutSig, setLogoutSig] = useState(false);

    useEffect(() => {
        async function reload() {
            let resp = await reload_session();

            if(resp.status === "success") {
                setUser(resp.data);
            }
            setUserLoading(false);
        }

        reload();
    }, []);

    useEffect(() => {
        if(logoutSig) {
            const timer = setTimeout(() => {
                setLogoutSig(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [logoutSig])

    function handleLogout() {
        setUser(null);
        setLogoutSig(true);
    }

    set_on_logout(handleLogout);

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home user={user}/>} />
            <Route path="/tasks" element={<Tasks userLoading={userLoading} logoutSig={logoutSig}/>} />
            <Route path="/register" element={<Registration/>} />
            <Route path="/login" element={<Login setUser={setUser}/>} />
            <Route path="/*" element={<h1>404</h1>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
