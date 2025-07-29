import React, { useEffect, useState }  from 'react'
import firebase from '../firebase'
import { 
  CardMeta,
  CardHeader,
  CardGroup,
  CardDescription,
  CardContent,
  Button,
  Card,
  Image,
  Label,
  List,
  ListItem,
  Grid,
  GridColumn,
  Segment,
  Header,
  Icon,
  HeaderContent,
  HeaderSubheader,
  Divider
} from 'semantic-ui-react'
import { DRIVER_STATUS } from '../utils/constants.js'

const Drivers = () => {

  const [drivers, setDrivers] = useState([])

  useEffect(() => {
      fetchData()
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async() => {
      const db = await firebase.firestore();

      db.collection("drivers")
      .onSnapshot((querySnapshot) => {
          const d = []

          querySnapshot.forEach((doc) => {
              d.push({
                  ...doc.data(),
                  ID: doc.id
              });
          });

          setDrivers(d)
      })
  }
  
  const renderColorCard = (s) => {
    return s === DRIVER_STATUS.OFFLINE ? 'grey' : (
      s === DRIVER_STATUS.AVAILABLE ? 'green' : (
        s === DRIVER_STATUS.SCHEDULED ? 'red' : (
          s === DRIVER_STATUS.INTRANSIT ? 'blue' : 'black'
        )
      )
    )
  }

  const renderCard = (d, k) => {
    let { ACCOUNT_CODE, DRIVER_DETAILS, STATUS, TRIP } = d
    let { PLATE_NO, FIRST_NAME, LAST_NAME, CONTACT_NO, IMG, DRIVER_CODE } = DRIVER_DETAILS

    return (
        <Card fluid key={k}>  
          <Label attached='top' color={renderColorCard(STATUS)}>
            {`${LAST_NAME}, ${FIRST_NAME}`}
          </Label>
          <CardContent>
            <Image
              floated='right'
              size='large'
              avatar
              src={IMG}
            />
            <CardHeader>{DRIVER_CODE}</CardHeader>
            <CardMeta>Plate Number: {PLATE_NO}</CardMeta>
            <CardMeta>Contact Number: {CONTACT_NO}</CardMeta>
            <CardMeta>Trip: {TRIP}</CardMeta>
          </CardContent>
        </Card>
    )
  }

  const renderCount = (filterValue) => {
    let c = 0 
    
    let off = drivers.filter((d)=>{
      return d.STATUS === filterValue
    })

    return off.length
  }

  const renderDrivers = (filterValue) => {
    let off = drivers.filter((d)=>{
      return d.STATUS === filterValue
    })

    return (
      <div style={{padding: '1px'}}>
        {
          off.map((o, k)=>{
            return renderCard(o,k)
          })
        }
      </div>
    )
  }

  const SwimLane = (props) => {
    const { header, icon, color, count, renderCard } = props
    return (
      <>
          <Header as='h3'>
          <Icon name={icon} color={color}/>
          <HeaderContent>
            {header}
            <HeaderSubheader>{count}</HeaderSubheader>
          </HeaderContent>
          </Header>
          <Divider/>
          <div style={{overflow: 'auto', maxHeight: "75vh", scrollbarWidth: 'none'}}>
            {renderCard}
          </div>
      </>
    )
  }

  return (
    <div className="drivers">
      {/* {console.log('drivers', drivers)} */}
      <Grid stackable columns={3} >
        <GridColumn>
          <Segment>
            <SwimLane
              icon={'window close outline'}
              color={''}
              header={'Offline Drivers'}
              count={renderCount(DRIVER_STATUS.OFFLINE)}
              renderCard={renderDrivers(DRIVER_STATUS.OFFLINE)}
            />
          </Segment>
        </GridColumn>

        <GridColumn>
          <Segment>
            <SwimLane
              icon={'check square outline'}
              color={'green'}
              header={'Available Drivers'}
              count={renderCount(DRIVER_STATUS.AVAILABLE)}
              renderCard={renderDrivers(DRIVER_STATUS.AVAILABLE)}
            />
          </Segment>
        </GridColumn>

        <GridColumn>
          <Segment>
            <SwimLane
              icon={'caret square up'}
              color={'blue'}
              header={'In Transit Drivers'}
              count={renderCount(DRIVER_STATUS.INTRANSIT)}
              renderCard={renderDrivers(DRIVER_STATUS.INTRANSIT)}
            />
          </Segment>
        </GridColumn>

      </Grid>
    </div>
  )
}

export default Drivers

