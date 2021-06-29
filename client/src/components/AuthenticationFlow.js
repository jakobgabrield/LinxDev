import React, {useState} from 'react';
import Signin from './Signin';
import Signup from './Signup';

const AuthenticationFlow = ({ setToken, setUser }) => {
    const [login, setLogin] = useState(true);

    if (login) {
        return <Signin setToken={setToken} setLogin={setLogin} setUser={setUser}/>
    } else {
        return <Signup setLogin={setLogin} />
    }
}

export default AuthenticationFlow;