import React, { useEffect, useMemo, useState } from "react";
import BoxComponent from "../../components/Box/Box";
import TypographyComponent from "../../components/Typography/Typography";
import TableComponent from "../../components/Table/Table";
import { useSelector } from "react-redux";
import { ProductCategoryInterface, ProductCategoryTypeInterface, ResponseInterface } from "../../Common/interfaces";
import api from "../../api/api";
import { MRT_ColumnDef } from "material-react-table";

const ProductsCategoryScreen = () => {
    const { LoginData } = useSelector((state: any) => state);
    const [productsCategory, setProductsCategory] = useState<ProductCategoryInterface[]>([]);
    const [productsCategoryType, setProductsCategoryType] = useState<ProductCategoryTypeInterface[]>([]);

    function isProductCategory(data: unknown): data is ProductCategoryInterface[] {
        return Array.isArray(data) && data.every(item => 'id' in item);
    }

    function isProductCategoryType(data: unknown): data is ProductCategoryTypeInterface[] {
        return Array.isArray(data) && data.every(item => 'id' in item);
    }

    const getProductsCategoryType = async () => {
        await api
            .get<ResponseInterface>("/product/category/type/list", {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                },
            })
            .then((response) => {
                const responseData = response.data;

                if (isProductCategoryType(responseData.data)) {
                    const content: ProductCategoryTypeInterface[] = responseData.data;
                    setProductsCategoryType(content);
                } else {
                    console.error("O tipo de dados recebido não é um array.");
                }
            })
            .catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                } else {
                    console.error("Erro inesperado:", error.message);
                }
            });
    }

    const getProductsCategory = async () => {
        await api
            .get<ResponseInterface>("/product/category/list/all", {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                },
            })
            .then((response) => {
                const responseData = response.data;

                if (isProductCategory(responseData.data)) {
                    const content: ProductCategoryInterface[] = responseData.data;
                    setProductsCategory(content);
                } else {
                    console.error("O tipo de dados recebido não é um array.");
                }
            })
            .catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                } else {
                    console.error("Erro inesperado:", error.message);
                }
            });
    };

    const tableColumns = useMemo<MRT_ColumnDef<ProductCategoryInterface | any>[]>(() => [
        {
            id: 'id',
            accessorKey: 'id',
            header: 'Id',
            enableEditing: false,
            filterVariant: "autocomplete",
            size: 20,
            accessorFn: (row: any) => String(row.id),
        },
        {
            id: 'name',
            accessorKey: 'name',
            header: 'Nome',
            filterVariant: "autocomplete",
            size: 20,
            muiEditTextFieldProps: ({ cell, row }) => {
                return ({
                    required: true,
                    value: String(row.original.name || ''),
                    onChange: (event) => {
                        row._valuesCache = {
                            ...row._valuesCache,
                            name: event.target.value
                        }

                        row.original = {
                            ...row.original,
                            name: event.target.value
                        }
                    },
                })
            },
        },
        {
            accessorFn: (row: ProductCategoryInterface) => String(row.active ? "ATIVO" : "INATIVO"),
            accessorKey: 'active',
            header: 'Ativo',
            editVariant: 'select',
            filterVariant: 'select',
            editSelectOptions: [
                { value: true, label: 'ATIVO' },
                { value: false, label: 'INATIVO' },
            ],
            muiEditTextFieldProps: ({ cell, row }) => {
                return {
                    select: true,
                    value: String(row.original.active),
                    defaultValue: String(row.original.active),
                    onChange: (event) => {
                        const result: boolean = String(event.target.value) === 'true';

                        row._valuesCache = {
                            ...row._valuesCache,
                            active: result
                        }

                        row.original = {
                            ...row.original,
                            active: result
                        }                                    
                    },
                }                        
            }
        },
        {
            accessorFn: (row: ProductCategoryInterface) => String(row.type?.name),
            accessorKey: 'type',
            header: 'Tipo',
            editVariant: 'select',
            filterVariant: 'select',
            editSelectOptions: productsCategoryType.map((element: ProductCategoryTypeInterface) => {
                return {
                    label: element.name,
                    value: element.id
                }
            }),
            muiEditTextFieldProps: ({ cell, row }) => {
                console.log(row.original)
                return ({
                    select: true,
                    value: String(row.original.type.id || ''),
                    defaultValue: String(row.original.type.id || ''),
                    onChange: (event) => {
                        row._valuesCache = {
                            ...row._valuesCache,
                            type:{
                                id: Number(event.target.value)
                            }
                        }

                        row.original.type = {
                            ...row.original.type,
                            id: Number(event.target.value)
                        }
                    },
                })
            },
        },
    ], [productsCategoryType]);

    useEffect(() => {
        getProductsCategoryType();
        getProductsCategory();
    }, []);

    const handleCreateProductCategory = async (data: ProductCategoryInterface) => {
        await api.post("/product/category/create", {
            ...data,
            type: {
                id: data.type
            }
        }, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`,
            }
        })
            .then((response) => {
                const responseData = response.data;
                getProductsCategory();
            })
            .catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                } else {
                    console.error("Erro inesperado:", error.message);
                }
            });
    }

    const handleUpdateProductCategory = async (data: ProductCategoryInterface) => {
        await api.put(`/product/category/${data.id}`, {
            ...data,
            type: {
                id: data.type.id
            }
        }, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`,
            }
        })
            .then((response) => {
                const responseData = response.data;
                getProductsCategory();
            })
            .catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                } else {
                    console.error("Erro inesperado:", error.message);
                }
            });
    }

    const handleDeleteProductCategory = async (data: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            alert(`user deleted! Id: ${data}`)
            await api.delete(`/product/category/${data}`, {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                }
            })
                .then((response) => {
                    const responseData = response.data;
                    getProductsCategory();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response) {
                        console.error("Erro no servidor:", error.response.data);
                    } else if (error.request) {
                        console.error("Erro de requisição. Tente novamente mais tarde.");
                    } else {
                        console.error("Erro inesperado:", error.message);
                    }
                });
        }
    }

    return <BoxComponent sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        width: "100%",
        gap: 2
    }} component="div">
        <BoxComponent sx={{}} component="header">
            <TypographyComponent component="span" variant="body2">
                Gestão da categoria de produtos
            </TypographyComponent>
        </BoxComponent>
        <TableComponent
            columns={tableColumns}
            data={productsCategory}
            create={handleCreateProductCategory}
            update={handleUpdateProductCategory}
            delete={handleDeleteProductCategory}
        />
    </BoxComponent>
}

export default ProductsCategoryScreen;