import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Content from './components/Content';
import AuthenticationFlow from './components/AuthenticationFlow';
import useToken from './hooks/useToken';
import useUser from './hooks/useUser';

function App() {
  const [selectedFolder, setSelectedFolder] = useState(null);

  const {token, setToken, logout} = useToken();
  const {user, setUser, logoutUser} = useUser();

  if (!token) {
    return <AuthenticationFlow setToken={setToken} setUser={setUser}/>
  }

  return (
    <div className="App">
      <Sidebar setSelectedFolder={setSelectedFolder} user={user}/>
        <div className="body">
          <Header logout={logout} logoutUser={logoutUser} user={user}/>
            <div className="container">
              <Content selectedFolder={selectedFolder} />
            </div>
        </div>
    </div>
  );

}

export default App;