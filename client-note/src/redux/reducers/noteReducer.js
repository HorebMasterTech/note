import { NOTE_TYPES } from '../actions/noteAction';

const noteReducer = (state = [], action) => {
    switch (action.type) {
        case NOTE_TYPES.CREATE_NOTE:
            return [action.payload, ...state];
        case NOTE_TYPES.GET_NOTES:
            return action.payload
        case NOTE_TYPES.UPDATE_NOTE_COULEUR:
            return state.map(item => (
                item.id === action.payload.id ? { ...item, couleur: action.payload.couleur } : item
            ))
        case NOTE_TYPES.UPDATE_NOTE:
            return state.map(item => (
                item.id === action.payload.id ? { ...item, titre: action.payload.titre, contenu: action.payload.contenu } : item
            ))
        case NOTE_TYPES.DELETE_NOTE:
            return state.filter(item => item.id !== action.payload)
        default:
            return state
    }
}

export default noteReducer;