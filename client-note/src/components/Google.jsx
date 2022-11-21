import React, { useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../redux/actions/authAction';

const SocialLogin = () => {

    const dispatch = useDispatch();

    const clientId = '961164162689-3dubgc9q3uo9g8gsa5g1ndedittbcaac.apps.googleusercontent.com';

    useEffect(() => {
       const initClient = () => {
             gapi.client.init({
             clientId: clientId,
             scope: ''
           });
        };
        gapi.load('client:auth2', initClient);
    });

    const onSuccess = (res) => {
        const id_token = res.tokenId;
        dispatch(googleLogin(id_token));
    };

    return (
       <GoogleLogin
          clientId={clientId}
          buttonText="Google"
          onSuccess={onSuccess}
          cookiePolicy={'single_host_origin'}
          theme="light"
      />
      
  );
}

export default SocialLogin;