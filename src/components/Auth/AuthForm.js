import { useContext, useState } from "react";
import useInput from "../../hooks/use-input";
import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";
import { passwordValidateHandler, emailValidateHandler } from "../../helpers/inputValidations";
import { useHistory } from "react-router-dom";

const AuthForm = () => {
  const history = useHistory();
  const [isNewUser, setIsNewUser] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authCtx = useContext(AuthContext);

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

    if (!isNewUser) {
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

    const data = await response.json();

    if (data.error) {
      const errorMsgObjs = data.error.errors.map((error) => error.message);
      const errorMsgArr = Object.values(errorMsgObjs);
      setErrors(errorMsgArr);
      setIsSubmitting(false);
    }
    if (!data.error && isNewUser) {
      emailResetHandler();
      passwordResetHandler();
      console.log({ data, isNewUser });
    }
    if (!data.error && !isNewUser) {
      const expirationTime = new Date(new Date().getTime() + +data.expiresIn * 1000);
      authCtx.login(data.idToken, expirationTime);
      history.replace("/profile");
    }
  };

  const errorTexts = errors.length > 0 && (
    <div>
      {errors.map((error, index) => (
        <p key={index} className="error">
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
    buttonText = isNewUser ? "Create Account" : "Login";
  }

  return (
    <section className={classes.auth}>
      <h1>{isNewUser ? "Sign Up" : "Login"}</h1>
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
          {emailError && <p className="error">Please enter valid email address</p>}
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
            <p className="error">Please set minimum password length to at least a value of 6.</p>
          )}
        </div>
        {errorTexts}
        <div className={classes.actions}>
          <button disabled={shouldButtonDisabled}>{buttonText}</button>
          <button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
            {!isNewUser ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
