import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import React, { useEffect } from 'react';
import HomePage from './components/HomePage';
import AlertContainer from './components/AlertContainer';
import AuthenticationLayout from './components/AuthenticationLayout';
import NavigationBar from './components/NavigationBar';
import ProblemsPage from './components/ProblemsPage';
import RankingPage from './components/RankingPage';
import ProfilePage from './components/ProfilePage';
import Footer from './components/Footer';
import SubmitPage from './components/SubmitPage';

import './styles/App.css';


function App() {

  let [loggedIn, setLoggedIn] = useState(false);
  let [alerts, setAlerts] = useState([]);


  const addAlert = (title, message, type) => {
    let alert = {
      "id": uuidv4(),
      "title": title,
      "message": message,
      "type": type
    }
    setAlerts([...alerts, alert]);
  }

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);


  return (
    <div className="app">
      <BrowserRouter>
        <NavigationBar addAlert={addAlert} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <AlertContainer alerts={alerts} setAlerts={setAlerts} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="auth" element={<AuthenticationLayout setLoggedIn={setLoggedIn} addAlert={addAlert}/>} />
          <Route path="test" element={<h1>Hello World!</h1>} />
          <Route path="problems" element={<ProblemsPage />} />
          <Route path="problems/:id/submit" element={<SubmitPage addAlert={addAlert}/>} />
          <Route path="ranking" element={<RankingPage />} />
          <Route path="profile" element={<ProfilePage loggedIn={loggedIn} addAlert={addAlert}/>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
