import React, { useState } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import logo from '../../assets/logo.svg';
import googlelogo from '../../assets/google_logo.svg';

function Login() {
  const Navigate = useNavigate();

  const GoogleSignin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/google_signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            response,
          }),

        });
        const data = await res.json();
        const { status } = data;
        // didnt added token in destructuring because token is only recieved if status is 200 or 201
        if (status === 201 || status === 200) {
          const { FileId, token } = data;
          console.log('came here');
          localStorage.setItem('token', token);
          localStorage.setItem('LastVisitedFileId', FileId);
          Navigate(`/${FileId}`);
        }
      } catch (err) {
        console.log(err, 'camer here');
      }
    },
    flow: 'auth-code',
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
          <div className={styles.login_body_comps} id={styles.google_login} onClick={GoogleSignin}>
            <div id={styles.google_login_wrap}>
              <div className={styles.image}>
                <img src={googlelogo} alt="" />
              </div>
              <div className={styles.text}>Continue with Google</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Login;
