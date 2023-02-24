import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import styles from './login.module.css';
import logo from '../../assets/logo.svg';
import googlelogo from '../../assets/google_logo.svg';

function Login() {
  // const [LoginDetails, setLoginDetails] = useState({ email: '', name: '' });

  const LoginReq = async (UserData) => {
    const { email, name } = UserData;

    const res = await fetch(`${import.meta.env.VITE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email, name,
      }),

    });

    // to check if data is coming perfectly or not
    const data = await res.json();
    console.log(data);
    // if (data.status === 442) {
    //   console.log('invalid username or password');
    //   setalert_message('invalid username or password');
    //   setalert_box(true);
    // } else if (data.status === 201) {
    //   localStorage.setItem('token', data.token);
    //   console.log('succesfully logged in');

    //   Navigate('/channels/@me');
    // } else if (data.status === 422) {
    //   console.log('not verified yet');
    //   setalert_message('not verified yet');
    //   setalert_box(true);
    // }
  };

  const login = useGoogleLogin({
    onSuccess: async (respose) => {
      try {
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${respose.access_token}`,
          },
        });
        LoginReq(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div id={styles.main}>
      <div id={styles.navbar}>
        <img id={styles.logo} className={styles.images} src={logo} alt="" />
        Notion
      </div>
      <div id={styles.login_body}>
        <div id={styles.login_body_wrap}>
          <div className={styles.login_body_comps} id={styles.heading}>Log in</div>
          <div className={styles.login_body_comps} id={styles.google_login} onClick={login}>
            <div id={styles.google_login_wrap}>
              <div className={styles.image}>
                <img src={googlelogo} alt="" />
              </div>
              <div className={styles.text}>Continue with Google</div>
            </div>
          </div>
          <form>
            <div id={styles.manual_login}>
              <div id={styles.label}>Email</div>
              <div id={styles.input_field}><input type="text" placeholder="Enter Email" required /></div>
              <button id={styles.manual_login_button} type="submit">Conitnue with Email</button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}

export default Login;
