import React from 'react'

const NotFound = () => {
    return (
        <div className="relative" style={{minHeight: 'calc(100vh)'}}>
            <h2 className="absolute text-red-200"
            style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                404 | Page non trouvée.
            </h2>
        </div>
    )
}

export default NotFound;
