import React, { useContext, useRef } from 'react'
import styled from 'styled-components'
import {graphql, createFragmentContainer} from 'react-relay'
import { Link } from 'react-router-dom'
import hospitalTypes from '../../extra/categories'
import Tooltip from '../../Tooltip'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DataToShowContext from '../../contexts/DataToShow'
import { useWindowSize } from '../../hooks'
import { mobileCategories } from '../../extra/categories'
import { GridCell, GridColumnHeader } from '../../grid'

export const StyledRow = styled.div`
  display: contents;
`

export const StyledNumber = styled(GridCell)`
  text-align: center;
  color: ${({colorTheme, children}) => children == "N.A." ? "#ddd" : colorTheme == "green" ? "#008033" : colorTheme === "red" ? "#C3423F" : colorTheme === "blue" ? "rgb(0, 66, 102)": null};
  justify-content: center;
`

const StyledInfoIcon = styled(InfoOutlinedIcon)`
  font-size: 19px !important;
  color: #aaa;
  padding-left: 5px;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:visited {
    color: inherit;
  }
`

function HospitalName({name, counter, id}) {
  const linkRef = useRef()
  const parentRef = useRef()
  const tooltipRef = useRef()

  function handleClick(event) {
    if(document.documentElement.clientWidth <= 600) {
      if(tooltipRef.current.contains(event.target)) {
        parentRef.current.style.overflow = ["hidden", ""].includes(parentRef.current.style.overflow) ? "initial" : "hidden"
        return
      }
    }

    linkRef.current.click()
  }
  
  let newName = name

  if(document.documentElement.clientWidth <= 600) {
    if(name.length > 25) {
      newName = `${name.slice(0,26).trim()}...`
    }

    return (
      <GridColumnHeader counter={counter} onClick={handleClick} ref={parentRef}>
        <StyledLink to={`/hospital/${decodeURI(id)}`} ref={linkRef}>
          {newName}
        </StyledLink>
        { newName != name ?
        <Tooltip text={name} innerRef={tooltipRef} onClick={true}> 
          <StyledInfoIcon />          
        </Tooltip> : null}
      </GridColumnHeader>
    ) 
  } else {
    return (
      <GridColumnHeader counter={counter} onClick={handleClick} ref={parentRef}>
        <StyledLink to={`/hospital/${decodeURI(id)}`} ref={linkRef}>
          {name}
        </StyledLink>
      </GridColumnHeader>
    )
  }
}

function HospitalRow(props) {
  let {counter, hospital} = props
  const {dataToShow} = useContext(DataToShowContext)
  const [width, _] = useWindowSize()
  
  const colorTheme = dataToShow == "available" ? "green" : dataToShow == "total" ? "blue" : dataToShow == "occupied" ? "red" : null  
  const fieldDataToShow = dataToShow[0].toUpperCase() + dataToShow.slice(1)
  let fields = ['general', 'hdu', 'icu', 'ventilators']
  fields = fields.map((item) => {return {total: hospital[item+'Total'], value: hospital[item+fieldDataToShow] } })

  const renderedFields = fields.map((item, index) => <StyledNumber colorTheme={colorTheme} key={index} counter={counter}>{item.total ? item.value : "N.A." }</StyledNumber>)

  return (
    <StyledRow counter={counter}>
      <HospitalName name={hospital.name} counter={counter} id={hospital.id}/>

      <StyledNumber style={{color: '#004266'}} counter={counter}>{width <= 600 ? mobileCategories[hospitalTypes[hospital.category]] : hospitalTypes[hospital.category]}</StyledNumber>

      <StyledNumber style={{color: '#004266'}} counter={counter} >{props.geolocation ? `${hospital.distance} km` : "N.A."}</StyledNumber>
      
      {renderedFields}
    </StyledRow>
  )
}

export default createFragmentContainer(
  HospitalRow,
  {
    hospital: graphql`
      fragment HospitalRow_hospital on Hospital {
        id
        category
        name
        distance
        generalOccupied
        generalAvailable
        hduOccupied
        hduAvailable
        icuOccupied
        icuAvailable
        ventilatorsOccupied
        ventilatorsAvailable
        generalTotal
        ventilatorsTotal
        icuTotal
        hduTotal
      }
    `
  }
)

// export default HospitalItem
