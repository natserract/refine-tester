import { Refine } from '@pankod/refine'
import routerProvider from '@pankod/refine-react-router'

import '@pankod/refine/dist/styles.min.css'
// import dataProvider from '@pankod/refine-graphql'
import dataProvider from 'services/graphql/data.provider';

import {
  Title,
  Sider,
  OffLayoutArea,
} from 'components'
import client from 'services/graphql'
import { Header, Footer, Layout } from 'layout'
import allResources from 'routes'

const gqlDataProvider = dataProvider(client)

function App() {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={gqlDataProvider as any}
      Title={Title}
      Header={Header}
      Sider={Sider}
      Footer={Footer}
      Layout={Layout}
      OffLayoutArea={OffLayoutArea}
      resources={allResources}
    />
  )
}

export default App
