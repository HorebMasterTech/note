import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Fond from '../images/fond.png';
import { logout } from '../redux/actions/authAction';
import { deleteNote, mesNotes, newNote, updateCouleurNote, updateNote } from '../redux/actions/noteAction';


const Accueil = () => {

  const { auth, note } = useSelector(state => state);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // Initialisation des informations de l'utilisateur connecté
  const [userData, setUserData] = useState('');

  const [onEdit, setOnEdit] = useState(false)

  // Initialisation des notes
  const [allNotes, setAllNotes] = useState([])

  // Initialisation du Input pour afficher le TextArea au clique du input
  const [voirContent, setVoirContent] = useState(false);
  // Initialisation du Input
  const [voirPlace, setVoirPlace] = useState('Créer une note...');

  // Initialisation de la valeur du Input et textArea Update
  const [contenu, setContenu] = useState('');
  const [titre, setTitre] = useState('');
  const [noteId, setNoteId] = useState('');

  // Initialisation de la valeur du Input et textArea
  const [contenuEdit, setContenuEdit] = useState('');
  const [titreEdit, setTitreEdit] = useState('');

// Afficher le textArea au clique du Input Titre
const activeContent = () => {
  setVoirContent(true)
  setVoirPlace("Titre")
}

// Cacher le textArea au clique d'un espace quelconque
const desactiveContent = async () => {
  if(voirContent === false) setVoirContent(false)
  if(voirContent === true) setVoirContent(false)
  setVoirPlace("Créer une note...")

  if(titre == "" && contenu == "") return;
  else {
    dispatch(newNote(titre, contenu, auth.access_token));
    setContenu("")
    setTitre("")
  }
}

// Initialisation du bouton Deconnexion
const handleLogout = () => {
  if(!auth.access_token) return;
  dispatch(logout(auth.access_token))
}

// Vérifier s'il y a des notes et les afficher
useEffect(() => {
  if(!auth.access_token) return;
  dispatch(mesNotes(auth.access_token))
  setAllNotes(note.reverse())
}, [auth, dispatch, note]);

// Supprimer une note
const supprimerNote = (noteId) => {
  if(!auth.access_token) return;
  dispatch(deleteNote(noteId, auth.access_token))
}

// Modifier la couleur d'une note
const setDesign = (note, couleurChoisit) => {
  dispatch(updateCouleurNote(note, couleurChoisit, auth.access_token))
}

const handleEdit = (note) => {
  setOnEdit(true)
  setContenuEdit(note.contenu)
  setTitreEdit(note.titre)
  setNoteId(note.id)
}

const handleValidEdit = () => {
  setOnEdit(false)
  dispatch(updateNote(noteId, titreEdit, contenuEdit, auth.access_token))
}

// Vérifier s'il y a un Utilisateur et Initialiser les valeurs dans UserData
useEffect(() => {
  if(auth.access_token) {
    setUserData(auth.user)
  } else if(!auth.access_token) {
      navigate("/connexion");
  }
}, [auth.user, auth.access_token, navigate])




  return (
    <div className='flex flex-row blocPrincipal' style={{ width: '100%' }}>
      <div className='relative m-1 rounded-md shadow-md bg-neutral-800 barGauche' style={{ width: '5rem', height: 'calc(100vh - 10px)' }} onClick={desactiveContent}>
        <div className='relative flex items-center justify-center mb-2 font-bold rounded-full bg-slate-700' style={{ width: '50px', height: '50px', left: '50%', transform: 'translate(-50%)', top: '10px' }}>
          {userData && userData.nom.trim().substring(0, 1)}  
        </div>

        <div className='relative flex items-center justify-center font-bold bg-red-900 rounded-full' style={{ width: '50px', height: '50px', left: '50%', transform: 'translate(-50%)', top: '10px', cursor: 'pointer' }} onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
        </div>
      </div>

      <div className='absolute w-1/2 shadow inputTitre shadow-gray-900' style={{ left: '50%', transform: 'translate(-50%)', top: '10px', zIndex:"2" }} data-aos="fade-right">
        <input type="text" className='w-full p-2 text-white placeholder-white bg-neutral-800 focus:outline-none focus:border-slate-900' onClick={activeContent} style={{ borderRadius: '5px 5px 0 0'}} placeholder={voirPlace} name='titre' autoComplete='off' onChange={(e) => setTitre(e.target.value)} value={titre} role="titre" />
        { voirContent && <ReactQuill placeholder='Créer une note...' theme="snow" value={contenu} onChange={setContenu} /> }
      </div>

      {onEdit &&
      <div className="fixed flex flex-col text-center inpuForEdit w-100 h-100 loading" style={{background: "#000000b5", color: "white", top: 0, left: 0, zIndex: 50, width: "100%", height: "100%", display: 'flex', flexDirection: 'column'}}>
         <input type="text" className='w-full p-2 text-black placeholder-black bg-neutral-800 focus:outline-none focus:border-slate-900' style={{ borderRadius: '10px 10px 0 0'}} placeholder="Titre" name='titre' autoComplete='off' onChange={(e) => setTitreEdit(e.target.value)} value={titreEdit}  role="titre" />
        <ReactQuill placeholder='Créer une note...' theme="snow" value={contenuEdit} onChange={setContenuEdit}  /> 
        <button onClick={handleValidEdit} className='relative' style={{ cursor: 'pointer' }}>fermer</button>
      </div>}

      <div className='relative m-1 blocContenu' style={{ width: '95%', zIndex:'1' }} onClick={desactiveContent}>
        <div className='absolute w-full' style={{ left: "50%", top: "50%", transform: 'translate(-50%, -50%)', zIndex: '-1' }}>
          <img className='relative' src={Fond} alt="fond" style={{ width: "10%", height:"100%", left: "50%", top: "50%", transform: 'translate(-50%, -50%)' }} />
          <p className='tracking-widest text-center text-gray-700'>Les notes ajoutées s'affichent ici.</p>
        </div>

        <div className='px-5' style={{ transition: 'all .4s ease' }} >
          <div className='flex flex-wrap justify-center mt-20' style={{ transition: 'all .4s ease' }}>
            
            {allNotes && allNotes.map((note, index) => (
            <div className={`mon_bloc ${note.couleur} palette w-full p-3 relative focus:outline-none focus:border-slate-900 m-1 text-white shadow-gray-900 shadow`} style={{ width: '300px', height:'100%', transition: 'all .4s  ease', borderRadius:'10px' }} key={index}>
              <div style={{ minHeight: '60px' }} onClick={() => handleEdit(note)}>
                <p className='font-bold'>{note.titre}</p><br />
                <div dangerouslySetInnerHTML={{__html: note.contenu}} />
              </div>
              <div className='flex items-center justify-between' style={{ minHeight: '40px' }}>
                <div className='ml-1 couleur'><i className="fa-solid fa-palette"></i></div>
                <div className='mx-1 couleur' onClick={() => setDesign(note, "couleurBlanc")}><i className="fa-solid fa-circle"></i></div>
                <div className='mx-1 couleur' onClick={() => setDesign(note, "couleurRouge")}><i className="text-red-700 fa-solid fa-circle"></i></div>
                <div className='mx-1 couleur' onClick={() => setDesign(note, "couleurJaune")}><i className="text-yellow-400 fa-solid fa-circle"></i></div>
                <div className='mx-1 couleur' onClick={() => setDesign(note, "couleurVert")}><i className="text-green-400 fa-solid fa-circle"></i></div>
                <div className='mx-1 couleur' onClick={() => setDesign(note, "couleurBleu")}><i className="text-blue-400 fa-solid fa-circle"></i></div>
                <div className='mx-1 couleur' onClick={() => setDesign(note, "couleurDark")}><i className="fa-solid fa-circle text-neutral-800"></i></div>
                <div className='mx-1 couleur' onClick={() => setDesign(note, "couleurRose")}><i className="text-pink-700 fa-solid fa-circle"></i></div>
                <div className='mr-1 couleur' onClick={() => supprimerNote(note.id)}><i className="fa-solid fa-trash"></i></div>
              </div>
            </div>
            ))} 
        </div>
      </div>
        

      </div>
    </div>
  )
}

export default Accueil;