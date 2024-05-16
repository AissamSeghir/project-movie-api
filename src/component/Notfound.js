import React from 'react'
import Lottie from "lottie-react";
import Found from "../assets/Animation-found.json";

function Notfound() {
  return (
    <>
      <Lottie className='animation' animationData={Found}/>
    </>
  )
}

export default Notfound
