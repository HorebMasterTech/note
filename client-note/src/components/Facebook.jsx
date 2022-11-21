import React from 'react';
import { FacebookLogin } from 'react-facebook-login-lite';
import { useDispatch } from 'react-redux';
import { facebookLogin } from '../redux/actions/authAction';

const Facebook = () => {

const dispatch = useDispatch();

const onSuccess = (response) => {
    const { accessToken, userID } = response.authResponse;
    dispatch(facebookLogin(accessToken, userID));
}
    

  return (
    <FacebookLogin 
      appId="5756437954407575"
      onSuccess={onSuccess}
      btnText="Facebook"
      language='fr_FR'
      theme='dark'
    />
  )
}

export default Facebook;