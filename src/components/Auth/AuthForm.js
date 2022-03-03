import { useState, useRef } from "react";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isNewUser, setIsNewUser] = useState(true);
  const [errors, setErrors] = useState([]);

  const switchAuthModeHandler = () => {
    setIsNewUser((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const emailValue = emailInputRef.current.value;
    const passwordValue = passwordInputRef.current.value;

    // Validation here

    if (isNewUser) {
    } else {
      console.log(process.env.REACT_APP_FIREBASE_API_KEY);
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({
            email: emailValue,
            password: passwordValue,
            returnSecureToken: true,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      console.log({ data, error: data.error.message });

      if (data.error) {
        const errorMsgObjs = data.error.errors.map((error) => error.message);
        const errorMsgArr = Object.values(errorMsgObjs);
        setErrors(errorMsgArr);
      }
    }
  };

  const errorTexts = errors.length > 0 && (
    <div className={classes.error}>
      {errors.map((error, index) => (
        <p key={index}>
          {error}
        </p>
      ))}
    </div>
  );
  return (
    <section className={classes.auth}>
      <h1>{isNewUser ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordInputRef} />
        </div>
        {errorTexts}
        <div className={classes.actions}>
          <button>{isNewUser ? "Login" : "Create Account"}</button>
          <button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
            {isNewUser ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
