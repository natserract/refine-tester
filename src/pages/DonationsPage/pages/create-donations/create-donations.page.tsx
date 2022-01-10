import React, { useState } from "react";
import {
  Create,
  Form,
  Input,
  Select,
  useForm,
} from "@pankod/refine";
import { useHistory } from 'react-router-dom'

const CreateDonations = () => {
  const history = useHistory()

  const { formProps, saveButtonProps } = useForm({
    resource: 'createDonation',
    metaData: {
      fields: [
        'id',
      ]
    },
    mutationMode: "pessimistic",
    redirect: false,
    onMutationSuccess: () => {
      history.push('/donations');
    }
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="User id"
          name="user_id"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={1532}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="Donation for type"
          name="donation_for_type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            options={[
              {
                label: "Programs",
                value: "programs",
              },
              {
                label: "Events",
                value: "events",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          getValueFromEvent={(event) => +event?.target?.value}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Donation for id"
          name="donation_for_id"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={25}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="Donation created by"
          name="created_by"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={1532}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="Donation updated by"
          name="updated_by"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={1532}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="Tenant id"
          name="tenant_id"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={35}
        >
          <Input readOnly />
        </Form.Item>
      </Form>
    </Create>
  )
}

export default CreateDonations
