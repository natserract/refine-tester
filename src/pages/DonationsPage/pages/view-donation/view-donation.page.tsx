import { useShow, Show, Typography } from "@pankod/refine";
import { useEffect } from "react";

const { Title, Text } = Typography;

const ViewDonation = () => {
  const { queryResult } = useShow({
    metaData: {
      fields: [
        'id',
        'user_id',
        'donation_for_type',
        'donation_for_id',
        'amount',
        'created_by',
        'updated_by',
        'tenant_id',
      ]
    },
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  useEffect(() => {
    console.log('data', data)
  }, [data])

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Id</Title>
      <Text>{record?.id}</Text>

      <Title level={5}>Donation for type</Title>
      <Text>{record?.donation_for_type}</Text>

      <Title level={5}>Amount</Title>
      <Text>{record?.amount}</Text>
    </Show>
  )
}

export default ViewDonation
