import React, { useEffect, useMemo, useState } from "react";
import BoxComponent from "../../components/Box/Box";
import TypographyComponent from "../../components/Typography/Typography";
import TableComponent from "../../components/Table/Table";
import api from "../../api/api";
import { ProductInterface, ProductResponse, ResponseInterface } from "../../Common/interfaces";
import { useSelector } from "react-redux";
import { MRT_ColumnDef } from "material-react-table";

const ProductsScreen = () => {
    const { LoginData } = useSelector((state: any) => state);
    const [columns, setColumns] = useState<String[]>([]);
    const [products, setProducts] = useState<ProductInterface[]>([]);

    function isProductResponse(data: unknown): data is ProductResponse[] {
        return Array.isArray(data) && data.every(item => 'data' in item);
    }

    const getProducts = async () => {
        await api
            .get<ResponseInterface>("/product/list", {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                },
            })
            .then((response) => {
                const responseData = response.data;
                console.log(responseData.data)

                if (isProductResponse(responseData.data)) {
                    const content: ProductResponse[] = responseData.data;
                    console.table(content);
                    //setProducts(content.data);
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

    const tableColumns = useMemo<MRT_ColumnDef<ProductInterface | any>[]>(
        () => [
            {
                id: 'id',
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
                filterVariant: "autocomplete",
                size: 20,
                accessorFn: (row: any) => String(row.id)
            }, {
                id: 'sku',
                accessorKey: 'sku',
                header: 'SKU',
                enableEditing: false,
                filterVariant: "autocomplete",
                size: 20,
                accessorFn: (row: any) => String(row.sku)
            }, {
                accessorKey: 'name',
                filterVariant: 'autocomplete',
                header: 'Nome',
                size: 100,
                muiEditTextFieldProps: {
                    required: true,
                    // error: !!validationErrors?.name,
                    // helperText: validationErrors?.name,
                    // onFocus: () =>
                    //     setValidationErrors({
                    //         ...validationErrors,
                    //         name: undefined,
                    //     }),
                }
            }, {
                accessorFn: (row: ProductInterface) => String(row.active ? "ATIVO" : "INATIVO"),
                accessorKey: 'active',
                header: 'Ativo',
                editVariant: 'select',
                filterVariant: 'select',
                editSelectOptions: [
                    { value: true, label: 'ATIVO' },
                    { value: false, label: 'INATIVO' },
                ],
                muiEditTextFieldProps: {
                    select: true,
                },
            }, {
                accessorFn: (row: ProductInterface) => new Date(row.registerDate),
                id: 'dateRegister',
                header: 'Data de registro',
                filterVariant: 'date',
                filterFn: 'lessThan',
                sortingFn: 'datetime',
                enableEditing: false,
                Cell: ({ cell }) => {
                    const date = cell.getValue<Date>();
                    if (date instanceof Date && !isNaN(date.getTime())) {
                        return date.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric' });
                    }
                    return '';
                },
                Header: ({ column }) => <em>{column.columnDef.header}</em>,
                muiFilterTextFieldProps: {
                    sx: {
                        minWidth: '250px',
                    },
                },
                muiEditTextFieldProps: {
                    disabled: true,
                },
            }
        ],
        [],
    );

    useEffect(() => {
        getProducts();
    }, []);

    const handleCreateProduct = async (data: ProductInterface) => {
        console.log(data)
        console.log(LoginData.token)
        await api.post("/user/signin", data, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`,
            }
        })
            .then((response) => {
                const responseData = response.data;

                console.log(responseData)
                getProducts();
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

    const handleUpdateProduct = async (data: ProductInterface) => {
        console.log(data)
        console.log(LoginData.token)
        await api.put(`/user/${data.id}`, data, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`,
            }
        })
            .then((response) => {
                const responseData = response.data;

                console.log(responseData)
                getProducts();
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

    const handleDeleteProduct = async (data: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            alert(`user deleted! Id: ${data}`)
            await api.delete(`/user/${data}`, {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                }
            })
                .then((response) => {
                    const responseData = response.data;

                    console.log(responseData)
                    getProducts();
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
                Gestão de produtos
            </TypographyComponent>
        </BoxComponent>
        <TableComponent
            columns={tableColumns}
            data={products}
            create={handleCreateProduct}
            update={handleUpdateProduct}
            delete={handleDeleteProduct}
        />
    </BoxComponent>
}

export default ProductsScreen;