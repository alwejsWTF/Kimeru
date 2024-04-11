import './App.css';
import { Route, Routes } from 'react-router'
import AlertContainer from './components/AlertContainer';
import AuthenticationLayout from './components/AuthenticationLayout';
import NavigationBar from './components/NavigationBar';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import HomePage from './components/HomePage';
import { BrowserRouter } from 'react-router-dom'
import ProblemsPage from './components/ProblemsPage';
import RankingPage from './components/RankingPage';
import ProfilePage from './components/ProfilePage';


function App() {

  let [token, setToken] = useState(null);
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


  return (
    <BrowserRouter>
      <NavigationBar token={token} />
      <AlertContainer alerts={alerts} setAlerts={setAlerts} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="auth" element={<AuthenticationLayout setToken={setToken} addAlert={addAlert}/>} />
        <Route path="test" element={<h1>Hello World!</h1>} />
        <Route path="problems" element={<ProblemsPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
