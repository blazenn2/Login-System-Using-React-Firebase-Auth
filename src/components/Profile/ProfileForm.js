import classes from './ProfileForm.module.css';
import { useNodeContext } from '../../Context/Node/NodeContext';
import { useHistory } from 'react-router-dom';

import { useRef } from 'react';

const ProfileForm = () => {
  const ctx = useNodeContext();
  const history = useHistory();
  const enteredPassword = useRef();
  const submitHandler = (e) => {
    e.preventDefault();
    const newPassword = enteredPassword.current.value;
    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyD-QiyGooMO6Cb6jCoBhlq8_0-9hGJnU2Y`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idToken: ctx.token,
        password: newPassword,
        returnSecureToken: false
      })
    })
      .then(res => {
        if (!res.ok) alert(res.error.message)
        else history.push("./")
      }).catch(err => console.error(err))
  }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={enteredPassword} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
