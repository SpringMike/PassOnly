import React, {useEffect, useState} from "react";
import {
    Button,
    Col,
    DatePicker,
    DatePickerProps,
    Divider,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table
} from "antd";
import SelectSupplier from "../../components/SelectSupplier";
import {IInventories, IMyTableData, IProductVariant} from "../../services/customType";
import {
    createImport,
    getCountTotalProductVariant,
    getCurrentQuantityInventory,
    getProductVariant
} from "../../services/api";
import {BackwardOutlined, DeleteOutlined, FastForwardOutlined, LeftOutlined} from '@ant-design/icons';
import {ColumnProps} from "antd/es/table";
import {default as NumberFormat} from "react-number-format";
import {getAllActiveInventory, getAllInventory} from "../../api/inventory";
import ToastCustom from "../../features/toast/Toast";
import {RangePickerProps} from "antd/es/date-picker";
import moment from "moment";
import {Link, useNavigate} from "react-router-dom";

// ImportInvoice * as CurrencyFormat from 'react-currency-format';



const CreateImport = () => {
    const {Option} = Select;
    const [supplierId, setSupplierId] = useState<number>();
    const [inventoryId, setInventoryId] = useState<number>(0);
    const [productVariants, setProductVariants] = useState<IProductVariant[]>([])
    const [listAllProductVariant, setListAllProductVariant] = useState<IProductVariant[]>([])
    const [totalPage, setTotalPage] = useState<number>(0)
    const [tableData, setTableData] = useState<IMyTableData[]>([]);

    const [pageNumber, setPageNumber] = useState(1);
    const [visible, setVisible] = useState(false);
    const [inventories, setInventories] = useState<IInventories[]>([])
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [date, setDate] = useState("0");
    const navigate = useNavigate();


    useEffect(() => {
        getCountTotalProductVariant().then(r => {
            setTotalPage(r.data)
        })
        getAllActiveInventory().then(r => {
            setInventories(r.data.reverse())
        })
        document.title = "T???o m???i ????n"
    }, [])



    useEffect(() => {
        getProductVariant(pageNumber).then((productVariant) => {
            setProductVariants(productVariant.data)
            const listData = productVariants.concat(productVariant.data)
            setListAllProductVariant(listData)
        })

    }, [pageNumber])


    useEffect(() => {
        let totalQuantity = 0;
        let totalPrice = 0;
        for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].quantity === 0) {
                totalQuantity = 1
                totalPrice += tableData[i].totalPrice
            } else {
                totalQuantity += tableData[i].quantity
                totalPrice += tableData[i].totalPrice
            }
        }
        setTotalPrice(totalPrice)
        setTotalQuantity(totalQuantity)
    }, [tableData])


    const handleAddToTable = (item: number) => {
        const productVariant = productVariants.find(p => p.id === item) as IProductVariant
        const newData: IMyTableData = {
            id: productVariant.id,
            code: productVariant.code,
            name: productVariant.name,
            quantity: 1,
            importPrice: parseInt(productVariant.importPrice),
            totalPrice: parseInt(productVariant.importPrice)
        };
        let findData = tableData.find(t => t.code === productVariant.code)

        if (findData === undefined) {
            setTableData([...tableData, newData]);
        } else {
            const newProjects = tableData.map(p => {
                    return p.code === productVariant.code
                        ? {...p, quantity: p.quantity + 1, totalPrice: (p.quantity + 1) * p.importPrice}
                        : p
                }
            );
            setTableData(newProjects)
        }
    }


    const onInputChange = (key: string, index: number, value: number) => {
        const newData = [...tableData];
        (newData as any)[index][key] = value
        setTotal(newData, index);
        setTableData(newData);
    };


    const setTotal = (data: IMyTableData[], index: number) => {
        // Set total
        data[index]["totalPrice"] = Number(
            data[index]["quantity"] as number * data[index]["importPrice"] as number
        );
    };

    const handelDelete = (code: string) => {
        const data = tableData.filter((t) => t.code !== code)
        setTableData(data)
    }
    const columnsModal: ColumnProps<IProductVariant>[] = [
        {
            title: 'M?? SKU',
            dataIndex: 'code',
            width: '15%'

        },
        {
            title: 'T??n s???n ph???m',
            dataIndex: 'name',
            width: '45%'
        },
        {
            title: 'S??? l?????ng',
            dataIndex: 'quantity',
            render: (text, record, index) => (
                <NumberFormat value={text} displayType='text' thousandSeparator={true}/>
            ),
            width: '20%'
        },
        {
            title: 'Gi??',
            dataIndex: 'importPrice',
            render: (text, record, index) => (
                <NumberFormat value={text} displayType='text' thousandSeparator={true}/>
            ),
            width: '20%'
        }
    ]
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };


    const columns: ColumnProps<IMyTableData>[] = [
        {
            title: 'M?? SKU',
            dataIndex: 'code',
            width: '15%'

        },
        {
            title: 'T??n s???n ph???m',
            dataIndex: 'name',
            width: '35%',

        },
        {
            title: 'S??? l?????ng',
            dataIndex: 'quantity',
            render: (text, record, index) => (
                <NumberFormat className='input-price' value={text} thousandSeparator={true} onValueChange={(values) => {
                    const {value} = values;
                    onInputChange("quantity", index, Number(value))
                }}/>
            ),
            width: '15%',
            align: 'right'
        },
        {
            title: 'Gi??',
            dataIndex: 'importPrice',
            render: (text, record, index) => (
                <NumberFormat className='input-price' value={text} thousandSeparator={true} onValueChange={(values) => {
                    const {value} = values;
                    onInputChange("importPrice", index, Number(value))
                }}/>
            ),
            width: '15%',
            align: 'right'
        },
        {
            title: 'Th??nh ti???n',
            dataIndex: "totalPrice",
            render: (text) =>
                (
                    <div style={{textAlign: 'right'}}>
                        <NumberFormat value={text} thousandSeparator={true} displayType='text'/>
                    </div>
                ),
            width: '20%',
            align: 'right'
        },
        {
            dataIndex: 'code',
            render: (data: string) =>
                <Popconfirm title="B???n c?? mu???n xo???" onConfirm={() => handelDelete(data)}>
                    <a style={{fontSize: '16px'}}><DeleteOutlined/></a>
                </Popconfirm>
        },
    ];


    const handleSubmit = () => {
        let listData = [...tableData]
        for (let i = 0; i < selectedRowKeys.length; i++) {
            const productVariant = listAllProductVariant.find(p => p.code === selectedRowKeys[i]) as IProductVariant
            const newData: IMyTableData = {
                id: productVariant.id,
                code: productVariant.code,
                name: productVariant.name,
                quantity: 1,
                importPrice: parseInt(productVariant.importPrice),
                totalPrice: parseInt(productVariant.importPrice)
            };
            let findData = tableData.find(t => t.code === productVariant.code)

            if (findData === undefined) {
                listData = [...listData, newData]
                setTableData(listData);
            } else {
                listData = listData.map(p => {
                        return p.code === findData?.code
                            ? {...p, quantity: p.quantity + 1, totalPrice: (p.quantity + 1) * p.importPrice}
                            : p
                    }
                )
                setTableData(listData)
            }

        }
        setVisible(false)
        setPageNumber(1)
        setSelectedRowKeys([])
    }

    const onCancel = () => {
        setVisible(false)
        setPageNumber(1)
        setSelectedRowKeys([])
    }


    const onSelectKey = (code: string) => {
        const keyExit = selectedRowKeys.find((result) => {
            return result === code
        })
        if (keyExit === undefined) {
            const listData = [...selectedRowKeys, code]
            setSelectedRowKeys(listData)
        } else {
            setSelectedRowKeys(selectedRowKeys.filter((r) => {
                return r !== code
            }))
        }
    }


    const onCreateOrder = () => {
        const list = [];
        if (tableData.length === 0) {
            ToastCustom.fire({
                icon: 'error',
                title: 'Ch??a ch???n s???n ph???m n??o'
            }).then()
        } else {
            for (let i = 0; i < tableData.length; i++) {
                list.push({
                    product_variant_id: tableData[i].id,
                    quantity: tableData[i].quantity,
                    totalPrice: tableData[i].totalPrice,
                    importPrice: tableData[i].importPrice
                })
            }
            const anImport = {
                accountId: 1,
                supplierId: supplierId,
                totalPrice: totalPrice,
                note: "",
                inventoryId: inventoryId,
                detailsImports: list,
                deliveryDate: date
            }

            createImport(anImport).then(() => {
                ToastCustom.fire({
                    icon: 'success',
                    title: 'Th??m phi???u nh???p th??nh c??ng'
                }).then()
                navigate("/purchase_orders", {replace: true})
            })
        }

    }

    const onSelectInventory = (value: number) => {
        setInventoryId(value)
    }

    const onChangeDate = (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
    ) => {
        setDate(dateString.toString())
    };


    return (
        <div className='p-5'>
            <h2 style={{ fontSize:'15px' }} >
                <Link to="/purchase_orders">
                    <LeftOutlined /> Danh s??ch ????n h??ng
                </Link>
            </h2>
            <h1 style={{fontSize:'30px',margin:0,marginRight:10,marginBottom:'45px'}}>T???o ????n nh???p h??ng</h1>
            <Form layout="vertical">
                <Row gutter={24}>
                    <Col span={16}>
                        <div className="block">
                            <SelectSupplier changeSupplierId={setSupplierId}/>
                        </div>

                        <div className="block">
                            <p><b>Ch???n s???n ph???m</b></p>
                            <Row>
                                <Col span={20}>
                                    <Select style={{width: '100%', marginBottom: 10, borderRadius: 5}}
                                            size={'large'}
                                            value={null}
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => {
                                                return (
                                                    option?.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                                    option?.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                );

                                            }}
                                            onChange={handleAddToTable}
                                            placeholder="T??m ki???m s???n ph???m theo t??n"
                                            dropdownRender={menu => (
                                                <>
                                                    {menu}
                                                    <Divider style={{margin: '8px 0'}}/>

                                                    <Space style={{padding: '0 8px 4px'}}>
                                                        <Button disabled={pageNumber <= 1}
                                                                onClick={() => setPageNumber(cur => cur - 1)}
                                                                type="primary"
                                                                icon={<BackwardOutlined/>}>
                                                            Back
                                                        </Button>
                                                        <Button disabled={pageNumber >= totalPage}
                                                                onClick={() => setPageNumber(cur => cur + 1)}
                                                                type="primary"
                                                                icon={<FastForwardOutlined/>}>
                                                            Next
                                                        </Button>
                                                    </Space>
                                                </>
                                            )}
                                    >
                                        {
                                            productVariants && productVariants.map((productVariant, index) => {
                                                return (
                                                    <Option id={index} title={productVariant.name} value={productVariant.id} key={productVariant.name}>
                                                        <div style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            fontSize: '12px',
                                                            padding: '10px'
                                                        }}>
                                                            <div>
                                                                {productVariant.code} <br/> {productVariant.name}
                                                            </div>
                                                            <div  style={{width:'70px'}}>
                                                                <NumberFormat value={productVariant.importPrice}
                                                                              displayType={'text'}
                                                                              thousandSeparator={true}
                                                                              suffix={' ??'}/>
                                                                <br/> S??? l?????ng: <b> {productVariant.quantity}</b>
                                                            </div>
                                                        </div>
                                                    </Option>
                                                )
                                            })
                                        }
                                    </Select>

                                </Col>
                                <Col span={4} style={{display:'flex',alignItems:'center'}}>
                                    <Button style={{marginBottom:'10px'}} onClick={() => setVisible(true)} type='text'>Ch???n nhi???u</Button>
                                </Col>
                                {
                                    visible && (
                                        <Modal
                                            title="Ch???n nhi???u s???n ph???m"
                                            centered
                                            visible={visible}
                                            onOk={() => setVisible(false)}
                                            onCancel={onCancel} width={1000}
                                            footer={[
                                                <div key={999}>
                                                    <Button onClick={onCancel}>
                                                        Hu???
                                                    </Button>
                                                    <Button type='primary' onClick={handleSubmit}>
                                                        Nh???p ????n
                                                    </Button>
                                                </div>
                                            ]}
                                        >
                                            <Input placeholder="T??m ki???m s???n ph???m theo t??n" />
                                            <br/>
                                            <Table
                                                rowKey="code"
                                                columns={columnsModal}
                                                dataSource={productVariants}
                                                pagination={false}
                                                onRow={record => ({
                                                    onClick: () => {
                                                        onSelectKey(record.code)
                                                    }
                                                })}
                                                rowSelection={rowSelection}
                                            />

                                            <div style={{marginTop: '20px'}}>
                                                <Button style={{margin: 0, marginRight: '15px'}}
                                                        disabled={pageNumber <= 1}
                                                        onClick={() => setPageNumber(cur => cur - 1)} type="primary"
                                                        icon={<BackwardOutlined/>}>
                                                    Back
                                                </Button>
                                                <Button style={{margin: 0}} disabled={pageNumber >= totalPage}
                                                        onClick={() => setPageNumber(cur => cur + 1)} type="primary"
                                                        icon={<FastForwardOutlined/>}>
                                                    Next
                                                </Button>
                                            </div>
                                        </Modal>
                                    )
                                }
                            </Row>

                            <div style={{border: "1px solid #d9d9d9"}}>
                                {
                                    tableData.length > 0 ? <Table
                                        rowKey="code"
                                        columns={columns}
                                        dataSource={tableData}
                                        pagination={false}
                                    /> : <div style={{
                                        padding: '5px',
                                        justifyContent: 'center',
                                        'display': 'flex',
                                        textAlign: 'center'
                                    }}>
                                        <div>
                                            <img style={{width: '150px', marginBottom: '10px'}}
                                                 src="https://minhhihi-test.mysapogo.com/v2/images/no-product.svg"
                                                 alt=""/>
                                            <p>????n nh???p c???a b???n ch??a c?? s???n ph???m n??o</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className='block'>
                            <p><b>Th??ng tin ????n nh???p h??ng</b></p>
                            <Form.Item label="M?? ????n nh???p h??ng" name="code">
                                <Input/>
                            </Form.Item>
                            <Form.Item label="Chi nh??nh" name="inventory" rules={[{required: true}]}>
                                <Select
                                    showSearch
                                    placeholder="Ch???n chi nh??nh"
                                    optionFilterProp="children"
                                    onChange={onSelectInventory}
                                >
                                    {
                                        inventories && inventories.map((inventor, key) => {
                                            return <Option key={inventor.id} style={{width: 350}}
                                                           value={inventor.id}> {inventor.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="Ng??y h???n giao" name="date">
                                <DatePicker format="DD-MM-YYYY HH:mm"
                                            showTime={{format: 'HH:mm'}}
                                            style={{width: '100%'}}
                                            onChange={onChangeDate}
                                />
                            </Form.Item>

                        </div>
                        <div className='block'>
                            <p>S??? l?????ng: {totalQuantity}</p>
                            <p>T???ng ti???n:
                                <span style={{marginLeft:5}}><NumberFormat value={totalPrice} displayType={'text'} thousandSeparator={true}
                                                    suffix={' ??'}/></span>
                            </p>
                            <Button  htmlType="submit" onClick={onCreateOrder}>?????t h??ng</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
export default CreateImport