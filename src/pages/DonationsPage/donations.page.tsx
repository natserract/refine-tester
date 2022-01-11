import {
  CrudFilters,
  useCreate,
  useCreateMany,
  useDelete,
  useDeleteMany,
  useList,
  useMany,
  useOne,
  useTable,
  useUpdate
} from "@pankod/refine"
import {
  List,
  Table,
  Space,
  TextField,
  EditButton,
  ShowButton,
  Radio,
  FilterDropdown,
  getDefaultFilter,
  TagField,
  IResourceComponentsProps,
  getDefaultSortOrder,
  FilterDropdownProps,
  useSelect,
  DeleteButton,
  Select,
  Row,
  Card,
  Col,
  Input,
  FormProps,
  Icons,
  Form,
  Button,
  DatePicker,
  useEditableTable,
  SaveButton,
} from "@pankod/refine";
import { useEffect, useRef } from "react"

const { RangePicker } = DatePicker;

// @see https://www.npmjs.com/package/gql-query-builder
// @see https://github.com/pankod/refine/blob/master/packages/graphql/src/index.ts

const searchConfig = {
  searchAmount: 'amount',
  donationType: 'donation_for_type',
}

const Filter: React.FC<{ formProps: FormProps }> = ({ formProps }) => {
  return (
    <Form layout="vertical" {...formProps}>
      <Form.Item label="Search" name={searchConfig.searchAmount}>
        <Input
          placeholder="Search amount"
          prefix={<Icons.SearchOutlined />}
        />
      </Form.Item>
      <Form.Item label="Donation types" name={searchConfig.donationType}>
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
          allowClear
          placeholder="Search Donation Type"
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Filter
        </Button>
      </Form.Item>
    </Form>
  );
};

interface IEvent {
  events: {
    id: string;
    title: string;
  }[]
}

