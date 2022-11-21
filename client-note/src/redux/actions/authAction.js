import { getDataAPI, postDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';
import { checkTokenExp } from '../../utils/checkTokenExp';

export const connexion = (data) => async (dispatch) => {
  try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
  
      const res = await postDataAPI('connexion', data)
            
      dispatch({ type: GLOBALTYPES.AUTH, payload: res.data})
  
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
      localStorage.setItem('connexion', 'Horeb-Note')
      
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.error } })
    }
}

export const inscription = (userRegister) => async (dispatch) => {
  
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    
    const res = await postDataAPI('inscription', userRegister)

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.error } })
  }
}

export const refreshToken = () => async (dispatch) => {
  const connexion = localStorage.getItem("connexion")
  if(connexion !== "Horeb-Note") return;
    
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
          const res = await getDataAPI('refresh_token')
          // console.log("RES, ", res);
          dispatch({ type: GLOBALTYPES.AUTH, payload: res.data })
          dispatch({ type: GLOBALTYPES.ALERT, payload: {} })
      } catch (err) {
          dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.error}
        })
      }
}

export const logout = (token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch)
  const access_token = result ? result : token

  try {
    localStorage.removeItem('connexion')
    dispatch({ type: GLOBALTYPES.AUTH, payload: { } })
    dispatch({ type: GLOBALTYPES.ALERT, payload: {success: "vous êtes maintenant déconnecté. " } })
    await getDataAPI('deconnexion', access_token);
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.error } })
  }
}

export const passwordSend = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

    const res = await postDataAPI('mot-de-passe', data)

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.error } })
  }
}

export const passwordReset = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

    const res = await postDataAPI('reinitialiser-mot-de-passe', data)

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.error } })
  }
}

export const googleLogin = (id_token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

    const res = await postDataAPI('google_connexion', { id_token })
    
    dispatch({ type: GLOBALTYPES.AUTH, payload: res.data })

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
    localStorage.setItem('connexion', 'Horeb-Note')
    
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.error } })
  }
}

export const facebookLogin = (accessToken, userID) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

    const res = await postDataAPI('facebook_connexion', { accessToken, userID })
    
    dispatch({ type: GLOBALTYPES.AUTH,payload: res.data })

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
    localStorage.setItem('connexion', 'Horeb-Note')
    
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.error } })
  }
}
