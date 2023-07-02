import React from "react";

const FlagDateFormated = ({ date }:any) => {


  //JSX
  return (
    <div>
      <p>{date.replace('DF', ' ~ ')}</p>
    </div>
  )
}

export default FlagDateFormated;
