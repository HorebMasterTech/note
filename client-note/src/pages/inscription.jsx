import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { inscription } from '../redux/actions/authAction';


const Inscription = () => {

    const { alert } = useSelector(state => state)
    const navigate = useNavigate();
    
    const initialState = { email: '', nom: '', password: '' }
    const [userData, setUserData] = useState(initialState)
    const { email, nom, password } = userData;
      
    const dispatch = useDispatch();
    
    const handleChangeInput = e => {
    const {name, value} = e.target;
    setUserData({...userData, [name]:value})
    }
    
    const handleSubmit = e => {
        e.preventDefault();
        dispatch(inscription(userData));
    }
    
    useEffect(() => {
        if(alert && alert.success) {
            setUserData({ email: "", nom: "", password: "" })
            navigate('/wait')
        }
    }, [alert, navigate])

  return (
    <div data-aos="fade-right" style={{ width: "100%", height: "100vh" }}>
    <div className='formulaire container max-w-lg absolute bg-neutral-800 p-8 rounded-xl shadow' style={{ left: '50%', top: "50%", transform: 'translate(-50%, -50%)' }} data-aos="fade-down-right">
       <div className='my-2 text-left px-10'>
            <h1 className='text-3xl font-medium tracking-widest'><i className="fa-solid fa-user"></i> Inscription</h1>
        </div>
        <form className='mx-10' onSubmit={handleSubmit}>
            <div className="flex flex-col">
                <div className="mb-5">
                    <label htmlFor="" className="font-semibold text-white tracking-widest"><i className="fa-solid fa-user-plus"></i> Nom</label>
                    <input type="text" className='w-full py-2 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow text-black' placeholder='Votre nom' name='nom' value={nom} onChange={handleChangeInput}/>
                </div>
                <div className="mb-5">
                    <label htmlFor="" className="font-semibold text-white tracking-widest"><i className="fa-solid fa-envelope"></i> Email</label>
                    <input type="email" className='w-full py-2 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow text-black' placeholder='Adresse mail' name='email' value={email} onChange={handleChangeInput}/>
                </div>
                <div className="mb-5">
                    <label htmlFor="" className="font-semibold text-white tracking-widest"><i className="fa-solid fa-lock"></i> Password</label>
                    <input type="password" className='w-full py-2 mt-1 mb-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow text-black' placeholder='Mot de passe' name='password' value={password} onChange={handleChangeInput} />
                </div>
                <button type='submit' className='w-full py-3 font-semibold text-white bg-black hover:bg-slate-900 rounded-lg border-slate-900 hover:shadow tracking-widest'>Inscription</button>
            </div>
        </form>
        <div className='flex flex-col text-center px-10 py-5'>
            <Link to="/connexion" className='tracking-widest'>Connexion</Link>
            
        </div>
    </div>
    </div>
  )
}

export default Inscription;