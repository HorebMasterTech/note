import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col text-center fixed w-100 h-100 loading"
        style={{background: "#000000dd", color: "white", top: 0, left: 0, zIndex: 50, width: "100%", height: "100%", display: 'flex', flexDirection: 'column'}}>
           <div className="la-ball-spin-rotate la-dark la-3x">
            <div></div><div></div>
          </div>
        <h2 className='text-xl mt-5 tracking-widest'>Horeb Note...</h2>
    </div>
  )
}

export default Loading;