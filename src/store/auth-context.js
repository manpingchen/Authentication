import { createContext, useState } from "react";

const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;
  console.log({ remainingDuration });
  return remainingDuration;
};

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);

  const isUserLoggedIn = Boolean(token);

  const logInHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);

    const remainingTime = calculateRemainingTime(expirationTime);

    setTimeout(logOutHandler, remainingTime);
  };

  const logOutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const contextValue = {
    token: token,
    isLoggedIn: isUserLoggedIn,
    login: logInHandler,
    logout: logOutHandler,
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
