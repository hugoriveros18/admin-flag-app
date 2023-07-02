import React, { useEffect, useState } from "react";
import { useCssHandles } from 'vtex.css-handles';
import './styles.css';

type CurrentDateValidationProps = {
  startDate: string
  endDate: string
}

const currentDateValidationCssHandles = [
  'current-date__container'
]

const CurrentDateValidation = ({
  startDate,
  endDate
}:CurrentDateValidationProps) => {

  //CSS HANDLES
  const handles = useCssHandles(currentDateValidationCssHandles);

  //STATES
  const [isDateValid, setIsDateValid] = useState<boolean>(false);

  //EFFECTS
  useEffect(() => {
    const now = new Date();
    const startDateInput = new Date(startDate.replace('DF','T'));
    const endDateInput = new Date(endDate.replace('DF','T'));

    if(startDateInput.getTime() < now.getTime() && endDateInput.getTime() > now.getTime()) {
      setIsDateValid(true);
    }

  },[])

  //JSX
  return (
    <p
      className={`${handles['current-date__container']}`}
      style={isDateValid ? {color: "green"} : {color: "red"}}
    >
      {isDateValid ? 'Active' : 'Inactive'}
    </p>
  )
}

export default CurrentDateValidation;
