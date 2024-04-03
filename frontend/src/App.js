import './App.css';
import { Route, Routes} from 'react-router'
import Container from 'react-bootstrap/Container';
import LoginLayout from './components/LoginLayout';
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <>
      <NavigationBar />
      <Container>
        <Routes>
          <Route path="/">
            <Route index element={<h1>Hello World!</h1>} />
            <Route path="login" element={<LoginLayout />} />
            <Route path="register" />
          </Route>
        </Routes>
      </Container>
    </>
  );
}

export default App;
