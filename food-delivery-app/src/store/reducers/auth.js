import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

// store the token and handle the auth state

const initialState  = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/' // url that hold the redirect path
};

const authStart = (state, action) => {
    return updateObject(state, { error: null, loading: true });
}

const authSuccess = (state, action) => {
    return updateObject( state, {
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false
    });
}

const authFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    })
}

const authLogout = (state, action) => { // log out the user by clearing the state
    return updateObject(state, { token: null, userId: null })
}

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, {authRedirectPath: action.path})
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);  
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);  
        case actionTypes.AUTH_FAIL: return authFail(state, action);  
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action); // redirect to checkout page after login with order
        default: return state;
    }
}

export default reducer;