const JobsPage = () => {
  // Query: getList -> Donation
  // const responsesDonationList = useList({
  //   resource: 'donations',
  //   metaData: {
  //     fields: [
  //       'id',
  //       'created_at'
  //     ]
  //   },
  //   config: {
  //     filters: [
  //       {
  //         field: "amount",
  //         operator: "nin",
  //         value: [303],
  //       }
  //     ],
  //     // sort: [
  //     //   { order: "asc", field: "title" },
  //     //   { order: "asc", field: "description" }
  //     // ],
  //     //   pagination: {
  //     //     current: 1,
  //     //     pageSize: 5,
  //     //   }
  //   }
  // });
  // useEffect(() => {
  //   console.log('responsesDonationList', responsesDonationList)
  // }, [responsesDonationList])

  // Query: getMany -> Donation
  // const responseEventMany = useMany({
  //   resource: 'eventMany',
  //   ids: [],
  //   metaData: {
  //     fields: [
  //       {
  //         events: [
  //           'id',
  //           'title',
  //         ]
  //       },
  //     ]
  //   }
  // })

  // Query: getOne -> Donation
  // const responseOneDonation = useOne({
  //   resource: 'donation',
  //   id: "20",
  //   metaData: {
  //     fields: [
  //       'id',
  //       'created_at'
  //     ]
  //   }
  // })
  // useEffect(() => {
  //   console.log('responseOneDonation', responseOneDonation)
  // }, [responseOneDonation])

  // Mutations
  const { mutate } = useCreate()
  const { mutate: createDonationsMany } = useCreateMany();
  const { mutate: updateDonation } = useUpdate()
  const { mutate: deleteDonation } = useDelete();
  const { mutate: deleteManyDonation } = useDeleteMany();

  // Mutation create Donation
  // useEffect(() => {
  //   mutate({
  //     resource: "createDonation",
  //     values: {
  //       user_id: 1532,
  //       donation_for_type: "events",
  //       donation_for_id: 25,
  //       created_by: 1532,
  //       updated_by: 1532,
  //       tenant_id: 35
  //     },
  //     metaData: {
  //       fields: [
  //         'id',
  //       ]
  //     }
  //   })
  // }, [])

  // Mutation create many Donation
  // useEffect(() => {
  //   mutateMany({
  //     resource: 'createDonation',
  //     values: [
  //       {
  //         user_id: 1532,
  //         donation_for_type: "events",
  //         donation_for_id: 25,
  //         created_by: 1532,
  //         updated_by: 1532,
  //         tenant_id: 35
  //       },
  //       {
  //         user_id: 1532,
  //         donation_for_type: "events",
  //         donation_for_id: 35,
  //         created_by: 1532,
  //         updated_by: 1532,
  //         tenant_id: 35
  //       }
  //     ],
  //     metaData: {
  //       fields: [
  //         'id'
  //       ]
  //     }
  //   })
  // }, [])

  // Mutation updateDonation
  // useEffect(() => {
  //   updateDonation({
  //     resource: 'updateDonation',
  //     values: {
  //       donation_for_type: "events"
  //     },
  //     id: "1108",
  //     metaData: {
  //       fields: [
  //         'id'
  //       ]
  //     }
  //   })
  // }, [])

  // Delete one donation
  // useEffect(() => {
  //   deleteDonation({
  //     resource: 'deleteDonation',
  //     id: "1108",
  //     metaData: {
  //       fields: [
  //         'id'
  //       ]
  //     }
  //   })
  // }, [])

  // Delete many donation
  // useEffect(() => {
  //   deleteManyDonation({
  //     resource: 'deleteDonation',
  //     ids: ["1107", "1106"],
  //     metaData: {
  //       fields: [
  //         'id'
  //       ]
  //     }
  //   })
  // }, [])

  const {
    tableProps,
    formProps,
    sorter,
    searchFormProps,
    isEditing,
    saveButtonProps,
    cancelButtonProps,
    editButtonProps,
    setEditId,
  } = useEditableTable({
    resource: 'donations',
    metaData: {
      fields: [
        'id',
        'donation_for_type',
        'amount',
        {
          user: [
            'id',
            'name'
          ]
        }
      ]
    },
    onSearch: (params: Record<string, any>) => {
      let filters: CrudFilters = [];
      const { amount, donation_for_type, status, createdAt } = params;

      console.log('donation_for_type', donation_for_type)

      filters.push(
        {
          field: searchConfig.searchAmount,
          operator: "in",
          value: +amount,
        },
        {
          field: searchConfig.donationType,
          operator: "eq",
          value: donation_for_type
        }
      )

      return filters
    }
  })

  // const { data, isFetching } = useMany({
  //   resource: '',
  // });

  useEffect(() => {
    console.log('tableProps', tableProps)
  }, [tableProps])

  return (
    <Row gutter={[16, 16]}>
      <Col lg={6} xs={24}>
        <Card title="Filters">
          <Filter formProps={searchFormProps} />
        </Card>
      </Col>
      <Col lg={18} xs={24}>
        <List>
          <Form {...formProps}>
            <Table
              {...tableProps}
              rowKey="id"
              pagination={{
                ...tableProps.pagination,
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['Hello'],
                showLessItems: true,
                responsive: true,
              }}
              onRow={(record: any) => ({
                onClick: (event: any) => {
                  if (event.target.nodeName === "TD") {
                    setEditId && setEditId(record.id);
                  }
                }
              })}
            >
              <Table.Column
                dataIndex="id"
                title="ID"
                sorter
                defaultSortOrder={getDefaultSortOrder("id", sorter)}
              />
              <Table.Column
                dataIndex="donation_for_type"
                title="Donation for types"
                sorter={{ multiple: 2 }}
                defaultSortOrder={getDefaultSortOrder("donation_for_type", sorter)}
                filterDropdown={(props: FilterDropdownProps) => (
                  <FilterDropdown {...props}>
                    <Input />
                  </FilterDropdown>
                )}
                render={(value, record: any) => {
                  if (isEditing(record?.id)) {
                    console.log('select value', value)
                    return (
                      <Form.Item
                        name="donation_for_type"
                        style={{ margin: 0 }}
                      >
                        <Select
                          defaultValue={value}
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
                    );
                  }
                  return <TextField value={value} />;
                }}
              />
              <Table.Column
                dataIndex="amount"
                title="Amount"
                sorter={{ multiple: 1 }}
                defaultSortOrder={getDefaultSortOrder("amount", sorter)}
                render={(value, record: any) => {
                  if (isEditing(record?.id)) {
                    return (
                      <Form.Item
                        name="amount"
                        style={{ margin: 0 }}
                        getValueFromEvent={(event) => +event?.target?.value}
                      >
                        <Input defaultValue={value} />
                      </Form.Item>
                    );
                  }
                  return <TextField value={value} />;
                }}
              />
              <Table.Column
                dataIndex={["user", "name"]}
                title="Name"
                sorter={{ multiple: 1 }}
                defaultSortOrder={getDefaultSortOrder("name", sorter)}
              />
              <Table.Column
                dataIndex="actions"
                title="Actions"
                render={(_, record: any) => {
                  const renderEditable = () => {
                    if (isEditing(record?.id)) {
                      return (
                        <>
                          <SaveButton
                            {...saveButtonProps}
                            size="small"
                          />
                          <Button
                            {...cancelButtonProps}
                            size="small"
                          >
                            Cancel
                        </Button>
                        </>
                      )
                    }

                    return (
                      <>
                        <EditButton
                          {...editButtonProps(record.id)}
                          size="small"
                        />
                      </>
                    )
                  }

                  return (
                    <Space>
                      <EditButton
                        hideText
                        size="small"
                        recordItemId={record.id}
                      />
                      <ShowButton
                        hideText
                        size="small"
                        recordItemId={record.id}
                      />
                      <DeleteButton
                        hideText
                        mutationMode="optimistic"
                        metaData={{
                          fields: [
                            'id'
                          ]
                        }}
                        size="small"
                        recordItemId={record.id}
                      />
                      {renderEditable()}
                    </Space>
                  )
                }}
              />
            </Table>
          </Form>
        </List>
      </Col>
    </Row>
  )
}

export default JobsPage
