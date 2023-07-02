import React, { useState, useEffect } from "react";
import { ModalDialog, Alert, Spinner } from 'vtex.styleguide';
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

type DeleteFlagModalProps = {
  currentFlag: FlagsConfigurations | null
  isDeleteFlagModalOpen: boolean
  setIsDeleteFlagModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefetchData: React.Dispatch<React.SetStateAction<boolean>>
}


const DeleteFlagModal = ({
  currentFlag,
  isDeleteFlagModalOpen,
  setIsDeleteFlagModalOpen,
  setRefetchData
}:DeleteFlagModalProps) => {

  //CSS HANDLES
  const CSS_HANDLES = [
    'create-flag-modal__loading-container',
    'create-flag-modal__informative-text'
  ]
  const handles = useCssHandles(CSS_HANDLES);

  //STATES
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [fetchSuccessfull, setFetchSuccessfull] = useState<boolean>(false);
  const [failedFetch, setFailedFetch] = useState<boolean>(false);

  //EFFECTS
  useEffect(() => {
    if(fetchSuccessfull || failedFetch) {
      setTimeout(() => {
        setIsDeleteFlagModalOpen(false);
        setFetchSuccessfull(false);
        setFailedFetch(false);
        setRefetchData(true);
      }, 2000)
    }
  },[fetchSuccessfull,failedFetch])

  //METHODS
  const deleteReferences = async () => {
    if(fetchLoading || fetchSuccessfull || failedFetch) {
      return
    }

    setFetchLoading(true);
    await fetch(`/api/dataentities/FP/documents/${currentFlag?.id}`, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/vnd.vtex.ds.v10+json"
      },
    })
    .then((res) => {
      setFetchLoading(false);
      if(res.ok) {
        setFetchSuccessfull(true);
      } else {
        setFailedFetch(true);
      }
      return res.json();
    })
  }

  //JSX
  return(
    <ModalDialog
      centered
      confirmation={{
        onClick: deleteReferences,
        label: 'Delete Flag',
      }}
      cancelation={{
        onClick: () => {setIsDeleteFlagModalOpen(false)},
        label: 'Cancel',
      }}
      isOpen={isDeleteFlagModalOpen}
      onClose={() => setIsDeleteFlagModalOpen(false)}
    >
      {
        (!fetchSuccessfull && !failedFetch && !fetchLoading) &&
        <p className={`${handles['create-flag-modal__informative-text']}`}>
          Are you sure you want to delete "{currentFlag?.tituloReferencia}"?
        </p>
      }
      {
        fetchSuccessfull &&
        <div style={{width: '100%', paddingTop: '35px'}}>
          <Alert type="success">Flag removed successfully.</Alert>
        </div>
      }
      {
        failedFetch &&
        <div style={{width: '100%', paddingTop: '35px'}}>
          <Alert type="error">Something went wrong. Please try again.</Alert>
        </div>
      }
      {
        fetchLoading &&
        <div className={`${handles['create-flag-modal__loading-container']}`}>
          <p>Removing flag</p>
          <Spinner color="currentColor" size={25} />
        </div>
      }

    </ModalDialog>
  )
}

export default DeleteFlagModal;
