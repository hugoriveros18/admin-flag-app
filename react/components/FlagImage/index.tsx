import React from "react";
import { useCssHandles } from 'vtex.css-handles';
import './styles.css';

type FlagImageProps = {
  imageUrl: string
}

const FlagImageCssHandles = [
  'flag-image-container'
]

const FlagImage = ({ imageUrl }: FlagImageProps) => {

  //CSS HANDLES
  const handles = useCssHandles(FlagImageCssHandles);

  //JSX
  return (
    <div className={`${handles['flag-image-container']}`}>
      <img src={imageUrl}/>
    </div>
  )
}

export default FlagImage;
