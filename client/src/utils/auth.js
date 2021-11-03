import instance from '../config/axios/instance';
// import axios from 'axios';
// import instance from '../config/axios/instance';
import Cookies from 'js-cookie';

const querystring = require('query-string');

export function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      instance
        .post(
          `/auth/login`,
          querystring.stringify({
            email,
            grant_type: 'password',
            password: password,
          }),
          {
            headers: headers,
          },
        )
        .then(
          res => {
            console.log(res);
            console.log(res.data.token, 'token');
            console.log(res.data.data.user, 'user');
            setAuthToken(res.data.token, res.data.data.user);
            resolve();
            // checkTokenValid(res.data.token).then(data => {
            //   if (data == true) {
            //     setAuthToken(res.data.token);
            //     resolve();
            //   } else {
            //     reject('Not Admin');
            //   }
            // });
          },
          err => {
            console.error('Caught an error during login:', err);
            reject(err);
          },
        );
    } catch (err) {
      console.error('Caught an error during login:', err);
      reject(err);
    }
  });
}

export function logoutUser() {
  clearAuthToken();
}

export function setAuthToken(token, user) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // localStorage.setItem(AUTH_TOKEN_KEY, token);
  Cookies.set('AUTH_TOKEN_KEY', token);
  Cookies.set('AUTH_TOKEN_USER', JSON.stringify(user));
}

export function getAuthToken() {
  // return localStorage.getItem(AUTH_TOKEN_KEY);

  return Cookies.get('AUTH_TOKEN_KEY');
}

export function getAuthTokenUser() {
  // return localStorage.getItem(AUTH_TOKEN_KEY);
  return Cookies.get('AUTH_TOKEN_USER');
}

export function clearAuthToken() {
  instance.defaults.headers.common['Authorization'] = '';
  // localStorage.removeItem(AUTH_TOKEN_KEY);
  Cookies.delete('AUTH_TOKEN_KEY');
  Cookies.delete('AUTH_TOKEN_USER');
}

export async function isLoggedIn() {
  let authToken = getAuthToken();
  if (authToken) {
    let isTokenValid = await checkTokenValid();
    console.log(isTokenValid);
    if (isTokenValid) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

async function checkTokenValid() {
  try {
    // check if token is valid by calling api and remove token from cookies
    const response = await instance.get(`/auth/verify-token`, {
      headers: { Authorization: 'Bearer ' + getAuthToken() },
    });
    const data = await response;
    console.log(data);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// async function checkTokenValidOnLogin(token) {
//   try {
//     // check if token is valid by calling api and remove token from cookies
//     const response = await axios.get(`/auth/verify-token`, {
//       headers: { Authorization: 'Bearer ' + token },
//     });
//     const data = await response;
//     console.log(data);
//     return true;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// }
