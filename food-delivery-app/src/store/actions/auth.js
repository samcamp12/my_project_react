import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START // provide the option to display spinner
    };
}

export const authSuccess = (token, userId) => { // pass the response data
    return {
        type: actionTypes.AUTH_SUCCESS, 
        idToken: token,
        userId: userId  // token and userId as props to reducer
    };
}

export const authError = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
}

export const logout = () => { // log out user
    localStorage.removeItem('token'); // remove the localstorge data
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userId')
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeout = (expirationTime) => { // set the experiation time to logout users after some time
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime*1000)
    };
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = { // receive the posted data
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyChfQdn0fj-eZsINHoiPeVoqxin60Ote0U'; // signup
        if(!isSignup) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyChfQdn0fj-eZsINHoiPeVoqxin60Ote0U'; // signin
        }
        axios.post(url, authData)
        // apikey from firebase apikey
        .then(response => {
            console.log(response);
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000); // need a date object. set as expire in 60mins
            localStorage.setItem('token', response.data.idToken) // pass auth state to the localstorage. 'token' is the key here
            localStorage.setItem('expirationTime', expirationDate);
            localStorage.setItem('userId', response.data.localId); // save the user id
            dispatch(authSuccess(response.data.idToken, response.data.localId)); // to store the token (id and token)
            dispatch(checkAuthTimeout(response.data.expiresIn)); // a firebase response data, which is the expire time
        })
        .catch(error =>{
            console.log(error);
            dispatch(authError(error.response.data.error)); // got error from firebase
        } );
    }
}

export const setAuthRedirectPath = (path) => { // redirect to checkout page after login with order
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
};

export const authCheckState = () => { // log out the user after expiration
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationTime = new Date(localStorage.getItem('expirationTime'));
            if(expirationTime > new Date()){
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId))
                dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000)); 
            } else {
                dispatch(logout());
            }
        }
    };
}