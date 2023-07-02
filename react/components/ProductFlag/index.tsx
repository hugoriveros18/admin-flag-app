import React, {  useState, useEffect } from 'react';
import { useProduct } from 'vtex.product-context';
import { useCssHandles } from 'vtex.css-handles';
import { useQuery, useLazyQuery } from "react-apollo";
import getListOfFlags from '../../graphql/getListOfFlags.graphql';
import getProductCategories from '../../graphql/getProductCategories.graphql';
import './styles.css';

const CSS_HANDLES = [
  "product-flag__global-container",
  "product-flag__pdp-margin",
  "product-flag__image"
]

const ProductFlag = () => {

  //CONTEXTO DE PRODUCTO
  const productContext = useProduct();

  //GRAPHQL QUERIES
  const { data: flagsData } = useQuery(getListOfFlags);
  const [getProductCategoriesQuery , { data: categoryQueryData }] = useLazyQuery(getProductCategories);

  //CSS HANDLES
  const handles = useCssHandles(CSS_HANDLES);
  handles

  //ESTADOS
  const [currentActiveReference, setCurrentActiveReference] = useState<any>(null);
  const [activeValidCategories, setActiveValidCategories] = useState<any>(null);

  //EFECTOS
  useEffect(() => {
    setCurrentActiveReference(null);
    setActiveValidCategories(null);
    if(flagsData && productContext) {
      console.log('flagsData',flagsData)
      let validDocuments:any = {
        validCollections: [],
        validBrands: [],
        validCategories: []
      }

      flagsData.documents.forEach((document:any) => {

        const now = new Date();
        const inputStartDate = new Date(document.fields[3].value.replace('DF','T'));
        const inputEndDate = new Date(document.fields[4].value.replace('DF','T'));

        if(inputStartDate.getTime() < now.getTime() && inputEndDate.getTime() > now.getTime()) {
          const groupType:any = document.fields[0].value;
          const documentInfo = {
            referenceId: document.fields[1].value,
            referenceIcon: document.fields[2].value
          }

          switch (groupType) {
            case 'coleccion':
              validDocuments.validCollections.push(documentInfo);
              break;
            case 'marca':
              validDocuments.validBrands.push(documentInfo);
              break;
            case 'categoria':
              validDocuments.validCategories.push(documentInfo);
              break;
          }
        }
      })

      //Collection Validation
      if(validDocuments.validCollections.length > 0) {
        const productCollections: string[] = productContext.product.productClusters.map((collection:any) => collection.id);
        for(let collection of validDocuments.validCollections) {
          if(productCollections.includes(collection.referenceId)) {
            setCurrentActiveReference(collection.referenceIcon);
            return;
          }
        }
      }
      //Brand Validation
      if(validDocuments.validBrands.length > 0) {
        const productBrandId = `${productContext.product.brandId}`;
        for(let brand of validDocuments.validBrands) {
          if(brand.referenceId == productBrandId) {
            setCurrentActiveReference(brand.referenceIcon);
            return
          }
        }
      }
      //Categories Query Validation
      if(validDocuments.validCategories.length > 0) {
        setActiveValidCategories(validDocuments.validCategories);
        const productId = {
          variables: {
            productId: productContext.product.productId
          }
        }
        getProductCategoriesQuery(productId);
      }
    }
  },[productContext,flagsData])

  useEffect(() => {
    if(activeValidCategories && categoryQueryData) {
      const productCategories:any = categoryQueryData.product.categoryTree.map((category:any) => `${category.id}`);
      console.log('categoryQueryData',categoryQueryData)
      console.log('productCategories',productCategories)
      for(let category of activeValidCategories) {
        console.log('cada category', category)
        if(productCategories.includes(category.referenceId)) {

          console.log('set categorias full')
          setCurrentActiveReference(category.referenceIcon);
        }
      }
    }
  },[activeValidCategories,categoryQueryData])

  //JSX
  if(currentActiveReference) {
    return (
      <div
        className={
          `
          ${handles['product-flag__global-container']}
          `
        }
      >
        <img
          className={`${handles['product-flag__image']}`}
          src={currentActiveReference}
          alt='Product Flag'/>
      </div>
    );
  }

  return null;
}

// ProductFlag.schema = IconoEnvioGratisSchema;

export default ProductFlag;
