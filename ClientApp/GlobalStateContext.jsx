import React, { createContext, useContext, useReducer } from 'react';
import { checkPasswordOnServerAsync, logOutUserAsync } from './user/userAPI';

// Define initial state and actions
const initialState = {
  loading: false,
  isAuthorized: false,
  token: null, // To store JWT token
};

const SET_LOADING = 'SET_LOADING';
const SET_IS_AUTHORIZED = 'SET_IS_AUTHORIZED';
const SET_TOKEN = 'SET_TOKEN';

// Create the context and reducer
const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

const globalReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_IS_AUTHORIZED:
      return { ...state, isAuthorized: action.payload };
    case SET_TOKEN:
      return { ...state, token: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

// Global provider component
export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const checkPasswordAsync = async (password) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await checkPasswordOnServerAsync(password);
      if (response.data.token) {
        dispatch({ type: SET_IS_AUTHORIZED, payload: true });
        dispatch({ type: SET_TOKEN, payload: response.data.token });
        return 'PasswordOk';
      } else {
        alert('Wrong password, please try again.');
        return 'PasswordIncorrect';
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const logOutAsync = async () => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await logOutUserAsync();
      if (response.data === 'userLoggedOut' || response.data === 'userAlreadyLoggedOut') {
        dispatch({ type: SET_IS_AUTHORIZED, payload: false });
        dispatch({ type: SET_TOKEN, payload: null });
        return 'userLoggedOut';
      } else {
        alert(`Unexpected server response: ${response.data}`);
        return 'Error';
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  return (
    <GlobalStateContext.Provider value={{ ...state, checkPasswordAsync, logOutAsync }}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

// Custom hooks to use global state and dispatch
export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalDispatch = () => useContext(GlobalDispatchContext);

// Custom hooks for specific state and dispatch actions
export const useLoading = () => {
  const state = useGlobalState();
  const dispatch = useGlobalDispatch();
  
  return {
    loading: state.loading,
    setLoading: (value) => dispatch({ type: SET_LOADING, payload: value })
  };
};

// Custom hooks for session user actions
export const useSessionUser = () => {
  const state = useGlobalState();
  const { checkPasswordAsync, logOutAsync } = state;

  return {
    isAuthorized: state.isAuthorized,
    token: state.token,
    checkPasswordAsync,
    logOutAsync,
  };
};
