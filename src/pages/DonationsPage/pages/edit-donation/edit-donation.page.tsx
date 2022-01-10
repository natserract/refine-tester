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

  // Use form, in edit, do fetch from resource first
  // But the problems here's, updateDonation its not a query that's a mutation for update
  // For get donation, use `donation(id:..)`. So bad.
  const resourceRef = useRef('donation');
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: resourceRef.current,
    action: "edit",
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
    setTimeout(() => {
      // It's so tricky. :(
      resourceRef.current = 'updateDonation';
    }, 100)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      console.log('resourceRef', resourceRef.current)
    }, 200)
  }, [])

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
