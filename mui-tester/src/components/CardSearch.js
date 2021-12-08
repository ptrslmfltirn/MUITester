import React, {useEffect, useState} from "react";
import reactDom from "react-dom";
import { Autocomplete, ListItem, List, FormControl, Stack, TextField, Container, MenuItem, InputLabel } from "@mui/material";
import CardDisplayer from "./CardDisplayer";
import { Select } from "@mui/material";

function CardSearch ({setDeckState, deckState, identitySelection, setIdentitySelection}) {
  //Card Data - Overall set of cards fetched - nameLookUp: card selected by user via the autocomplete form 
    const [cardData, setCardData] = useState ([])
    const [nameLookup, setNameLookup] = useState("")
  //side, faction, type, costOperator, costValue = states for setting the filters. 
    const [side, setSide] = useState('All')
    const [faction, setFaction] = useState('All')
    const [type, setType] = useState('All')
    const [costOperator, setCostOperator] = useState('All')
    const [costValue, setCostValue] = useState(0)
  //CardType // selectedCard and the related useEffect are there while we attempt to figure out some rules enforcement issues.
    const [cardType, setCardType] = useState(true)
    let selectedCard = nameLookup
    useEffect (()=> {
        if (selectedCard.type_code === 'identity') {
            setCardType(false)
        }
    },[nameLookup])
    //Simple fetch from the server to acquire cards. 
    useEffect(()=> {
    fetch('http://localhost:3005/cards')
    .then((response)=> response.json())
    .then((data)=> {setCardData(data)})
  },[])
  //Adds to the deckState state - need to figure out a way to add seperate identity though? Possibly a 3rd state.
function sendCardtoDeck () {
  setDeckState([...deckState, nameLookup])
}
//Variables for the filter functions.
  let sideFilterFunc = card => {
    if (side === 'All') return true
    else return card.side_code === side
  }
  let factionFilterFunc = card => {
    if (faction === 'All') return true
    else if (faction === 'Neutral') return card.faction_code.includes('Neutral')
    else return card.faction_code === faction 
  }
  let typeFilterFunc = card => {
    if (type === 'All') return true
    else return card.type_code === type
  }
  let costFilterFunc = card => {
    if (costOperator === 'All') return true
    if (costOperator === '>=') return card.cost >= costValue
    if (costOperator === '>') return card.cost > costValue
    if (costOperator === '=') return card.cost == costValue
    if (costOperator === '<=') return card.cost <= costValue
    if (costOperator === '<') return card.cost < costValue
  }
  //Actually runs the filters.
  let cardsToDisplay = cardData
  .filter(sideFilterFunc)
  .filter(factionFilterFunc)
  .filter(typeFilterFunc) 
  .filter(costFilterFunc)
  .sort(function (a,b){
    if (a.stripped_title < b.stripped_title) {
      return -1
    }
    if (a.stripped_title > b.stripped_title) {
      return 1
    }
    else return 0
  })
   
 //Base props for the autocomplete. It works, but it is returning errors in console. Also does NOT like the delete click.
  const baseProps = {
    options: cardsToDisplay,

}

  return (
      <div>
        {/* CSS issues to be resolved  */}
      <Container sx={{ alignContent: 'center', display: 'grid', gridTemplateColums:'repeat(4, 1fr)', gridTemplateRows: 'auto', 
      gridTemplateAreas: '"main sidebar' }}>
      <Stack spacing={1} sx={{ gridArea: 'main'}}>
        <FormControl>
        <InputLabel id='SideLabel'>Filter by Side</InputLabel>
        <Select
          id='SideSelect'
          value={side}
          label='Side'
          onChange={(e)=>{setSide(e.target.value)}}>
            <MenuItem value='All'>All</MenuItem>
            <MenuItem value='corp'>Corp</MenuItem>
            <MenuItem value='runner'>Runner</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
           <InputLabel id='FactionLabel'>Filter by Faction</InputLabel>
           <Select id='FactionSelect' value={faction} label='Faction' onChange={(e=>{setFaction(e.target.value)})}>
             <MenuItem value='All'>All</MenuItem>
             <MenuItem value='Neutral'>Neutral</MenuItem>
             <MenuItem value='Anarch'>Anarch</MenuItem>
             <MenuItem value='Criminal'>Criminal</MenuItem>
             <MenuItem value='Shaper'>Shaper</MenuItem>
             <MenuItem value='NBN'>NBN</MenuItem>
             <MenuItem value='Haas-Bioroid'>Haas-Bioroid</MenuItem>
             <MenuItem value='Weyland-Consortium'>Weyland-Constortium</MenuItem>
             <MenuItem value='Jinteki'>Jinteki</MenuItem>
           </Select>
           </FormControl>
           <FormControl>
             <InputLabel id='TypeLabel'>Filter by Type</InputLabel>
              <Select id='TypeSelect' value={type} label='Type' onChange={(e=>{setType(e.target.value)})}>
                <MenuItem value='All'>All </MenuItem>
                <MenuItem value="Agenda">Agenda</MenuItem>
                <MenuItem value="Asset">Asset</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
                <MenuItem value='Hardware'>Hardware</MenuItem>
                <MenuItem value='ICE'>ICE</MenuItem>
                <MenuItem value='Identity'>Identity</MenuItem>
                <MenuItem value='Operation'>Operation</MenuItem>
                <MenuItem value='Program'>Program</MenuItem>
                <MenuItem value='Resource'>Resource</MenuItem>
                <MenuItem value='Upgrade'>Upgrade</MenuItem>
              </Select>
              </FormControl>
              <FormControl>
                <InputLabel id='CostLabel'>Filter by Cost</InputLabel>
                <Select id='CostSelect' value={costOperator} label='Cost' onChange={(e=>{setCostOperator(e.target.value)})}>
                <MenuItem value='All'>No Cost Filtering</MenuItem>
                <MenuItem value={'>'}>{'>'}</MenuItem>
                <MenuItem value={'>='}>{'>='}</MenuItem>
                <MenuItem value={'='}>{'='}</MenuItem>
                <MenuItem value={'<='}>{'<='}</MenuItem>
                <MenuItem value={'<'}>{'<'}</MenuItem>
                </Select>
                <TextField Cost label="Cost" defaultValue={costValue} onChange={(e=>{setCostValue(e.target.value)})} />
                </FormControl>
        <Autocomplete 
        {...baseProps}
        getOptionLabel={(option) => option.stripped_title}
        value={nameLookup}
        onChange={(event, newValue) => {setNameLookup(newValue)}}
        id="name"
        renderInput={(params) => (
            <TextField {...params} label="Search By Name" variant="standard" />
        )} /> 
      <button onClick={sendCardtoDeck} >Add to Deck</button>
    </Stack>
    <CardDisplayer sx={{gridArea:'sidebar'}} selectedCard={nameLookup}/>
    </Container>
     </div>
  )
    }
export default CardSearch