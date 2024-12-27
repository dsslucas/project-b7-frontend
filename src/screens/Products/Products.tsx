import React, { useEffect, useMemo, useState } from "react";
import BoxComponent from "../../components/Box/Box";
import TypographyComponent from "../../components/Typography/Typography";
import TableComponent from "../../components/Table/Table";
import api from "../../api/api";
import { ProductCategoryInterface, ProductInterface, ProductResponse, ResponseInterface } from "../../Common/interfaces";
import { useSelector } from "react-redux";
import { MRT_ColumnDef } from "material-react-table";
import { TextField } from "@mui/material";
import InputComponent from "../../components/Input/Input";

import { IMaskInput } from "react-imask";

const ProductsScreen = () => {
    const { LoginData } = useSelector((state: any) => state);
    const [headers, setHeaders] = useState<String[]>([]);
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [productsCategory, setProductsCategory] = useState<ProductCategoryInterface[]>([]);

    function isProductResponse(data: unknown): data is ProductResponse {
        return (
            typeof data === "object" &&
            data !== null &&
            "headers" in data &&
            "data" in data &&
            "isAdmin" in data &&
            "isStockWorker" in data &&
            Array.isArray((data as any).headers) &&
            Array.isArray((data as any).data)
        );
    }

    function isProductCategory(data: unknown): data is ProductCategoryInterface[] {
        return Array.isArray(data) && data.every(item => 'id' in item);
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

                if (isProductResponse(responseData.data)) {
                    const { headers, data: products, isAdmin, isStockWorker } = responseData.data;
                    console.table(products);
                    setHeaders(headers);
                    setProducts(products);
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
                    setProductsCategory(responseData.data);
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

    const tableColumns = useMemo<MRT_ColumnDef<ProductInterface | any>[]>(
        () => {
            var commonData: MRT_ColumnDef<ProductInterface>[] = [
                {
                    id: 'id',
                    accessorKey: 'id',
                    header: 'Id',
                    enableEditing: false,
                    filterVariant: "autocomplete",
                    accessorFn: (row: any) => String(row.id),
                }, {
                    id: 'sku',
                    accessorKey: 'sku',
                    header: 'SKU',
                    enableEditing: (row) => {
                        // Verifica se o valor de 'sku' é vazio ou nulo
                        return String(row?.getValue('sku') ?? "") === "";
                    },
                    filterVariant: "autocomplete",
                    accessorFn: (row: any) => String(row.sku)
                }, {
                    accessorKey: 'nameProduct',
                    filterVariant: 'autocomplete',
                    header: 'Nome Product',
                    //size: 100,
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
                },
                {
                    accessorFn: (row: ProductInterface) => String(row.category.name),
                    accessorKey: 'category',
                    header: 'Categoria',
                    editVariant: 'select',
                    filterVariant: 'select',
                    editSelectOptions: productsCategory.map((element: ProductCategoryInterface) => {
                        return {
                            label: element.name,
                            value: element.id
                        }
                    }),
                    muiEditTextFieldProps: {
                        select: true,
                    },
                },
            ];

            if (headers.some((element: String) => "ICMS")) {
                commonData.push({
                    accessorFn: (row: ProductInterface) => String(row.icms.toLocaleString("pt-br")),
                    id: 'icms',
                    header: 'ICMS',
                    filterFn: 'lessThan',
                    Edit: ({ cell, column, row, table }) => {
                        const creationMode = row.original?.id === null || Number(row.original?.id) === 0;
                        const [icms, setIcms] = useState<string>(
                            row.original.icms.toLocaleString("pt-br")
                        );

                        const handleValueChange = (value: string) => {
                            const numericValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
                            setIcms(value);

                            if (creationMode) {
                                row._valuesCache = {
                                    ...row._valuesCache,
                                    icms: numericValue
                                }
                                table.setCreatingRow(row);
                            }
                            else {
                                table.setEditingRow(row);
                                table.options.data[row.index] = { ...row.original, icms: numericValue };
                            }
                        };

                        return (
                            <InputComponent
                                id={`icms-${row.id}`}
                                name="icms"
                                type="text"
                                placeholder="Digite o valor"
                                fullWidth
                                variant="standard"
                                mask="num"
                                maskOptions={{
                                    mask: Number,
                                    thousandsSeparator: ".",
                                    radix: ",",
                                    scale: 2,
                                }}
                                value={icms}
                                onChange={(e) => handleValueChange(e.target.value)}
                            />
                        );
                    },
                })
            }

            if (headers.some((element: String) => "Quantidade")) {
                commonData.push({
                    accessorFn: (row: ProductInterface) => row.amount.toLocaleString("pt-br"),
                    id: 'amount',
                    header: 'Quantidade',
                    filterFn: 'lessThan',
                    Edit: ({ cell, column, row, table }) => {
                        const creationMode = row.original?.id === null || Number(row.original?.id) === 0;
                        const [amount, setAmount] = useState<string>(row.original.amount.toLocaleString("pt-br"));

                        const handleValueChange = (value: string) => {
                            const numericValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
                            setAmount(value);

                            if (creationMode) {
                                row._valuesCache = {
                                    ...row._valuesCache,
                                    amount: numericValue
                                }
                                table.setCreatingRow(row);
                            }
                            else {
                                table.setEditingRow(row);
                                table.options.data[row.index] = { ...row.original, amount: numericValue };
                            }
                        };

                        return (
                            <InputComponent
                                id={`amount-${row.id}`}
                                name="amount"
                                type="text"
                                placeholder="Digite o valor"
                                fullWidth
                                variant="standard"
                                mask="num"
                                maskOptions={{
                                    mask: Number,
                                    thousandsSeparator: ".",
                                    radix: ",",
                                    scale: 2,
                                }}
                                value={amount}
                                onChange={(e) => handleValueChange(e.target.value)}
                            />
                        );
                    },
                });

            }

            if (headers.some((element: String) => "Valor de custo")) {
                commonData.push({
                    accessorFn: (row: ProductInterface) => String(row.unitValue.toLocaleString("pt-br")),
                    id: 'unitValue',
                    header: 'Valor de custo',
                    filterFn: 'lessThan',
                    Edit: ({ cell, column, row, table }) => {
                        const creationMode = row.original?.id === null || Number(row.original?.id) === 0;
                        const [unitValue, setUnitValue] = useState<string>(
                            row.original.unitValue.toLocaleString("pt-br")
                        );

                        const handleValueChange = (value: string) => {
                            const numericValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
                            setUnitValue(value);

                            if (creationMode) {
                                row._valuesCache = {
                                    ...row._valuesCache,
                                    unitValue: numericValue
                                }
                                table.setCreatingRow(row);
                            }
                            else {
                                table.setEditingRow(row);
                                table.options.data[row.index] = { ...row.original, unitValue: numericValue };
                            }
                        };

                        return (
                            <InputComponent
                                id={`unitValue-${row.id}`}
                                name="unitValue"
                                type="text"
                                placeholder="Digite o valor"
                                fullWidth
                                variant="standard"
                                mask="num"
                                maskOptions={{
                                    mask: Number,
                                    thousandsSeparator: ".",
                                    radix: ",",
                                    scale: 2,
                                }}
                                value={unitValue}
                                onChange={(e) => handleValueChange(e.target.value)}
                            />
                        );
                    },
                })
            }

            if (headers.some((element: String) => "Valor da venda")) {
                commonData.push({
                    accessorFn: (row: ProductInterface) => String(row.totalValue.toLocaleString("pt-br")),
                    id: 'totalValue',
                    header: 'Valor da venda',
                    filterFn: 'autocomplete',
                    enableEditing: false
                })
            }

            commonData.push({
                //accessorFn: (row: ProductInterface) => new Date(row.registerDate),
                id: 'nameUser',
                accessorKey: 'nameUser',
                header: 'Registrado por',
                filterVariant: 'autocomplete',
                enableEditing: false,
                muiEditTextFieldProps: {
                    disabled: true,
                },
            });
            commonData.push({
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
            });

            return commonData;
        },
        [productsCategory],
    );

    useEffect(() => {
        getProducts();
        getProductsCategory();
    }, []);

    const handleCreateProduct = async (data: ProductInterface) => {
        console.log(data)
        console.log(LoginData.token)
        await api.post("/product/create", {
            name: data.nameProduct,
            sku: Number(data.sku),
            amount: Number(data.amount),
            unitValue: Number(data.unitValue),
            icms: Number(data.icms),
            category: {
                id: 2
            }
        }, {
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
        await api.put(`/product/${data.id}`, data, {
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
            await api.delete(`/product/${data}`, {
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