import { Link } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import AuthContext from "../../store/auth-context";
import { Fragment, useContext } from "react";

const MainNavigation = () => {
  const { isLoddgedIn } = useContext(AuthContext);

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoddgedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoddgedIn && (
            <Fragment>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button>Logout</button>
              </li>
            </Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
