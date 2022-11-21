import jwt_decode from "jwt-decode";
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { getDataAPI } from '../utils/fetchData';

export const checkTokenExp = async (token, dispatch) => {
  const decoded = jwt_decode(token)

  if(decoded.exp >= Date.now() / 1000) return;

  const res = await getDataAPI('refresh_token')
  dispatch({ type: GLOBALTYPES.AUTH, payload: res.data })
  return res.data.access_token;
}