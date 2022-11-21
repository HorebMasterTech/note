import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React, {useEffect} from 'react';
import Connexion from './pages/connexion';
import Accueil from "./pages/Accueil";
import Alert from "./components/alert/Alert";

import { refreshToken } from './redux/actions/authAction';
import { mesNotes } from './redux/actions/noteAction';

import PageRender from "./PageRender";
import { useDispatch, useSelector } from 'react-redux';

function App() {

  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken())
    dispatch(mesNotes())
  },[dispatch])

  return (
    <div>

      <BrowserRouter>
      <Alert />
        <Routes>
          <Route exact path="/" element={<Accueil />} />
          <Route path="/:page" element={<PageRender />} />
          <Route path="/:page/:id" element={<PageRender />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
