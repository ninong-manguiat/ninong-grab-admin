import React from 'react'
import { GridRow, GridColumn, Grid, Image } from 'semantic-ui-react'

const Dashboard = () => (
  <Grid columns={3} divided style={{margin: 'auto 80px'}}>
    <GridRow>
      <GridColumn>
        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
      </GridColumn>
      <GridColumn>
        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
      </GridColumn>
      <GridColumn>
        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
      </GridColumn>
    </GridRow>

    <GridRow>
      <GridColumn>
        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
      </GridColumn>
      <GridColumn>
        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
      </GridColumn>
      <GridColumn>
        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
      </GridColumn>
    </GridRow>
  </Grid>
)

export default Dashboard
