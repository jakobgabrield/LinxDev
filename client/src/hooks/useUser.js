import { useState } from 'react';

export default function useUser() {
  const getUser = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    return user?.user;
  };

  const [userUser, setUser] = useState(getUser());

  const saveUser = user => {
    sessionStorage.setItem('user', JSON.stringify({user}));
    setUser(user);
  };

  const logoutUser = () => {
    sessionStorage.setItem('user', null);
    setUser(null);
  }

  return {
    setUser: saveUser,
    user: userUser,
    logoutUser
  }
}