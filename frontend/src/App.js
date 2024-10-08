import { BrowserRouter, Route, Routes } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import HomePage from './components/HomePage';
import AuthenticationLayout from './components/AuthenticationLayout';
import NavigationBar from './components/NavigationBar';
import ProblemsPage from './components/ProblemsPage';
import RankingPage from './components/RankingPage';
import ProfilePage from './components/ProfilePage';
import Footer from './components/Footer';
import SubmitPage from './components/SubmitPage';
import { ToastProvider } from './components/ToastProvider';

import './styles/App.css';
import { getCookie, setJWT } from './utils/functions';
import { setAxiosCookieHeader } from './utils/functions';
import * as routes from './config/routes';




function App() {

  let [loggedIn, setLoggedIn] = useState(false);
  let [userID, setUserID] = useState();

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    let cookie = getCookie("csrf_access_token");
    if(document.cookie) {
      setLoggedIn(true);
      setAxiosCookieHeader(cookie);
      axios.get(routes.GET_USER_ID).then((res) => {
        setUserID(res.data.user_id);
        setJWT();
      }).catch((err) => {
        console.error(err);
      })
    }
    
    return () => {
      document.head.removeChild(link);
    };
    
  }, []);


  return (
    <div className="app">
      <BrowserRouter>
          <ToastProvider>
            <NavigationBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="auth" element={<AuthenticationLayout setLoggedIn={setLoggedIn} setUserID={setUserID} />} />
              <Route path="test" element={<h1>Hello World!</h1>} />
              <Route exact path="problems" element={<ProblemsPage />} />
              <Route path="problems/:id/submit" element={<SubmitPage userID={userID}/>} />
              <Route path="ranking" element={<RankingPage />} />
              <Route path="profile" element={<ProfilePage loggedIn={loggedIn}/>} />
            </Routes>
            <Footer/>
          </ToastProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
