import { createContext, useState } from "react";

const AuthContext = createContext({
  token: "",
  isLoddgedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);

  const isUserLoggedIn = Boolean(token);

  const logInHandler = (token) => {
    setToken(token);
  };

  const logOutHandler = () => {
    setToken(null);
  };

  const contextValue = {
    token: token,
    isLoddgedIn: isUserLoggedIn,
    login: logInHandler,
    logout: logOutHandler,
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;