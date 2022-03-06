import classes from "./ProfileForm.module.css";
import AuthContext from "../../store/auth-context";
import { useContext, useState } from "react";
import useInput from "../../hooks/use-input";
import { passwordValidateHandler } from "../../helpers/inputValidations";

const ProfileForm = () => {
  const { token } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    value: newPasswordValue,
    inputBlurHandler,
    inputChangeHandler,
    inputRestHandler,
    hasError,
    isValueValid,
  } = useInput(true, passwordValidateHandler);

  const submitNewPasswordHandler = (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({
          idToken: token,
          password: newPasswordValue,
          returnSecureToken: false,
        }),
        headers: { "Content-Type": "application/json" },
      }
    ).then((response) => {
      console.log({ token, response });
      setIsSubmitting(false);
    });
  };

  const shouldButtonDisabled = isSubmitting || !isValueValid;

  return (
    <form className={classes.form} onSubmit={submitNewPasswordHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          value={newPasswordValue}
          onChange={inputChangeHandler}
          onBlur={inputBlurHandler}
        />
        <p className={classes.tip}>Minimum password length is 6</p>
        {hasError && (
          <p className="error">Please set minimum password length to at least a value of 6.</p>
        )}
      </div>
      <div className={classes.action}>
        <button disabled={shouldButtonDisabled}>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
