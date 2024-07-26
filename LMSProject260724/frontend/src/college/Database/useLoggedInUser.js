// useLoggedInUser.js

import { useState } from 'react';

const useLoggedInUser = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const login = (user) => {
    setLoggedInUser(user);
  };

  const logout = () => {
    setLoggedInUser(null);
  };

  return { loggedInUser, login, logout };
};

export default useLoggedInUser;
