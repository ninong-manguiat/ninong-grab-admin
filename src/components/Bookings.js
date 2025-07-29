import React, { useEffect, useState } from 'react';
import firebase from '../firebase'
import {
  Header,
  Grid,
  GridRow,
  GridColumn,
  List,
  ListItem,
  ListContent,
  Feed,
  FeedEvent,
  FeedLabel,
  FeedContent,
  HeaderSubheader,
  Divider,
  Step,
  StepDescription,
  StepContent,
  StepGroup,
  Input
} from 'semantic-ui-react'
import Profile from './Profile.js'
import DriverDropdown from './DriverDropdown.js'
import { DRIVER_STATUS, BOOKING_STATUS } from '../utils/constants'
import Notif from '../assets/notif.mp3';
import useSound from 'use-sound';

const Bookings = () => {
    const [book, setBookings] = useState([]);
    const [id, setId] = useState('');
    const [kms, setKms] = useState('');
    const [driver, setDriver] = useState({
        CONTACT_NO: '',
        DRIVERS_LICENSE: '',
        DRIVER_CODE: '',
        FIRST_NAME: '',
        LAST_NAME: '',
        PLATE_NO: '',
        IMG: ''
    });
    const [index, setIndex] = useState(0)

    useEffect(() => {
        fetchData()
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    const [play] = useSound(
        Notif,
        { volume: 0.25 }
    );

    useEffect(()=>{
        play();
    },[book])

    // METHODS
    const fetchData = async() => {
        const db = await firebase.firestore();

        db.collection("bookings")
        .orderBy('TIMESTAMP', "asc")
        .onSnapshot((querySnapshot) => {
            const d = []

            querySnapshot.forEach((doc) => {
                d.push({
                    ...doc.data(),
                    ID: doc.id,
                });
            });

            setBookings(d.reverse())
        })
    }

    useEffect(()=>{
        if(book.length !== 0){
            setIndex(0)  
            setId(book[0].ID)  
        }
    },[book])
    
    const handleConfirmBooking = async() => {
        const db = await firebase.firestore();
        db.collection("bookings").doc(id).update({
            STATUS: BOOKING_STATUS.C1,
            DRIVER: driver
        })

        db.collection("drivers").doc(driver.ACCOUNT_CODE).update({
            STATUS: DRIVER_STATUS.INTRANSIT,
            TRIP: id
        })
    }

    const handleIndex = (i) => {
        setIndex(i)
        setId(book[i].ID)
    }

    const handleChange = (e, {key, value, details}, otherDetails) => {
        setDriver({
            ...otherDetails
        })
    }

    const handleCancelBooking = async() => {
        const db = await firebase.firestore();
        db.collection("bookings").doc(id).update({
            STATUS: BOOKING_STATUS.CANCELLED
        })
    }

    // RENDERS

    const renderList = () => {
        return (
            <List selection divided verticalAlign='middle' animated>
                    {
                        book.map((b, i)=>{
                            return renderItem(b, i)
                        })
                    }
            </List>
        )
    }

    const renderItem = (b, i) => {
        return ( 
            <ListItem className={`list-item-code ${index === i ? 'selected' : ''}`} onClick={() => handleIndex(i)} >
                <ListContent className="list-item-code-list-content">
                    <Profile b={b} />
                </ListContent>
            </ListItem>
        )
    }

    const renderDriverChoices = () => {
        return (
            <Grid divided='vertically'>
                <GridRow>
                    <GridColumn width={16}>
                    <DriverDropdown
                        handleChange={handleChange}
                        handleConfirmBooking={handleConfirmBooking}
                        handleCancelBooking={handleCancelBooking}
                    />
                    </GridColumn>
                </GridRow>
            </Grid>
        )
    }

    const renderDispatched = (driver) => {
        const { LAST_NAME, FIRST_NAME, CONTACT_NO, PLATE_NO, DRIVER_CODE } = driver

        return (
            <Feed>
                <FeedEvent>
                    <FeedContent date={'Driver Details'} summary={() => {
                        return(<>{`${LAST_NAME}, ${FIRST_NAME}`}<br/>{CONTACT_NO}<br/>{PLATE_NO}<br/>{DRIVER_CODE}</>)
                    }} />
                </FeedEvent>
            </Feed>
        )
    }

    const validateStepper = (STATUS) => {
        switch (STATUS) {
            case BOOKING_STATUS.C1: return [true, true, false, false, false, false]
            case BOOKING_STATUS.C2: return [true, true, true, false, false, false]
            case BOOKING_STATUS.C3: return [true, true, true, true, false, false]
            case BOOKING_STATUS.C4: return [true, true, true, true, true, false]
            case BOOKING_STATUS.C5: return [true, true, true, true, true, true]
            default: return []
        }
    }

    const validateStatus = (STATUS) => {
        return STATUS === BOOKING_STATUS.C || 
        STATUS === BOOKING_STATUS.C1 || 
        STATUS === BOOKING_STATUS.C2 || 
        STATUS === BOOKING_STATUS.C3 || 
        STATUS === BOOKING_STATUS.C4 ||
        STATUS === BOOKING_STATUS.C5
    }

    const renderDriver = (d) => {
        if(d){
            const { FIRST_NAME, LAST_NAME, PLATE_NO } = d
            return (
                <FeedContent date={'ASSIGNED DRIVER'} summary={() => {
                    return(<>{d ? <>{`${LAST_NAME}, ${FIRST_NAME}`}<br/>{PLATE_NO}</> : ''}</>)
                }} />
            )
        }
    }

    const renderAmount = (a) => {
        if(a){
            return (
                <FeedContent date={'ACTUAL AMOUNT'} summary={() => {
                    return(<>{a ? <>{a}</> : ''}</>)
                }} />
            )
        }
    }

    const renderSelectedData = (ind) => {
        if(book[ind] !== undefined){
            const { CUSTOMER_DETAILS, STATUS, ID, ORIGIN, DESTINATION, DATE, ROUTE_COMPUTATION, DRIVER, ACTUAL_AMOUNT } = book[ind]
            const { NAME, CONTACT_NUMBER, REMARKS, BOOKING_DATE, BOOKING_TIME } = CUSTOMER_DETAILS
            const { d, t } = DATE
            
            const { ESTIMATE_AMOUNT } = ROUTE_COMPUTATION
            let url = "https://www.google.com/maps/embed/v1/directions?origin=" + ORIGIN.LAT + "," + ORIGIN.LNG + "&destination=" + DESTINATION.LAT + "," + DESTINATION.LNG + "&key=AIzaSyCLMHif6cuDU8xgbvBNpBHMC218KFdjueo"

            return(
                <>
                <Grid>
                <GridRow>
                <GridColumn width={12}>

                    <Header as='h1'>
                        
                        <Grid>
                        <GridRow>
                        <GridColumn width={16}>
                            {NAME}
                            <HeaderSubheader>
                            {CONTACT_NUMBER}<br/>
                            {ID}
                            </HeaderSubheader>
                        </GridColumn>
                        </GridRow>
                        </Grid>
                        <Divider/>
                        
                    </Header>

                    {renderChoicePerStatus(book[ind])}

                    <Feed>
                        <FeedEvent>
                            {/* <FeedLabel image={'image'} /> */}
                            <FeedContent date={'ORIGIN'} summary={() => {
                                return(<>{ORIGIN.ADDRESS}</>)
                            }} />
                            <FeedContent date={'DESTINATION'} summary={() => {
                                return(<>{DESTINATION.ADDRESS}</>)
                            }} />
                        </FeedEvent>
                        <br/>
                        <FeedEvent>
                            <FeedContent date={'BOOKING DATE & TIME'} summary={() => {
                                return(<>{`${d} ${t}`}<br/>{REMARKS}</>)
                            }} />
                            {
                                BOOKING_DATE && BOOKING_TIME && (
                                <FeedContent date={'BOOKING SCHEDULE'} summary={() => {
                                    return(<>{`${BOOKING_DATE} ${BOOKING_TIME}`}</>)
                                }} />
                            )
                            }
                            <FeedContent date={'ESTIMATED AMOUNT'} summary={() => {
                                return(<>{ESTIMATE_AMOUNT}</>)
                            }} />
                        </FeedEvent>
                        <br/>
                        <FeedEvent>
                        {renderDriver(DRIVER)}
                        {renderAmount(ACTUAL_AMOUNT)}
                        </FeedEvent>
                    </Feed>
                    <iframe src={url} frameborder="0" style={{border:0}} width="100%" height="450"/>

                </GridColumn>

                {
                    validateStatus(STATUS) ? (
                    <GridColumn width={4}>

                        <StepGroup ordered  size='medium' vertical>
                            <Step completed={validateStepper(STATUS)[1]}>
                            <StepContent>
                                <StepDescription>{BOOKING_STATUS.C1}</StepDescription>
                            </StepContent>
                            </Step>

                            <Step completed={validateStepper(STATUS)[2]}>
                            <StepContent>
                                <StepDescription>{BOOKING_STATUS.C2}</StepDescription>
                            </StepContent>
                            </Step>

                            <Step completed={validateStepper(STATUS)[3]}>
                            <StepContent>
                                <StepDescription>{BOOKING_STATUS.C3}</StepDescription>
                            </StepContent>
                            </Step>

                            <Step completed={validateStepper(STATUS)[4]}>
                            <StepContent>
                                <StepDescription>{BOOKING_STATUS.C4}</StepDescription>
                            </StepContent>
                            </Step>

                            <Step completed={validateStepper(STATUS)[5]}>
                            <StepContent>
                                <StepDescription>{BOOKING_STATUS.C5}</StepDescription>
                            </StepContent>
                            </Step>
                        </StepGroup>

                    </GridColumn>
                    ) : ''
                }

                </GridRow>
                </Grid>
                </>
            )
        }else{
            return (<></>)
        }
    }

    const renderChoicePerStatus = (ind) => {
        const { STATUS, DRIVER, ID, KMS } = ind

        switch (STATUS) {
            case BOOKING_STATUS.A: return renderKms(ID)
            case BOOKING_STATUS.B: return renderClientConfirmation(KMS)
            case BOOKING_STATUS.QUEUE: return renderDriverChoices()
            case BOOKING_STATUS.C: return renderDispatched(DRIVER)
            default: return ''
        }
    }

    const renderKms = (ID) => {
        return (
              <Input
                action={{
                    color: 'blue',
                    labelPosition: 'right',
                    icon: 'handshake',
                    content: 'Ask for Confirmation',
                    onClick: () => handleSubmitKms(ID)
                }}
                label={{ basic: true, content: 'kms' }}
                labelPosition='left'
                actionPosition='right'
                placeholder='Kms'
                value={kms}
                onChange={handleChangeKms}
            />
        )
    }

    const renderClientConfirmation = (KMS) => {
        return (
            <>
            {`Waiting for client confirmation with ${KMS} kms nearby driver...`}
            </>
        )
    }

    // HANDLERS

    const handleChangeKms = (e) => {
        const { value } = e.target

        setKms(value)
    }

    const handleSubmitKms = async(ID) => {
        const db = await firebase.firestore();

        // UPDATE DB
        db.collection("bookings").doc(ID).update({
          STATUS: BOOKING_STATUS.B,
          KMS: kms
        })
    }

    return (
        <div className="bookings">
              <Grid celled='internally'>
                <GridRow>
                <GridColumn width={4} className="sidebar-list">
                    {renderList()}
                </GridColumn>
                <GridColumn width={12}>
                    {renderSelectedData(index)}
                </GridColumn>
                </GridRow>
              </Grid>
        </div>
    )
}

export default Bookings