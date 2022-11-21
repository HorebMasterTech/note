import React, { useState } from 'react';
import { useEffect } from 'react';

const Toast = ({ msg, handleShow, bgColor }) => {

  const [cacher, setCacher] = useState("");

  useEffect(() => {

    setTimeout(() => {
      setCacher("hidden")
    }, 5000);
  }, []);

  return (
    
    <div className={`toast ${cacher} show fixed bg-${bgColor}-100 border-t-4 border-${bgColor}-500 rounded-b text-${bgColor}-900 px-4 py-3 shadow-md`} role="alert" onClick={handleShow}  style={{ top: '5px', right: '15px', minWidth: '100px', zIndex: 9999, cursor: "pointer" }}>
      <div className={`flex text-${bgColor}-900`}>
        <div className="py-1"><svg className={`fill-current h-6 w-6 text-${bgColor}-500 mr-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
        <div>
          <p className="font-bold">{msg.title}</p>
          <p className="text-sm">{msg.body}</p>
        </div>
      </div>
    </div>
  )
}

export default Toast;