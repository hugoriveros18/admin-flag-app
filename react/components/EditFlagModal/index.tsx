import React, { useState, useEffect } from "react";
import { ModalDialog, Input, Dropdown, DatePicker, TimePicker, Spinner, Alert } from 'vtex.styleguide';
import { useCssHandles } from 'vtex.css-handles';
import './styles.css';

type FlagsConfigurations = {
  id: string
  tituloReferencia: string
  tipoReferencia: string
  idReferencia: string
  urlImagenIcono: string
  fechaInicio: string
  fechaFinal: string
}

type EditFlagModalProps = {
  currentFlag: FlagsConfigurations | null
  isEditFlagModalOpen: boolean
  setCurrentFlag: React.Dispatch<React.SetStateAction<FlagsConfigurations | null>>
  setIsEditFlagModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefetchData: React.Dispatch<React.SetStateAction<boolean>>
}


const EditFlagModal = ({
  currentFlag,
  isEditFlagModalOpen,
  setCurrentFlag,
  setIsEditFlagModalOpen,
  setRefetchData
}:EditFlagModalProps) => {

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
    'edit-flag-modal__global-container',
    'edit-flag-modal__date-container',
    'edit-flag-modal__loading-container'
  ]
  const handles = useCssHandles(CSS_HANDLES);

  //STATES
  const [flagTitle, setFlagTitle] = useState<string>('');
  const [flagTitleErrorMessage, setFlagTitleErrorMessage] = useState<string>('');
  const [flagGroup, setFlagGroup] = useState<string>('');
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
        setIsEditFlagModalOpen(false);
        setLoadingFetch(false);
        setSuccessfullFetch(false);
        setRefetchData(true);
      }, 2000)
    }
  },[successfullFetch])

  useEffect(() => {
    if(currentFlag) {
      setFlagTitle(currentFlag?.tituloReferencia);
      setFlagGroup(currentFlag.tipoReferencia)
      setFlagGroupId(currentFlag.idReferencia)
      setStartDate(new Date (currentFlag.fechaInicio.replace('DF','T')))
      setStartHour(new Date (currentFlag.fechaInicio.replace('DF','T')))
      setEndDate(new Date (currentFlag.fechaFinal.replace('DF','T')))
      setEndHour(new Date (currentFlag.fechaFinal.replace('DF','T')))
      setIconUrl(currentFlag.urlImagenIcono)
    }
  },[currentFlag])


  //METHODS
  const fetchReferences = async (flagTitle:string, flagGroup:string, flagGroupId:string, initialDateComputed:string, finalDateComputed:string) => {
    setLoadingFetch(true);
    await fetch(`/api/dataentities/FP/documents/${currentFlag?.id}`, {
      method: "PUT",
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

    const initialDateComputed = `${inputInitialDate.getFullYear()}-${monthFormat[inputInitialDate.getMonth()]}-${inputInitialDate.getDate() < 10 ? dayFormat[inputInitialDate.getDate()] : inputInitialDate.getDate()}DF${formatTime(inputInitialHour.getHours())}:${formatTime(inputInitialHour.getMinutes())}:00`;

    const finalDateComputed = `${inputFinalDate.getFullYear()}-${monthFormat[inputFinalDate.getMonth()]}-${inputFinalDate.getDate() < 10 ? dayFormat[inputFinalDate.getDate()] : inputFinalDate.getDate()}DF${formatTime(inputFinalHour.getHours())}:${formatTime(inputFinalHour.getMinutes())}:00`;


    fetchReferences(flagTitle,flagGroup,flagGroupId,initialDateComputed,finalDateComputed);
  }

  const handleModalClose = () => {
    setIsEditFlagModalOpen(false);
    setCurrentFlag(null);
    setFlagTitleErrorMessage('');
    setFlagGroupIdErrorMessage('');
    setIconUrlErrorMessage('');
    setLoadingFetch(false);
    setSuccessfullFetch(false);
    setFailedFetch(false);
  }

  //JSX
  return (
    <ModalDialog
      centered
      confirmation={{
        onClick: handleSubmit,
        label: 'Save Flag',
      }}
      cancelation={{
        onClick: handleModalClose,
        label: 'Cancel',
      }}
      isOpen={isEditFlagModalOpen}
      onClose={handleModalClose}
    >
      <div className={`${handles['edit-flag-modal__global-container']}`}>
        {
          !loadingFetch &&
          <>
            {/* FLAG TITLE */}
            <div>
              <Input
                placeholder="example-name"
                required
                value={flagTitle}
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
                value={flagGroupId}
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
                value={iconUrl}
                onChange={(e:any) => {
                  setIconUrl(e.target.value)
                  setIconUrlErrorMessage('');
                }}
                errorMessage={iconUrlErrorMessage}
              />
            </div>
            {/* START DATE */}
            <div className={`${handles['edit-flag-modal__date-container']}`}>
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
            <div className={`${handles['edit-flag-modal__date-container']}`}>
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
                <div className={`${handles['edit-flag-modal__date-container']}`}>
                  <Alert type="error">Something went wrong. Please try again.</Alert>
                </div>
            }
          </>
        }
        {
          loadingFetch &&
          <div className={`${handles['edit-flag-modal__loading-container']}`}>
            {
              successfullFetch
              ?
                <div style={{width: '100%'}}>
                  <Alert type="success">Flag saved successfully.</Alert>
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

export default EditFlagModal;
