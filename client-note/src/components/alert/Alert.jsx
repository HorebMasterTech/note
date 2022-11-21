import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import Loading from './Loading';
import Toast from './Toast';

export const showErrMsg = (error) => {
    return <div className="errMsg">{error}</div>
  }
  
export const showSuccessMsg = (msg) => {
    return <div className="successMsg">{msg}</div>
  }

const Alert = () => {

   const { alert } = useSelector(state => state)
   const dispatch = useDispatch()

  return (
    <div>
        {alert.loading && <Loading />}
        {
            alert.error && 
            <Toast msg={{title: "Erreur", body: alert.error}} 
            handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
            bgColor="orange" />
        }

        {
            alert.success && 
            <Toast msg={{ title: "Succès", body: alert.success}}
            handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
            bgColor="green" />
        }

        {
            alert.info && 
            <Toast msg={{title: "Info", body: alert.info}}
            handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
            bgColor="blue" />
        }
    </div>
  )
}

export default Alert;