import { GLOBALTYPES } from '../actions/globalTypes';

const authReducer = (state = {}, action) => {
    switch (action.type) {
        case GLOBALTYPES.AUTH:
            return action.payload;
        default:
            return state
    }
}

export default authReducer;