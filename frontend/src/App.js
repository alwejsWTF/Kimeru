import './App.css';
import { Route, Routes } from 'react-router'
import AlertContainer from './components/AlertContainer';
import AuthenticationLayout from './components/AuthenticationLayout';
import NavigationBar from './components/NavigationBar';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';


function App() {

  let [token, setToken] = useState(null);
  let [alerts, setAlerts] = useState([]);


  const addAlert = (title, message) => {
    let alert = {
      "id": uuidv4(),
      "title": title,
      "message": message
    }
    setAlerts([...alerts, alert]);
  }


  return (
    <>
      <NavigationBar />
      <AlertContainer alerts={alerts} setAlerts={setAlerts} />
      <Routes>
        <Route path="/">
          <Route index element={<h1>Hello World!</h1>} />
          <Route path="auth" element={<AuthenticationLayout setToken={setToken}/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
