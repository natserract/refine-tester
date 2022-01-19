import {
  CrudFilters,
  useCreate,
  useCreateMany,
  useDelete,
  useDeleteMany,
  useUpdate,
  useList,
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
  Checkbox,
  RefreshButton,
  useCan
} from "@pankod/refine";
import { BaseRecord } from "@pankod/refine/dist/interfaces";
import { ColumnProps, ColumnsType, ColumnType } from "antd/lib/table";
import useRefresh from "hooks/useRefresh";
import { createContext, useEffect, useMemo, useRef, useState } from "react"
import { useHistory } from 'react-router-dom'

const { RangePicker } = DatePicker;

// @see https://www.npmjs.com/package/gql-query-builder
// @see https://github.com/pankod/refine/blob/master/packages/graphql/src/index.ts

const searchConfig = {
  searchAmount: 'amount',
  donationType: 'donation_for_type',
}

const EditableContext = createContext(null);

const EditableRow = ({ index, ...props }: any) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form as any}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

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

type SelectedItem = {
  selectedItem: 'bulk_actions' | 'edit' | 'trash'
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
    queryResult,
    tableQueryResult,
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
    },
  })


  const history = useHistory()
  const refreshSilent = useRefresh(history, '/donations');


  useEffect(() => {
    // console.log('form', formProps.onF form.getFieldValue('checked_item'))
  }, [formProps])

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    [],
  );

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onBulkActionSubmitted = (value: SelectedItem) => {
    const isHasItems = selectedRowKeys && selectedRowKeys.length

    if (isHasItems) {
      switch (value.selectedItem) {
        case 'trash': {
          deleteManyDonation({
            resource: 'donation',
            ids: [String(selectedRowKeys)],
            metaData: {
              fields: [
                'id'
              ]
            },
            mutationMode: "optimistic",
          })

          // This is for temporary solution for
          // Refreshing data without reload,
          // Because before, i try to use (queryResult & tableQueryResult).refetch() not work
          // Solutions: (Nope!)
          // refreshSilent()
          // queryResult?.refetch()
          // tableQueryResult.refetch()
          // 
          window.location.reload();

          console.log('Submitted values', value, selectedRowKeys, tableQueryResult.isRefetching)
          break;
        }
        default:
          break;
      }
    }
  }

  const [stateSource, setStateSource] = useState<any>([]);
  const ref = useRef(null);

  const handleAdd = () => {
    const dataSource = tableProps.dataSource as any;

    // Not pure

    // tableProps.dataSource = [] as any

    console.log('tableQueryResult.data!!.data', tableQueryResult.data!!.data)
    console.log('tableProps', tableProps)
    setStateSource([
      {
        "id": "1029",
        "donation_for_type": " ",
        "amount": 50,
        "user": {
          "id": 515,
          "name": ""
        },
        "isInlineAdd": true,
      },
      ...dataSource as any,
    ]);

    setEditId && setEditId("1029");
    console.log('dataSource', dataSource)

    // tableQueryResult.data!!.data[0] = {
    //   "id": 192 as any,
    //   "donation_for_type": "events",
    //   "amount": 50,
    //   "user": {
    //     "id": 515,
    //     "name": "Testing"
    //   }
    // }

    // tableQueryResult.data!!.data = [{
    //   "id": '192',
    //   "donation_for_type": "events",
    //   "amount": 50,
    //   "user": {
    //     "id": 515,
    //     "name": "Testing"
    //   }
    // }]

    // console.log('tableProps', tableProps)
  }

  const mergedColumns = tableProps?.columns?.map((col) => {
    console.log('KEYS', col.key)
    // if (!col.) {
    //   return col;
    // }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.key === "age" ? "number" : "text",
        dataIndex: col.key,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  useEffect(() => {
    setStateSource(tableProps.dataSource as any)
  }, [tableProps.dataSource])

  useEffect(() => {
    console.log('stateSource', stateSource, tableProps)
  }, [stateSource, tableProps?.columns])

  const tableColumns = useMemo(() => {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter,
        defaultSortOrder: getDefaultSortOrder("id", sorter)
      },
      {
        title: "Donation for types",
        dataIndex: "donation_for_type",
        key: "donation_for_type",
        sorter: {
          multiple: 2
        },
        defaultSortOrder: getDefaultSortOrder("donation_for_type", sorter),
        filterDropdown: (props: FilterDropdownProps) => (
          <FilterDropdown {...props}>
            <Input />
          </FilterDropdown>
        ),
        render: (value: any, record: any) => {
          console.log('recorded', isEditing(record?.id))

          if (isEditing(record?.id)) {
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
        }
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        sorter: {
          multiple: 1
        },
        defaultSortOrder: getDefaultSortOrder("amount", sorter),
        render: (value: any, record: any) => {
          console.log('value render', value, record, isEditing(record?.id))

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
        }
      },
      {
        dataIndex: ["user", "name"],
        title: 'Name',
        sorter: {
          multiple: 1
        },
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        dataIndex: "actions",
        title: "Actions",
        render: (_: any, record: any) => {
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
        }
      }
    ]

    return columns;
  }, [])

  const handleChange = () => {
    console.log('stateSource change')
  }

  return (
    <Row gutter={[16, 16]}>
      <Col lg={6} xs={24}>
        <Card title="Filters">
          <Filter formProps={searchFormProps} />
        </Card>
      </Col>
      <Col lg={18} xs={24}>
        <List
          pageHeaderProps={{
            subTitle: (
              <>
                <Form onFinish={onBulkActionSubmitted} layout="inline">
                  <Form.Item name="selectedItem" initialValue="bulk_actions">
                    <Select
                      options={[
                        {
                          label: "Bulk Actions",
                          value: "bulk_actions",
                        },
                        {
                          label: "Edit",
                          value: "edit",
                        },
                        {
                          label: "Move to trash",
                          value: "trash",
                        }
                      ]}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Apply
                    </Button>
                  </Form.Item>
                </Form>

                <Button onClick={handleAdd}>
                  Add New Data
                </Button>
              </>
            ),
          }}
        >
          <Form {...formProps}>
            <Table
              {...tableProps}
              dataSource={stateSource}
              rowKey="id"
              rowSelection={rowSelection}
              pagination={{
                ...tableProps.pagination,
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['Hello'],
                showLessItems: true,
                responsive: true,
              }}
              onChange={handleChange}
              onRow={(record: any) => ({
                onClick: (event: any) => {
                  if (event.target.nodeName === "TD") {
                    console.log('Edit', event, record)
                    setEditId && setEditId(record.id);
                  }
                },
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
                  console.log('record saved', value, record)

                  if (isEditing(record?.id)) {
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
                render={(value: any, record: any) => {
                  // TODO: Handle click if isInlineAdd
                  const renderInlineAddBtn = () => {
                    const handleCancel = () => {
                      const key = "1029";
                      setStateSource(stateSource.filter((item: any) => item.id !== key))
                    }

                    // TODO: How to get values
                    // And save a mutation
                    const handleSave = (event: any) => {
                      // console.log('record saved', value, event)
                    }

                    return (
                      <>
                        <SaveButton
                          {...saveButtonProps}
                          size="small"
                          onClick={handleSave}
                        />

                        <Button
                          {...cancelButtonProps}
                          size="small"
                          onClick={handleCancel}
                        >
                          Cancel
                      </Button>
                      </>
                    )
                  }

                  const renderDefaultBtn = () => {
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

                  const renderEditable = () => {
                    if (isEditing(record?.id)) {
                      return record.isInlineAdd ? renderInlineAddBtn() : renderDefaultBtn();
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
                      {!record?.isInlineAdd && (
                        <>
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
                        </>
                      )}
                      {renderEditable()}
                    </Space>
                  )
                }}
              />

            </Table>
          </Form>
        </List>
      </Col>
    </Row >
  )
}

export default JobsPage
