import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { showErrMsg, showSuccessMsg } from '../../components/alert/Alert';
import { postDataAPI } from '../../utils/fetchData';
import { useNavigate } from 'react-router-dom';

const Activation = () => {

    const {id} = useParams();
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');
    const [cacher, setCacher] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if(id){
          postDataAPI('activation', { active_token: id })
          .then(res => setSuccess(res.data.msg))
          .catch(err => setErr(err.response.data.error))
        }
        setTimeout(() => {
          navigate("/connexion", { replace: true })
         }, 5000);
      },[id, navigate]);

      useEffect(() => {
        setTimeout(() => {
          setCacher("hide")
        }, 5000);
      }, []);

  return (
    <>
    <div className="fixed flex flex-col text-center w-100 h-100 loading"
        style={{background: "#000000", color: "white", top: 0, left: 0, zIndex: 50, width: "100%", height: "100%", display: 'flex', flexDirection: 'column'}}>

          {err && ( <div className={`toast ${cacher}  show fixed bg-orange-100 border-t-4 border-orange-500 rounded-b text-orange-900 px-4 py-3 shadow-md`} role="alert" style={{ top: '5px', right: '15px', minWidth: '100px', zIndex: 9999, cursor: "pointer" }}>
          <div className={`flex text-orange-900`}>
            <div className="py-1"><svg className={`fill-current h-6 w-6 text-orange-500 mr-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="font-bold">Erreur</p>
              <div className="text-sm">{showErrMsg(err)}</div>
            </div>
          </div>
          </div>)}

        <h2 className='mt-5 text-xl tracking-widest'>Votre compte est maintenant activé!</h2>
        <h2 className='mt-5 text-xl tracking-widest'>Vous serez rédirigé vers la page de connexion dans 5 secondes</h2>
          <div className="la-ball-spin-rotate la-dark la-3x"><div></div><div></div></div>
        <h2 className='mt-5 text-xl tracking-widest'>Horeb Note...</h2>

        {success && (
          <div className={`toast ${cacher}  show fixed bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md`} role="alert" style={{ top: '5px', right: '15px', minWidth: '100px', zIndex: 9999, cursor: "pointer" }}>
          <div className={`flex text-green-900`}>
            <div className="py-1"><svg className={`fill-current h-6 w-6 text-green-500 mr-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="font-bold">Succès</p>
              <div className="text-sm">{showSuccessMsg(success)}</div>
            </div>
          </div>
        </div>)}
    </div>
    </>
  )
}

export default Activation