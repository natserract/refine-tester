
import { useList, useMany } from '@pankod/refine'
import { useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { requestGql } from 'services/graphql/request.gql';
import type { Event } from '@prisma/client'
import { EVENTS_QUERY } from './events.page.query';
import { CREATEDONATIONS_MUTATION } from './events.page.mutation';

type EventsPageResponses = {
  eventPage: {
    events: Event[]
  }
}

const EventsPage = () => {
  // const { data, isLoading, isError } = useQuery('eventPage', async () => {
  //   const { data } = await requestGql<EventsPageResponses>(EVENTS_QUERY);

  //   return data
  // });

  // const { mutate: mutateCreateDonation, data: createDonationData } = useMutation('createDonations', async () => {
  //   const { data } = await requestGql(CREATEDONATIONS_MUTATION, {
  //     input: {
  //       donation_for_type: "programs",
  //       donation_for_id: 24,
  //       amount: 200,
  //       tenant_id: 35,
  //     }
  //   });

  //   return data
  // })

  // useEffect(() => {
  //   // Mutation
  //   const responses = mutateCreateDonation()
  //   console.log('responses', responses)
  // }, [])

  // useEffect(() => {
  //   // Query
  //   console.log('Graphql eventPage', data, isLoading, isError)

  //   // Mutation
  //   console.log('Graphql createDonationData', createDonationData)
  // }, [data, createDonationData, isLoading, isError])

  // if (isLoading) return <>Loading...</>;
  // if (isError) return <>Error!</>;

  return (
    <div>
      Hello! Events Page <br />

      {/* {JSON.stringify(data)} */}
    </div>
  )
}

export default EventsPage;
