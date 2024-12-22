import React, { useState } from 'react';

//Import Material React Table Translations
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';

//Date Picker Imports - these should just be in your Context Provider
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/de';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useMemo } from 'react';

import * as XLSX from "xlsx";

//MRT Imports
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_Row,
    MRT_TableOptions,
} from 'material-react-table';

//Material UI Imports
import {
    Box,
    Button,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Tooltip
} from '@mui/material';

import FileDownloadIcon from '@mui/icons-material/FileDownload';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

//Mock Data
import { data, Employee, roles } from '../../screens/testes/data';


import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

type DownloadType = 'XLSX' | 'CSV';
type Category = 'All Data' | 'All Rows' | 'Page Rows' | 'Selected Rows';

const TableComponent = () => {
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string | undefined>
    >({});

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDownload = (rows: MRT_Row<Employee>[] | null, type: DownloadType, category: Category) => {
        handleMenuClose();

        if (category === "All Data") handleExportData(type);
        else if (rows !== null) handleExportRows(rows, type);
    };

    const downloadXlsx = (data: any[], fileName: string) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const handleExportRows = (rows: MRT_Row<Employee>[], downloadType: DownloadType) => {
        if (downloadType === "CSV") {
            const visibleColumns = table.getVisibleLeafColumns();
            const visibleColumnIds = visibleColumns
                .map((col) => col.id as keyof Employee)
                .filter((columnId: string) => columnId !== "action" && columnId !== "mrt-row-actions" && columnId !== "mrt-row-select");

            const filteredData = rows.map((row: any) =>
                visibleColumnIds.reduce((acc, columnId) => {
                    acc[columnId] = row.original[columnId];
                    return acc;
                }, {} as Partial<Employee>)
            );

            const csv = generateCsv(csvConfig)(filteredData);
            download(csvConfig)(csv);
        } else if (downloadType === "XLSX") {
            const visibleColumns = table.getVisibleLeafColumns();
            const visibleColumnIds = visibleColumns
                .map((col) => col.id as keyof Employee)
                .filter((columnId: string) => columnId !== "action" && columnId !== "mrt-row-actions" && columnId !== "mrt-row-select");

            const filteredData = rows.map((row: any) =>
                visibleColumnIds.reduce((acc, columnId) => {
                    acc[columnId] = row.original[columnId];
                    return acc;
                }, {} as Partial<Employee>)
            );
            downloadXlsx(filteredData, "Relatório_Selecionado");
        }
    };

    const handleExportData = (downloadType: DownloadType) => {
        if (downloadType === "CSV") {
            const filteredData = data.map((row: any) => {
                const { action, ...rest } = row;
                return rest;
            });

            const csv = generateCsv(csvConfig)(filteredData);
            download(csvConfig)(csv);
        } else if (downloadType === "XLSX") {
            const filteredData = data.map((row: any) => {
                const { action, ...rest } = row;
                return rest;
            });

            downloadXlsx(filteredData, "Relatório_Completo");
        }
    };

    const columns = useMemo<MRT_ColumnDef<Employee>[]>(
        () => [
            {
                id: 'id',
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
                filterVariant: "autocomplete",
                size: 20,
            }, {
                accessorKey: 'name',
                filterVariant: 'autocomplete',
                header: 'Nome',
                size: 100,
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.name,
                    helperText: validationErrors?.name,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            name: undefined,
                        }),
                }
            }, {
                accessorKey: 'email',
                header: 'E-mail',
                filterVariant: 'autocomplete',
                muiEditTextFieldProps: {
                    type: 'email',
                    required: true,
                    error: !!validationErrors?.email,
                    helperText: validationErrors?.email,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            email: undefined,
                        }),
                }
            }, {
                accessorKey: 'role',
                header: 'Cargo',
                editVariant: 'select',
                filterVariant: 'autocomplete',
                editSelectOptions: roles,
                muiEditTextFieldProps: {
                    select: true,
                    error: !!validationErrors?.state,
                    helperText: validationErrors?.state,
                },
            }, {
                accessorFn: (row: Employee) => new Date(row.registerDate),
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

    //CREATE action
    const handleCreateUser: MRT_TableOptions<Employee>['onCreatingRowSave'] = async ({
        values,
        table,
    }) => {
        console.log(values)
        alert("enviei")
        table.setCreatingRow(null);
    };

    //UPDATE action
    const handleSaveUser: MRT_TableOptions<Employee>['onEditingRowSave'] = async ({
        values,
        table,
    }) => {
        console.log(values)
        alert("atualizei")
        table.setEditingRow(null);
    };

    //DELETE action
    const openDeleteConfirmModal = (row: MRT_Row<Employee>) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            alert(`user deleted! Id: ${row.original.id}`)
        }
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableColumnOrdering: true,
        enableColumnFilterModes: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowSelection: true,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        localization: MRT_Localization_PT_BR,
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select'],
                right: ['mrt-row-actions'],
            },
        },
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },
        muiPaginationProps: {
            color: 'secondary',
            rowsPerPageOptions: [10, 20, 30],
            shape: 'rounded',
            variant: 'outlined',
        },
        enableEditing: true,
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        getRowId: (row) => row.id,
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateUser,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveUser,
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        muiTableBodyCellProps: ({ column }) =>
            column.id === 'mrt-row-select'
                ? { sx: { textAlign: 'center', verticalAlign: 'middle', padding: 0 } }
                : {
                    sx: {
                        padding: 0,
                        textAlign: "center"
                    }
                },
        muiTableHeadCellProps: ({ column }) =>
            column.id === 'mrt-row-select'
                ? { sx: { textAlign: 'center', verticalAlign: 'middle', padding: 0 } }
                : {
                },
        muiTableBodyRowProps: () => ({
            sx: {
                '& .MuiCheckbox-root': {
                    margin: 'auto',
                },
                '& tr:nth-of-type(even) > td': {
                    backgroundColor: '#f5f5f5',
                },
            },
        }),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => {
                        table.setCreatingRow(true);
                    }}
                >
                    Criar
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleMenuOpen}
                >
                    Exportar
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleDownload(null, 'XLSX', 'All Data')}>Todos os registros (XLSX)</MenuItem>
                    <MenuItem onClick={() => handleDownload(null, 'CSV', 'All Data')}>Todos os registros (CSV)</MenuItem>
                    <Divider />
                    <MenuItem disabled={table.getPrePaginationRowModel().rows.length === 0} onClick={() => handleDownload(table.getPrePaginationRowModel().rows, 'XLSX', 'All Rows')}>Todas as linhas (XLSX)</MenuItem>
                    <MenuItem disabled={table.getPrePaginationRowModel().rows.length === 0} onClick={() => handleDownload(table.getPrePaginationRowModel().rows, 'CSV', 'All Rows')}>Todas as linhas (CSV)</MenuItem>
                    <Divider />
                    <MenuItem disabled={table.getRowModel().rows.length === 0} onClick={() => handleDownload(table.getRowModel().rows, 'XLSX', 'Page Rows')}>Linhas da página (XLSX)</MenuItem>
                    <MenuItem disabled={table.getRowModel().rows.length === 0} onClick={() => handleDownload(table.getRowModel().rows, 'CSV', 'Page Rows')}>Linhas da página (CSV)</MenuItem>
                    <Divider />
                    <MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => handleDownload(table.getSelectedRowModel().rows, 'XLSX', 'Selected Rows')}>Linhas selecionadas (XLSX)</MenuItem>
                    <MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => handleDownload(table.getSelectedRowModel().rows, 'CSV', 'Selected Rows')}>Linhas selecionadas (CSV)</MenuItem>
                </Menu>
            </Box>
        ),
        muiTopToolbarProps: {
            sx: {
                display: "flex",
                flexDirection: "row",
                "& > .MuiBox-root": {
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    alignItems: {
                        xs: "start",
                        sm: "center"
                    },
                    display: "flex",
                },
            },
        },
        muiTableBodyProps: {
            sx: {
                '& tr:nth-of-type(even) > td': {
                    backgroundColor: '#f5f5f5',
                },
            },
        },
    });

    return <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="br">
        <MaterialReactTable table={table} />
    </LocalizationProvider>
};

export default TableComponent;
