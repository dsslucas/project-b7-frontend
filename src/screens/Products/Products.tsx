import React, { useEffect, useMemo, useState } from "react";
import BoxComponent from "../../components/Box/Box";
import TypographyComponent from "../../components/Typography/Typography";
import TableComponent from "../../components/Table/Table";
import api from "../../api/api";
import { AlertInterface, ProductCategoryInterface, ProductInterface, ProductResponse, ResponseInterface } from "../../Common/interfaces";
import { useSelector } from "react-redux";
import { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import InputComponent from "../../components/Input/Input";
import { CommonFunctions } from "../../common/common";
import AlertComponent from "../../components/Alert/Alert";
import LoadingComponent from "../../components/Loading/Loading";

const ProductsScreen = () => {
    const { LoginData } = useSelector((state: any) => state);
    const [headers, setHeaders] = useState<String[]>([]);
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [productsCategory, setProductsCategory] = useState<ProductCategoryInterface[]>([]);
    const [alert, setAlert] = useState<AlertInterface>({
        open: false,
        title: "",
        text: "",
        severity: 'info'
    });
    const [loading, setLoading] = useState<boolean>(true);

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
        setLoading(true);
        await api
            .get<ResponseInterface>("/product/list", {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                },
            }).then((response) => {
                const responseData = response.data;

                if (isProductResponse(responseData.data)) {
                    const { headers, data: products } = responseData.data;
                    setHeaders(headers);
                    setProducts(products);
                } else {
                    console.error("O tipo de dados recebido não é um array.");
                }
            }).catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        error.response.data.message,
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro de requisição. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else {
                    console.error("Erro inesperado:", error.message);
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro inesperado. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                }
            }).finally(() => {
                setLoading(false);
            });
    };

    const getProductsCategory = async () => {
        setLoading(true);
        await api
            .get<ResponseInterface>("/product/category/list/all", {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                },
            }).then((response) => {
                const responseData = response.data;

                if (isProductCategory(responseData.data)) {
                    setProductsCategory(responseData.data);
                } else {
                    console.error("O tipo de dados recebido não é um array.");
                }
            }).catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        error.response.data.message,
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro de requisição. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else {
                    console.error("Erro inesperado:", error.message);
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro inesperado. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                }
            }).finally(() => {
                setLoading(false);
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
                        // Check if SKU is for editing or creating
                        return String(row?.getValue('id') ?? "") === "";
                    },
                    filterVariant: "autocomplete",
                    accessorFn: (row: any) => String(row.sku),
                }, {
                    accessorKey: 'nameProduct',
                    filterVariant: 'autocomplete',
                    header: 'Nome Product',
                    //size: 100,
                    muiEditTextFieldProps: ({ cell, row }) => {
                        return ({
                            required: true,
                            value: String(row.original.nameProduct || ''),
                            onChange: (event) => {
                                row._valuesCache = {
                                    ...row._valuesCache,
                                    nameProduct: event.target.value,
                                    name: event.target.value
                                }

                                row.original = {
                                    ...row.original,
                                    nameProduct: event.target.value,
                                    name: event.target.value
                                }
                            },
                        })
                    },
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
                    accessorFn: (row: ProductInterface) => row.category.name,
                    accessorKey: 'category',
                    header: 'Categoria',
                    editVariant: 'select',
                    filterVariant: 'select',
                    editSelectOptions: productsCategory.map((element: ProductCategoryInterface) => ({
                        label: element.name,
                        value: String(element.id),
                    })),
                    muiEditTextFieldProps: ({ cell, row }) => {
                        return ({
                            select: true,
                            value: String(row.original.category.id || ''),
                            defaultValue: String(row.original.category.id || ''),
                            onChange: (event) => {
                                row._valuesCache = {
                                    ...row._valuesCache,
                                    category: {
                                        id: Number(event.target.value)
                                    }
                                }

                                row.original.category = {
                                    ...row.original.category,
                                    id: Number(event.target.value)
                                }
                            },
                        })
                    },
                    Cell: ({ row }) => {
                        const category = productsCategory.find((cat) => cat.id === row.original.category.id);
                        return category ? category.name : 'Sem categoria';
                    },
                }

            ];

            if (headers.some((element: String) => element === "ICMS")) {
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
                            const numericValue = CommonFunctions().transformStringToNumericValue(value);

                            setIcms(value);

                            if (creationMode) {
                                row._valuesCache = {
                                    ...row._valuesCache,
                                    icms: numericValue
                                }
                                table.setCreatingRow(row);
                            }
                            else {
                                row.original = {
                                    ...row.original,
                                    icms: numericValue
                                }
                                table.setEditingRow(row);
                                // table.options.data[row.index] = { ...row.original, icms: numericValue };
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

            if (headers.some((element: String) => element === "Quantidade")) {
                commonData.push({
                    accessorFn: (row: ProductInterface) => row.amount.toLocaleString("pt-br"),
                    id: 'amount',
                    header: 'Quantidade',
                    filterFn: 'lessThan',
                    Edit: ({ cell, column, row, table }) => {
                        const creationMode = row.original?.id === null || Number(row.original?.id) === 0;
                        const [amount, setAmount] = useState<string>(row.original.amount.toLocaleString("pt-br"));

                        const handleValueChange = (value: string) => {
                            const numericValue = CommonFunctions().transformStringToNumericValue(value);

                            setAmount(value);

                            if (creationMode) {
                                row._valuesCache = {
                                    ...row._valuesCache,
                                    amount: numericValue,
                                    totalValue: Number()
                                }
                                table.setCreatingRow(row);
                            }
                            else {
                                row.original = {
                                    ...row.original,
                                    amount: numericValue
                                }
                                table.setEditingRow(row);
                                // table.options.data[row.index] = { ...row.original, amount: numericValue };
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

            if (headers.some((element: String) => element === "Valor de custo")) {
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
                            const numericValue = CommonFunctions().transformStringToNumericValue(value);

                            setUnitValue(value);

                            if (creationMode) {
                                row._valuesCache = {
                                    ...row._valuesCache,
                                    unitValue: numericValue
                                }
                                table.setCreatingRow(row);
                            }
                            else {
                                row.original = {
                                    ...row.original,
                                    unitValue: numericValue
                                }
                                table.setEditingRow(row);
                                /*
                                table.setEditingRow(row);
                                table.options.data[row.index] = { ...row.original, unitValue: numericValue };
                                */
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

            if (headers.some((element: String) => element === "Valor da venda")) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [products],
    );

    useEffect(() => {
        getProducts();
        getProductsCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreateProduct = async (data: ProductInterface, table: MRT_TableInstance<ProductInterface>) => {
        console.log("data: ", data)
        setLoading(true);
        await api.post("/product/create", {
            name: data.nameProduct,
            sku: Number(data.sku) === 0 ? null : Number(data.sku),
            amount: Number(data.amount) === 0 ? null : Number(data.amount),
            unitValue: Number(data.unitValue) === 0 ? null : Number(data.unitValue),
            icms: Number(data.icms) === 0 ? null : Number(data.icms),
            categoryId: Number(data.category),
            active: typeof data.active !== "boolean" ? null : data.active
        }, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`,
            }
        })
            .then((response) => {
                getProducts();
                setAlert(CommonFunctions().buildAlert(
                    "Sucesso",
                    response.data.message,
                    "success",
                    (updatedAlert) => {
                        setAlert(updatedAlert)
                    })
                );
                table.setCreatingRow(null);
            }).catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        error.response.data.message,
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro de requisição. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else {
                    console.error("Erro inesperado:", error.message);
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro inesperado. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                }
            }).finally(() => {
                setLoading(false);
            });
    }

    const handleUpdateProduct = async (data: ProductInterface, table: MRT_TableInstance<ProductInterface>) => {
        setLoading(true);
        await api.put(`/product/${data.id}`, {
            name: data.nameProduct,
            sku: Number(data.sku),
            amount: Number(data.amount),
            unitValue: Number(data.unitValue),
            icms: Number(data.icms),
            categoryId: Number(data.category.id),
            active: typeof data.active !== "boolean" ? null : data.active
        }, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`,
            }
        })
            .then((response) => {
                getProducts();
                setAlert(CommonFunctions().buildAlert(
                    "Sucesso",
                    response.data.message,
                    "success",
                    (updatedAlert) => {
                        setAlert(updatedAlert)
                    })
                );
                table.setEditingRow(null);
            }).catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        error.response.data.message,
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro de requisição. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else {
                    console.error("Erro inesperado:", error.message);
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro inesperado. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                }
            }).finally(() => {
                setLoading(false);
            });
    }

    const handleDeleteProduct = async (data: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setLoading(true);
            await api.delete(`/product/${data}`, {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                }
            })
                .then((response) => {
                    getProducts();
                    setAlert(CommonFunctions().buildAlert(
                        "Sucesso",
                        response.data.message,
                        "success",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                }).catch((error) => {
                    console.error(error);
                    if (error.response) {
                        console.error("Erro no servidor:", error.response.data);
                        setAlert(CommonFunctions().buildAlert(
                            "Erro",
                            error.response.data.message,
                            "error",
                            (updatedAlert) => {
                                setAlert(updatedAlert)
                            })
                        );
                    } else if (error.request) {
                        console.error("Erro de requisição. Tente novamente mais tarde.");
                        setAlert(CommonFunctions().buildAlert(
                            "Erro",
                            "Erro de requisição. Tente novamente mais tarde.",
                            "error",
                            (updatedAlert) => {
                                setAlert(updatedAlert)
                            })
                        );
                    } else {
                        console.error("Erro inesperado:", error.message);
                        setAlert(CommonFunctions().buildAlert(
                            "Erro",
                            "Erro inesperado. Tente novamente mais tarde.",
                            "error",
                            (updatedAlert) => {
                                setAlert(updatedAlert)
                            })
                        );
                    }
                }).finally(() => {
                    setLoading(false);
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
        {loading && <LoadingComponent open={loading} />}
        {alert.open && (
            <AlertComponent
                open={alert.open}
                title={alert.title}
                text={alert.text}
                severity={alert.severity}
            />
        )}

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