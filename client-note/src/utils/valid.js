const valid = ({nom, email, password}) => {
    const err = {}

    if(!nom) {
        err.nom = "Le prénom est nécssaire pour votre inscription"
    }else if(nom.length > 25){
        err.nom = "Votre prénom ne doit pas être supérieur à 25 caractères"
    }

    if(!email) {
        err.email = "Merci de saisir un email valide."
    }else if(!validateEmail(email)){
        err.email = "Email incorrecte."
    }

    if(!password) {
        err.password = "Merci de saisir le mot de passe."
    }else if(password.length < 6){
        err.password = "Le mot de passe doit être supérieur à 6 caractères."
    }

    return {
        errMsg: err,
        errLength: Object.keys(err).length
    }
}



function validateEmail(email) {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
  
export default valid