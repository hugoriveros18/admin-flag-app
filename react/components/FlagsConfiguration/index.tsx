import React, { useState, useEffect } from "react";
import { useCssHandles } from 'vtex.css-handles';
import { Layout, PageHeader, PageBlock, Table } from 'vtex.styleguide';
import CurrentDateValidation from "../CurrentDateValidation";
import FlagImage from "../FlagImage";
import CreateFlagModal from "../CreateFlagModal";
import DeleteFlagModal from "../DeleteFlagModal";
import './styles.css';
import EditFlagModal from "../EditFlagModal";

type FlagsConfigurations = {
  id: string
  tituloReferencia: string
  tipoReferencia: string
  idReferencia: string
  urlImagenIcono: string
  fechaInicio: string
  fechaFinal: string
}

const groupConvertion: any = {
  coleccion: 'Collection',
  marca: 'Brand',
  categoria: 'Category'
}

const tableFlagSchema = {
  properties: {
    tituloReferencia: {
      title: "Flag Title",
      width: 250,
      cellRenderer: ({ cellData }:any) => <p style={{width: '100%', textAlign: 'center'}}>{cellData}</p>
    },
    tipoReferencia: {
      title: "Group",
      cellRenderer: ({ cellData }:any) => <p style={{width: '100%', textAlign: 'center'}}>{groupConvertion[cellData]}</p>
    },
    idReferencia: {
      title: "Group ID",
      cellRenderer: ({ cellData }:any) => <p style={{width: '100%', textAlign: 'center'}}>{cellData}</p>
    },
    fechaInicio: {
      title: "Start Date",
      width: 200,
      cellRenderer: ({ cellData }:any) => <p style={{width: '100%', textAlign: 'center'}}>{cellData.replace('DF', ' ~ ')}</p>
    },
    fechaFinal: {
      title: "End Date",
      width: 200,
      cellRenderer: ({ cellData }:any) => <p style={{width: '100%', textAlign: 'center'}}>{cellData.replace('DF', ' ~ ')}</p>
    },
    urlImagenIcono: {
      title: "Flag Image",
      cellRenderer: ({ cellData }:any) => <FlagImage imageUrl={cellData}/>
    },
    currentState: {
      title: "Current State",
      cellRenderer: ({ rowData }:any) => <CurrentDateValidation startDate={rowData.fechaInicio} endDate={rowData.fechaFinal}/>
    }
  }
}

const flagsConfigurationCssHandles = [
  'flags-configuration__global-container'
]


const FlagsConfiguration = () => {

  //CSS HANDLES
  const handles = useCssHandles(flagsConfigurationCssHandles);

  //STATES
  const [flagsConfigurations,setFlagsConfigurations] = useState<FlagsConfigurations[]>([]);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [isDeleteFlagModalOpen,setIsDeleteFlagModalOpen] = useState<boolean>(false);
  const [isCreateFlagModalOpen,setIsCreateFlagModalOpen] = useState<boolean>(false);
  const [isEditFlagModalOpen,setIsEditFlagModalOpen] = useState<boolean>(false);
  const [currentFlag,setCurrentFlag] = useState<FlagsConfigurations | null>(null);

  //EFFECTS
  useEffect(() => {
    const fecthReferencias = async () => {
      await fetch(`/api/dataentities/FP/search?_fields=fechaInicio,fechaFinal,tipoReferencia,urlImagenIcono,idReferencia,id,tituloReferencia`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/vnd.vtex.ds.v10+json",
            "REST-Range": "resources=0-99"
        }
      })
        .then(res => res.json())
        .then(res => setFlagsConfigurations(res))
    }
    fecthReferencias();
    setRefetchData(false);
  },[refetchData])

  //TABLE ACTIONS LINE
  const lineActions = [
    {
      label: () => `Edit Flag`,
      onClick: ({ rowData }:any) => {
        setCurrentFlag(rowData)
        setIsEditFlagModalOpen(true);
      },
    },
    {
      label: () => `Delete Flag`,
      isDangerous: true,
      onClick: ({ rowData }:any) => {
        setCurrentFlag(rowData)
        setIsDeleteFlagModalOpen(true);
      }
    },
  ]

  //JSX
  return (
    <div className={`${handles['flags-configuration__global-container']}`}>
      <Layout
        fullWidth
        pageHeader={
          <PageHeader
            title="Product Flag Configuration"
          />
        }
      >
        <PageBlock variation="full">
          <Table
            fullWidth
            fixFirstColumn
            schema={tableFlagSchema}
            items={flagsConfigurations}
            lineActions={lineActions}
            toolbar={{
              newLine: {
                label: 'New Flag',
                handleCallback: () => setIsCreateFlagModalOpen(true)
              }
            }}
          />
          <DeleteFlagModal
            currentFlag={currentFlag}
            isDeleteFlagModalOpen={isDeleteFlagModalOpen}
            setIsDeleteFlagModalOpen={setIsDeleteFlagModalOpen}
            setRefetchData={setRefetchData}
          />
          <CreateFlagModal
            isCreateFlagModalOpen={isCreateFlagModalOpen}
            setIsCreateFlagModalOpen={setIsCreateFlagModalOpen}
            setRefetchData={setRefetchData}
          />
          <EditFlagModal
            currentFlag={currentFlag}
            isEditFlagModalOpen={isEditFlagModalOpen}
            setCurrentFlag={setCurrentFlag}
            setIsEditFlagModalOpen={setIsEditFlagModalOpen}
            setRefetchData={setRefetchData}
          />
        </PageBlock>
      </Layout>
    </div>
  )
}

export default FlagsConfiguration;
