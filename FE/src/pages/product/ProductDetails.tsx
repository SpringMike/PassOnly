import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, memo } from "react";
import { ISupplier } from "../../services/customType";
import { Button, Col, Dropdown, Menu, MenuProps, Row, Space } from "antd";
import Moment from "react-moment";
import { DeleteOutlined, DownOutlined, InfoCircleOutlined, LeftOutlined } from "@ant-design/icons";
import * as Mui from '@mui/material'
import * as Antd from 'antd'
import { deleteProductById, deleteVariantsById, getProductById } from "../../services/productServices";
import { Category, IVariant, Product } from "../../type/allType";
import { has } from "immer/dist/internal";
import Swal from "sweetalert2";
import ToastCustom from "../../features/toast/Toast";
import AddProduct from "./AddProduct";
import UpdateProduct from './UpdateProduct'
import { fontWeight } from "@mui/system";
export interface ProductInfo {
    product: Product,
    variants: IVariant[],
    categories: Category[],

}

const ProductDetails = () => {

    const { id } = useParams();
    const [focusVariant, setFocusVariant] = useState<IVariant>()
    // const [product, setProduct] = useState<Product>()
    // const [variants, setVariants] = useState<IVariant[]>()

    // const [categories, setCategories] = useState<Category[]>([])
    const [isUpdate, setIsUpdate] = useState(false)
    const [productInfo, setProductInfo] = useState<ProductInfo>()
    const [page, setPage] = useState(1)
    const [openDes, setOpenDes] = useState(false)
    const openDescription = () => {
        setOpenDes(true)
    }
    const setActionUpdate = (status: boolean) => {
        setIsUpdate(status)
    }
    const navigate = useNavigate()
    const loadData = () => {
        getProductById(Number(id)).then(response => {
            return response.json()
        }).then(data => {
            // setProduct(data.product)
            // setVariants(data.variants)
            // setFocusVariant(data.variants[0])
            setProductInfo(data)
            setFocusVariant(data.variants[0])

        })
            .catch(error => {
                console.log(error);

            })
    }

    const handleDeleteProduct = (id: number | undefined) => {
        Swal.fire({
            title: 'B???n c?? ch???c?',
            text: "B???n kh??ng th??? h???i ph???c l???i d??? li???u!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete!'
        }).then((result) => {
            if (result.isConfirmed && id) {
                deleteProductById(id)
                    .then(res => {
                        if (res.ok) {
                            ToastCustom.fire({
                                icon: 'success',
                                title: 'X??a th??nh c??ng'
                            })
                            navigate('/products')
                        }
                    })
                    .catch(error => {
                        ToastCustom.fire(
                            {
                                icon: 'error',
                                title: 'X??a Th???t b???i'

                            }
                        )

                    })
            }

        })

    }
    useEffect(() => {

        loadData()
        document.title = 'Chi ti???t s???n ph???m'
    }, [])
    useEffect(() => {
        if (!isUpdate) loadData()

    }, [isUpdate])


    const handleMenuClick: MenuProps['onClick'] = (e: any) => {
        switch (e.key) {
            case '1':
                handleDeleteProduct(productInfo?.product?.id)
                break
            case '2':
                setIsUpdate(true)
                break
        }
    };
    const menu = (
        <Menu
            onClick={handleMenuClick}
            items={[
                {
                    key: '1',
                    label: <Antd.Button style={{ width: '100%' }} type="text" danger>X??a S???n ph???m<DeleteOutlined /></Antd.Button>,

                },
                {
                    label: <Antd.Button style={{ width: '100%' }} type="text" >S???a s???n ph???m<InfoCircleOutlined /></Antd.Button>,
                    key: '2',


                },
            ]}
        />
    );

    const Product = () => {
        var product = productInfo?.product
        return (
            <Mui.Paper style={{ height: 350 }}>
                <div style={{ background: "white" }}>
                    <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', paddingBottom: 0 }}>
                        <div>
                            Th??ng tin s???n ph???m
                        </div>
                        <div>
                            <Dropdown overlay={menu} >
                                <div style={{ width: "190px", fontSize: '14px', textAlign: 'center' }}>
                                    <Space>
                                        Thao t??c kh??c
                                        <DownOutlined />
                                    </Space>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                    <hr />
                    <div style={{ padding: '20px' }}>
                        <Row>
                            <Col span={12}>
                                <Row>
                                    <Col span={8}>
                                        <p>T??n s???n ph???m: </p>
                                    </Col>
                                    <Col span={12}>
                                        <b >{product?.name}</b>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p>M?? s???n ph???m: </p>
                                    </Col>
                                    <Col span={12}>
                                        <Antd.Tag color='orange'>{product?.code}</Antd.Tag>
                                    </Col>
                                </Row>

                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={8}>
                                        <p>Ng??y t???o: </p>
                                    </Col>
                                    <Col span={12}>
                                        <Moment format="DD/MM/YYYY HH:mm:ss">
                                            {product?.createAt}
                                        </Moment>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <p>Ng??y c???p nh???t: </p>
                                    </Col>
                                    <Col span={12}>
                                        <Moment format="DD/MM/YYYY HH:mm:ss">
                                            {product?.createAt}
                                        </Moment>



                                    </Col>
                                </Row>

                            </Col>

                        </Row>

                        <p style={{ marginTop: 20 }}>M?? t???:</p>
                        <p style={{ height: 113, overflow: "hidden", maxHeight: 113, textOverflow: 'ellipsis', marginBottom: 0 }}>{product?.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'right', fontStyle: 'italic', margin: 0, padding: 0 }} onClick={openDescription}>Xem th??m&gt;&gt;</div>
                    </div>

                </div>
            </Mui.Paper>

        )
    }
    const Variants = memo((props: any) => {
        const variantCol = [
            {
                title: 'M?? SP',
                dataIndex: 'code',
                key: 'code',
                width: '15%',
                render: (code: string) => {
                    return (<Antd.Tag color='orange'> {code}</Antd.Tag>)
                }
            },
            {
                title: 'T??n s???n ph???m',
                dataIndex: 'name',
                key: 'name',


            },
            //  {
            //     title: 'T???n kho',
            //     dataIndex: 'code',
            //     key: 'code',
            //     width: '15%',



            // }, {
            //     title: 'T???ng',
            //     dataIndex: 'code',
            //     key: 'code',
            //     width: '15%',


            // }
        ]
        const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
        const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        };
        const rowSelection = {
            selectedRowKeys,
            onChange: onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const handleOnDeleteVariants = () => {
            Swal.fire({
                title: 'B???n c?? ch???c?',
                text: "B???n kh??ng th??? h???i ph???c l???i d??? li???u!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Delete!'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log(selectedRowKeys)
                    deleteVariantsById(selectedRowKeys).then((response: any) => {
                        if (response.ok) {
                            ToastCustom.fire({
                                icon: 'success',
                                title: 'X??a phi??n b???n th??nh c??ng'
                            }).then()
                            loadData()
                        }
                    }
                    )
                        .catch((error: any) => {
                            ToastCustom.fire({
                                icon: 'error',
                                title: 'C?? l???i x???y ra'
                            }).then()
                        })
                }

            })


        }

        return (
            <div >
                <div style={{ background: "white", padding: 20 }}>
                    <div >
                        <Antd.Row style={{}}>
                            <Antd.Col span={8} style={{ padding: 0, margin: 0 }}>
                                <div style={{ height: '100%', paddingTop: 5 }} >C??c phi??n b???n: </div>
                            </Antd.Col>
                            <Antd.Col span={8}>
                                {hasSelected ? <span>??ang ch???n {selectedRowKeys.length} phi??n b???n</span> : null}

                            </Antd.Col>
                            <Antd.Col span={8} style={{ display: 'flex', justifyContent: 'right' }}>
                                <Antd.Button disabled={!hasSelected} icon={<DeleteOutlined />} danger onClick={handleOnDeleteVariants} >X??a</Antd.Button>

                            </Antd.Col>
                        </Antd.Row>
                    </div>


                    <hr />




                    <Antd.Table dataSource={props.variants}
                        sticky
                        columns={variantCol}
                        rowKey="id"
                        bordered
                        pagination={{
                            pageSize: 6, current: page, onChange(page, pageSize) {
                                setPage(page)
                            },
                        }}
                        style={{ height: 450 }}

                        onRow={(record, index) => {

                            return {
                                onClick: event => {
                                    props.setVariant(record)
                                }
                            }
                        }}
                        rowSelection={rowSelection}
                    >

                    </Antd.Table>
                </div>

            </div>

        )
    })
    const VariantDetails = (props: any) => {

        return (
            <>

                <Mui.Paper sx={{ p: 3, height: 535 }}>

                    <div>Th??ng tin chi ti???t</div>
                    <hr />
                    <div style={{ marginLeft: '20%', marginRight: '20%', marginTop: 10 }}>
                        <Antd.Image height={'80%'} width={"100%%"} src={focusVariant?.image ? focusVariant.image : 'https://phapluat.me/images/noimage.jpg'}></Antd.Image>
                    </div>
                    <Antd.Row style={{ marginTop: 30 }}>

                        <Antd.Col span={12}><p>T??n s???n ph???m:</p></Antd.Col>
                        <Antd.Col span={12}><b>{props.variant?.name}</b></Antd.Col>

                    </Antd.Row>
                    <Antd.Row>
                        <Antd.Col span={12}><p>M?? s???n ph???m:</p></Antd.Col>
                        <Antd.Col span={12}><Antd.Tag color='orange'> {props.variant?.code}</Antd.Tag></Antd.Col>

                    </Antd.Row>
                    <Antd.Row>
                        <Antd.Col span={12}><p>Gi?? nh???p:</p></Antd.Col>
                        <Antd.Col span={12}><b>{(props.variant?.importPrice + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</b></Antd.Col>

                    </Antd.Row>
                    <Antd.Row>
                        <Antd.Col span={12}><p>Gi?? b??n l???:</p></Antd.Col>
                        <Antd.Col span={12}><b>{(props.variant?.salePrice + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</b></Antd.Col>

                    </Antd.Row>
                    <Antd.Row>
                        <Antd.Col span={12}><p>Gi?? b??n bu??n:</p></Antd.Col>
                        <Antd.Col span={12}><b>{(props.variant?.wholesalePrice + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</b></Antd.Col>

                    </Antd.Row>
                </Mui.Paper>

            </>


        )
    }



    const View = () => {
        return (

            <div>
                <div>
                    <h2 style={{ fontSize:'15px' }} >
                        <Link to="/products">
                            <LeftOutlined /> Danh s??ch s???n ph???m
                        </Link>
                    </h2>
                    <h1 style={{fontSize:'30px',margin:0,marginRight:10,marginBottom:'45px'}}>Chi ti???t s???n ph???m</h1>

                </div>



                <Mui.Grid container spacing={2} sx={{ mb: 10 }}>
                    <Mui.Grid item xs={8} sx={{ mb: 2 }}>
                        <Product />

                    </Mui.Grid>
                    <Mui.Grid item xs={4}>

                        <Mui.Grid item sx={{}}>
                            <Mui.Paper style={{ width: '100%', height: 150, padding: 20 }}>
                                <div>Danh m???c s???n ph???m</div>
                                <hr></hr>
                                {   productInfo?.categories?
                                    productInfo.categories.map((category, index) => {

                                        return (
                                            <Antd.Tag key={category.id} color={'blue'}>{category.name}</Antd.Tag>

                                        )
                                    }):null
                                }


                            </Mui.Paper>
                            <Mui.Paper style={{ width: '100%', height: 190, padding: 20, marginTop: 20 }}>
                                <div>Th??ng tin kh??c</div>
                                <hr></hr>



                            </Mui.Paper>
                        </Mui.Grid>
                    </Mui.Grid>


                    <Mui.Grid item xs={8}>

                        <Variants setVariant={setFocusVariant} variants={productInfo?.variants} />
                    </Mui.Grid>
                    <Mui.Grid item xs={4}>

                        <VariantDetails variant={focusVariant} />
                    </Mui.Grid>


                </Mui.Grid>
            </div>

        )
    }
    return (

            <div className ='p-5'>
            <Antd.Modal width={1000}  title="M?? t??? s???n ph???m" visible={openDes} footer={null} onCancel={()=>{setOpenDes(false)}}>
                <textarea style={{width:'100%',height:'500px',padding:10}} disabled={true}>{productInfo?.product.description}</textarea>
            </Antd.Modal>
           
            {isUpdate ? <UpdateProduct
                product={productInfo?.product} variants={productInfo?.variants} categories={productInfo?.categories} setIsUpdate={setActionUpdate}></UpdateProduct>
                : <View></View>}
        </div>
    )
}
export default ProductDetails