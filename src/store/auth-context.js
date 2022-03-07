import { createContext, useCallback, useEffect, useState } from "react";

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

const retrieveStoredToken = () => {
  const token = localStorage.getItem("token");
  const expirationTime = localStorage.getItem("expirationTime");

  const remainingDuration = calculateRemainingTime(expirationTime);

  if (remainingDuration <= 0) {
    return null;
  }

  return {
    token,
    duration: remainingDuration,
  };
};

let logoutTimer;

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  const isUserLoggedIn = Boolean(token);

  const logInHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logOutHandler, remainingTime);
  };

  const logOutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  useEffect(() => {
    if (tokenData) {
      console.log({ tokenData });
      logoutTimer = setTimeout(logOutHandler, tokenData.duration);
    }
  }, [tokenData, logOutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: isUserLoggedIn,
    login: logInHandler,
    logout: logOutHandler,
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
