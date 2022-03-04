import { useState } from "react";
import useInput from "../../hooks/use-input";

import classes from "./AuthForm.module.css";

const passwordValidateHandler = (enteredValue) => enteredValue.trim().length > 5;
const emailValidateHandler = (emailAddress) => {
  var mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
  return mailformat.test(emailAddress);
};

const AuthForm = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchAuthModeHandler = () => {
    setIsNewUser((prevState) => !prevState);
    setErrors([]);
  };

  const {
    value: emailValue,
    isValueValid: isEmailValid,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    inputRestHandler: emailResetHandler,
    hasError: emailError,
  } = useInput(true, emailValidateHandler);
  const {
    value: passwordValue,
    isValueValid: isPasswordValid,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    inputRestHandler: passwordResetHandler,
    hasError: passwordError,
  } = useInput(true, passwordValidateHandler);

  const shouldButtonDisabled = isSubmitting || !isEmailValid || !isPasswordValid;

  const submitHandler = async (event) => {
    event.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    let url;

    if (isNewUser) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;
    }

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response) {
      setIsSubmitting(false);
    }

    const data = await response.json();

    if (data.error) {
      const errorMsgObjs = data.error.errors.map((error) => error.message);
      const errorMsgArr = Object.values(errorMsgObjs);
      setErrors(errorMsgArr);
    } else {
      emailResetHandler();
      passwordResetHandler();
    }
  };

  const errorTexts = errors.length > 0 && (
    <div>
      {errors.map((error, index) => (
        <p key={index} className={classes.error}>
          {error}
        </p>
      ))}
    </div>
  );

  let buttonText;

  if (isSubmitting) {
    buttonText = "loading...";
  }

  if (!isSubmitting) {
    buttonText = isNewUser ? "Login" : "Create Account";
  }

  return (
    <section className={classes.auth}>
      <h1>{isNewUser ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            required
            value={emailValue}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
          {emailError && <p className={classes.error}>Please enter valid email address</p>}
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            value={passwordValue}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
          />
          {passwordError && (
            <p className={classes.error}>
              Please set minimum password length to at least a value of 6.
            </p>
          )}
        </div>
        {errorTexts}
        <div className={classes.actions}>
          <button disabled={shouldButtonDisabled}>{buttonText}</button>
          <button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
            {isNewUser ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
