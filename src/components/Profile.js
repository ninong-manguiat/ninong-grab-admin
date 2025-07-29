import React from 'react'
import {
  FeedSummary,
  FeedLabel,
  FeedEvent,
  FeedDate,
  FeedContent,
  Feed,
  Label,
  Grid,
  GridRow,
  GridColumn
} from 'semantic-ui-react'
import { BOOKING_STATUS } from '../utils/constants'

const Profile = ({b}) => {
  const { CUSTOMER_DETAILS, DATE, ID, STATUS } = b
  const { NAME } = CUSTOMER_DETAILS
  const { d, t } = DATE
  const pb = { paddingBottom: '6px'}

  const colorStatus = () => {
      switch (STATUS) {
          case BOOKING_STATUS.QUEUE: return 'green'
          case BOOKING_STATUS.C1: return 'blue'
          case BOOKING_STATUS.C2: return 'blue'
          case BOOKING_STATUS.C3: return 'blue'
          case BOOKING_STATUS.C4: return 'blue'
          case BOOKING_STATUS.C5: return 'blue'
          case BOOKING_STATUS.DONE: return 'teal'
          case BOOKING_STATUS.CANCELLED: return 'red'
          default: return ''
      }
  }

  const msgStatus = () => {
    switch (STATUS) {
        case BOOKING_STATUS.QUEUE: return BOOKING_STATUS.QUEUE
        case BOOKING_STATUS.C1: return 'INTRANSIT'
        case BOOKING_STATUS.C2: return 'INTRANSIT'
        case BOOKING_STATUS.C3: return 'INTRANSIT'
        case BOOKING_STATUS.C4: return 'INTRANSIT'
        case BOOKING_STATUS.C5: return 'INTRANSIT'
        case BOOKING_STATUS.DONE: return BOOKING_STATUS.DONE
        case BOOKING_STATUS.CANCELLED: return BOOKING_STATUS.CANCELLED
        default: return ''
    }
}

  return (
    <Feed>
      <FeedEvent>
        <FeedContent>
          <Grid>
          <GridRow>
            <GridColumn width={9}>

            <FeedSummary style={pb}>{NAME}</FeedSummary>
            <FeedDate style={pb}>{`${d} ${t}`}</FeedDate>
            <FeedDate style={pb}>#{ID}</FeedDate>

            </GridColumn>
            
            <GridColumn width={7}>

            <Label size="large" color={colorStatus()}>{msgStatus()}</Label>

            </GridColumn>
          </GridRow>
          </Grid>
          
        </FeedContent>
      </FeedEvent>
    </Feed>
  )
}

export default Profile