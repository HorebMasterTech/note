import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';
import { checkTokenExp } from '../../utils/checkTokenExp';

export const NOTE_TYPES = {
    GET_NOTES: 'GET_NOTES',
    LOADING_NOTE: 'LOADING_NOTE',
    CREATE_NOTE: 'CREATE_NOTE',
    DELETE_NOTE: 'DELETE_NOTE',
    UPDATE_NOTE_COULEUR: 'UPDATE_NOTE_COULEUR',
    UPDATE_NOTE: 'UPDATE_NOTE'
}

export const mesNotes = (token) => async (dispatch) => {
  try {
  dispatch({ type: NOTE_TYPES.LOADING_NOTE, payload: true })
  const res = await getDataAPI('notes', token);
  dispatch({ type: NOTE_TYPES.GET_NOTES, payload: res.data.data })

  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { } })
  }
}

export const newNote = (titre, contenu, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

    const res = await postDataAPI('note', { titre, contenu }, token)
    dispatch({
      type: NOTE_TYPES.CREATE_NOTE,
      payload: res.data
    })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } })

  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.error } })
  }
}

export const updateCouleurNote = (data, couleurChoisit, token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch)
  const access_token = result ? result : token

  try {
    dispatch({ type: NOTE_TYPES.UPDATE_NOTE_COULEUR, payload: {data, couleurChoisit} })
    await patchDataAPI(`note/${data.id}`, {couleurChoisit}, access_token)
    
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.error } })
  }
}

export const updateNote = (noteId, titreEdit, contenuEdit, token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch)
  const access_token = result ? result : token

  try {
    dispatch({ type: NOTE_TYPES.UPDATE_NOTE, payload: {noteId, titreEdit, contenuEdit} })
    await patchDataAPI(`noteEdit/${noteId}`, {titreEdit, contenuEdit}, access_token)
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.error } })
  }
}

export const deleteNote = (id, token) => async (dispatch) =>{
  const result = await checkTokenExp(token, dispatch)
  const access_token = result ? result : token

  try {
    dispatch({ type: NOTE_TYPES.DELETE_NOTE, payload: id })
    await deleteDataAPI(`note/${id}`, access_token)
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.error } })
  }
}


