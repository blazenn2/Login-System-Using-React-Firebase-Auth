import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';
import { useNodeContext } from '../../Context/Node/NodeContext';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(null);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const ctx = useNodeContext();
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD-QiyGooMO6Cb6jCoBhlq8_0-9hGJnU2Y`;
    setIsLoading(true);
    if (!isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD-QiyGooMO6Cb6jCoBhlq8_0-9hGJnU2Y`;
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      setIsLoading(false);
      if (!res.ok) return res.json().then(data => alert(data.error.message))
      else return res.json().then(data => {
        if (isLogin) {
          history.replace('/');
          const timeForLogout = new Date(new Date().getTime() + Number(+data.expiresIn * 1000))
          ctx.login(data.idToken, timeForLogout);
        }
      })
    }).catch(err => console.error(err));

  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passwordInputRef} required />
        </div>
        <div className={classes.actions}>
          {isLoading ? <p>Sending Request</p> : <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
