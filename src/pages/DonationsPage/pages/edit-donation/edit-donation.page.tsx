import React, { useEffect, useRef, useState } from "react";
import {
  Edit,
  Form,
  Input,
  Select,
  useForm,
} from "@pankod/refine";
import { useHistory } from 'react-router-dom'

const EditDonation = () => {
  const history = useHistory()

  const { formProps, saveButtonProps, queryResult } = useForm({
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
    mutationMode: "pessimistic",
    redirect: false,
    onMutationSuccess: () => {
      history.push('/donations');
    }
  });

  const currentData = queryResult?.data?.data;

  useEffect(() => {
    console.log('currentData', currentData)
  }, [currentData])

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="User id"
          name="user_id"
          rules={[
            {
              required: true,
            },
          ]}
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
        >
          <Input readOnly />
        </Form.Item>
      </Form>
    </Edit>
  )
}

export default EditDonation
