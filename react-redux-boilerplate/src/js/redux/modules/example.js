import {createAction, handleActions} from 'redux-actions';
import {Map} from 'immutable';

const SET_EXAMPLE = 'workshop/example/SET_EXAMPLE';
const LOGIN = 'workshop/example/LOGIN';

export const constants = {
    SET_EXAMPLE,
    LOGIN
};

// ------------------------------------
// Actions
// ------------------------------------
export const setAwesomeCode = createAction(SET_EXAMPLE, message => ({message}));
export const login = createAction(LOGIN, userinfo => ({userinfo}));

export const actions = {
    setAwesomeCode,
    login
};

export const reducers = {
    [SET_EXAMPLE]: (state, {payload}) =>
        state.set('result', payload.message),
    [LOGIN]:(state,{payload})=>
        state.set('userinfo', payload)
};

export const initialState = Map({
    result: '',
    userinfo: ''
});

export default handleActions(reducers, initialState);
