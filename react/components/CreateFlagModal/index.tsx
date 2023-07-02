import React, { useState, useEffect } from "react";
import { ModalDialog, Input, Dropdown, DatePicker, TimePicker, Spinner, Alert } from 'vtex.styleguide';
import { useCssHandles } from 'vtex.css-handles';
import './styles.css';

type CreateFlagModalProps = {
  isCreateFlagModalOpen: boolean
  setIsCreateFlagModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefetchData: React.Dispatch<React.SetStateAction<boolean>>
}


const CreateFlagModal = ({
  isCreateFlagModalOpen,
  setIsCreateFlagModalOpen,
  setRefetchData
}:CreateFlagModalProps) => {

  //VARIABLES
  const errorInputMessage = "This field cannot be empty";
  const monthFormat:any = {
    0: '01',
    1: '02',
    2: '03',
    3: '04',
    4: '05',
    5: '06',
    6: '07',
    7: '08',
    8: '09',
    9: '10',
    10: '11',
    11: '12'
  }
  const dayFormat:any = {
    1: '01',
    2: '02',
    3: '03',
    4: '04',
    5: '05',
    6: '06',
    7: '07',
    8: '08',
    9: '09',
  }

  //CSS HANDLES
  const CSS_HANDLES = [
    'create-flag-modal__global-container',
    'create-flag-modal__date-container',
    'create-flag-modal__loading-container'
  ]
  const handles = useCssHandles(CSS_HANDLES);

  //STATES
  const [flagTitle, setFlagTitle] = useState<string>('');
  const [flagTitleErrorMessage, setFlagTitleErrorMessage] = useState<string>('');
  const [flagGroup, setFlagGroup] = useState<string>('coleccion');
  const [flagGroupId, setFlagGroupId] = useState<string>('');
  const [flagGroupIdErrorMessage, setFlagGroupIdErrorMessage] = useState<string>('');
  const [startDate, setStartDate] = useState<any>(new Date());
  const [startHour, setStartHour] = useState<any>(new Date());
  const [endDate, setEndDate] = useState<any>(new Date());
  const [endHour, setEndHour] = useState<any>(new Date());
  const [iconUrl, setIconUrl] = useState<string>('');
  const [iconUrlErrorMessage, setIconUrlErrorMessage] = useState<string>('');
  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [successfullFetch, setSuccessfullFetch] = useState<boolean>(false);
  const [failedFetch, setFailedFetch] = useState<boolean>(false);

  //EFFECTS
  useEffect(() => {
    if(successfullFetch) {
      setTimeout(() => {
        setIsCreateFlagModalOpen(false);
        setLoadingFetch(false);
        setSuccessfullFetch(false);
        setRefetchData(true);
      }, 2000)
    }
  },[successfullFetch])


  //METHODS
  const fetchReferences = async (flagTitle:string, flagGroup:string, flagGroupId:string, initialDateComputed:string, finalDateComputed:string) => {
    setLoadingFetch(true);
    await fetch(`/api/dataentities/FP/documents`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/vnd.vtex.ds.v10+json",
          "REST-Range": "resources=0-99"
      },
      body: JSON.stringify(
        {
          tituloReferencia: flagTitle,
          tipoReferencia: flagGroup,
          idReferencia: flagGroupId,
          urlImagenIcono: iconUrl,
          fechaInicio: initialDateComputed,
          fechaFinal: finalDateComputed
        }
      )
      })
      .then((res) => {
        if(res.ok) {
          setSuccessfullFetch(true);
        } else {
          setFailedFetch(true);
          setLoadingFetch(false);
        }
      })
  }

  const formatTime = (time:number) => {
    const timeLength = `${time}`.length;

    return timeLength > 1
    ? time
    : `0${time}`
  }

  const handleSubmit = () => {
    if(successfullFetch) {
      return
    }

    const inputInitialDate = new Date(startDate);
    const inputInitialHour = new Date(startHour);
    const inputFinalDate = new Date(endDate);
    const inputFinalHour = new Date(endHour);

    if(flagTitle === '') {
      setFlagTitleErrorMessage(errorInputMessage);
      return
    }
    if(flagGroupId === '') {
      setFlagGroupIdErrorMessage(errorInputMessage);
      return
    }
    if(iconUrl === '') {
      setIconUrlErrorMessage(errorInputMessage);
      return
    }

    const initialDateComputed = `${inputInitialDate.getFullYear()}-${monthFormat[inputInitialDate.getMonth()]}-${inputInitialDate.getDate() < 10 ? dayFormat[inputInitialDate.getDate()] : inputInitialDate.getDate()}DF${formatTime(inputInitialHour.getHours())}:${formatTime(inputInitialHour.getMinutes())}:00`

    const finalDateComputed = `${inputFinalDate.getFullYear()}-${monthFormat[inputFinalDate.getMonth()]}-${inputFinalDate.getDate() < 10 ? dayFormat[inputFinalDate.getDate()] : inputFinalDate.getDate()}DF${formatTime(inputFinalHour.getHours())}:${formatTime(inputFinalHour.getMinutes())}:00`


    fetchReferences(flagTitle,flagGroup,flagGroupId,initialDateComputed,finalDateComputed);
  }

  //JSX
  return (
    <ModalDialog
      centered
      confirmation={{
        onClick: handleSubmit,
        label: 'Create Flag',
      }}
      cancelation={{
        onClick: () => setIsCreateFlagModalOpen(false),
        label: 'Cancel',
      }}
      isOpen={isCreateFlagModalOpen}
      onClose={() => setIsCreateFlagModalOpen(false)}
    >
      <div className={`${handles['create-flag-modal__global-container']}`}>
        {
          !loadingFetch &&
          <>
            {/* FLAG TITLE */}
            <div>
              <Input
                placeholder="example-name"
                required
                label="Flag Title"
                onChange={(e:any) => {
                  setFlagTitle(e.target.value)
                  setFlagTitleErrorMessage('');
                }}
                errorMessage={flagTitleErrorMessage}
              />
            </div>
            {/* GROUP */}
            <div>
              <Dropdown
                label="Group"
                options={[
                  { value: 'coleccion', label: 'Collection' },
                  { value: 'marca', label: 'Brand' },
                  { value: 'categoria', label: 'Category' },
                ]}
                value={flagGroup}
                onChange={(e:any) => setFlagGroup(e.target.value)}
              />
            </div>
            {/* GROUP ID */}
            <div>
              <Input
                placeholder="12345"
                required
                label="Group ID"
                onChange={(e:any) => {
                  setFlagGroupId(e.target.value)
                  setFlagGroupIdErrorMessage('');
                }}
                errorMessage={flagGroupIdErrorMessage}
              />
            </div>
            {/* IMAGE URL */}
            <div>
              <Input
                placeholder="https://example.vtexassets.com/arquivos/example.png"
                required
                label="Icon URL"
                onChange={(e:any) => {
                  setIconUrl(e.target.value)
                  setIconUrlErrorMessage('');
                }}
                errorMessage={iconUrlErrorMessage}
              />
            </div>
            {/* START DATE */}
            <div className={`${handles['create-flag-modal__date-container']}`}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date:any) => setStartDate(date)}
                  locale="es-CO"
                />
                <TimePicker
                  label="Start Hour"
                  placeholder="Select a time or type a custom one..."
                  value={startHour}
                  onChange={(date:any) => {
                    setStartHour(date);
                  }}
                  locale="es-CO"
                  interval={5}
                />
            </div>
            {/* END DATE */}
            <div className={`${handles['create-flag-modal__date-container']}`}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(date:any) => setEndDate(date)}
                  locale="es-CO"
                />
                <TimePicker
                  label="End Hour"
                  placeholder="Select a time or type a custom one..."
                  value={endHour}
                  onChange={(date:any) => {
                    setEndHour(date);
                  }}
                  locale="es-CO"
                  interval={5}
                />
            </div>
            {
              failedFetch &&
                <div className={`${handles['create-flag-modal__date-container']}`}>
                  <Alert type="error">Something went wrong. Please try again.</Alert>
                </div>
            }
          </>
        }
        {
          loadingFetch &&
          <div className={`${handles['create-flag-modal__loading-container']}`}>
            {
              successfullFetch
              ?
                <div style={{width: '100%'}}>
                  <Alert type="success">Flag created successfully.</Alert>
                </div>
              :
                <>
                  <p>Saving flag</p>
                  <Spinner color="currentColor" size={28} />
                </>
            }
          </div>
        }
        {

        }
      </div>
    </ModalDialog>
  )
}

export default CreateFlagModal;
