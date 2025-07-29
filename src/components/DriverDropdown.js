import React, { useEffect, useState } from 'react'
import { Dropdown, Button, Icon, Grid, GridColumn, GridRow } from 'semantic-ui-react'
import firebase from '../firebase'
import { DRIVER_STATUS } from '../utils/constants'

const DriverDropdown = ({handleChange, handleConfirmBooking, handleCancelBooking}) => {
  const [ opt, setOpt ] = useState([])
  const [ otherDetails, setOtherDetails ] = useState({})
  const [ load, setLoad ] = useState(false)

  useEffect(() => {
      setLoad(true)
      setTimeout(() => {
        fetchData()
      }, 1000);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // METHODS

  const fetchData = async() => {
      const drivers = await firebase.firestore().collection('drivers').get()
      const list = drivers.docs.map(doc => doc.data());

      const filtered = list.filter((d,i)=>{
        return d.STATUS === DRIVER_STATUS.AVAILABLE
      })

      const driverDropdown = filtered.map((h,i)=>{
        const { DRIVER_CODE, LAST_NAME, FIRST_NAME, IMG} = h.DRIVER_DETAILS
        setOtherDetails({...h.DRIVER_DETAILS, ACCOUNT_CODE: h.ACCOUNT_CODE})

        return {
          key: `${DRIVER_CODE} - ${LAST_NAME}, ${FIRST_NAME}`,
          text: `${DRIVER_CODE} - ${LAST_NAME}, ${FIRST_NAME}`,
          value: `${DRIVER_CODE} - ${LAST_NAME}, ${FIRST_NAME}`,
          image: {
            avatar: true,
            src: IMG
          }
        }
      })
      setOpt(driverDropdown)
      setLoad(false)
  }

  const handleRefreshDrivers = () => {
      setLoad(true)
      setTimeout(() => {
        fetchData()
      }, 1000);
  }

  if(opt.length === 0){
    return (<>
        <Button icon onClick={handleRefreshDrivers} color="green" labelPosition='right' loading={load}>
          <Icon name='refresh' />
          Refresh Drivers
        </Button>
    </>)
  }else{
    return (
      <Grid>

        <GridRow>
        <GridColumn width={16}>
          <Dropdown
            placeholder='Select Driver'
            fluid
            search
            selection
            options={opt}
            loading={load}
            onChange={(e, {key, value, details}) => handleChange(e, {key, value, details}, otherDetails)}
          />
        </GridColumn>
        </GridRow>

        <GridRow>
        <GridColumn width={5}>
        <Button icon onClick={handleCancelBooking} color="red" labelPosition='right' loading={load}>
          <Icon name='cancel' />
          Cancel Booking
        </Button>
        </GridColumn>
        <GridColumn width={5}>
        <Button icon onClick={handleRefreshDrivers} color="green" labelPosition='right' loading={load}>
          <Icon name='refresh' />
          Refresh Drivers
        </Button>
        </GridColumn>
        <GridColumn width={6}>
        <Button onClick={handleConfirmBooking} color="blue" icon labelPosition='right' loading={load}>
          <Icon name='check' />
          Confirm Booking
        </Button>
        </GridColumn>
        </GridRow>

      </Grid>
    )
  }

}

export default DriverDropdown