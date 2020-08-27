import React, { useState } from 'react'
import styled from 'styled-components'
import { mobileCategories } from '../../extra/categories'
import InfoIcon from '@material-ui/icons/Info'
import abbreviations from '../../extra/abbreviations'
import useWindowSize from '../../hooks/useWindowSize'

const StyledDiv = styled.div`
  font-size: 15px;
  color: #777;
  display: ${({visible}) => visible ? "block" : "none"};
  margin-left: 5px;
`

const StyledItem = styled.div`
  
`

const StyledInfoIcon = styled(InfoIcon)`
  font-size: 30px !important;
  color: #555;
  cursor: pointer;
`

function AbbreivationsInfo() {
  const [visible, setVisible] = useState(false)
  const [width, _] = useWindowSize()

  const typeItems = Object.keys(abbreviations).map((item, index) => <StyledItem key={index}>{abbreviations[item]} - {item}</StyledItem>)
  const categoryTtems = Object.keys(mobileCategories).map((item, index) => <StyledItem key={index}>{mobileCategories[item]} - {item}</StyledItem>)

  return (
    <div>
      <StyledInfoIcon onClick={() => setVisible(!visible)}/>
      <StyledDiv visible={visible}>
        {typeItems}
        {width <= 600 ? categoryTtems : null}
      </StyledDiv>
    </div>
  )
}

export default AbbreivationsInfo 
