import React, { useState } from 'react';

//Import Material React Table Translations
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';

//Date Picker Imports - these should just be in your Context Provider
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/de';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useMemo } from 'react';

//MRT Imports
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_Row,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
    createMRTColumnHelper,
    MRT_TableOptions,
} from 'material-react-table';

//Material UI Imports
import {
    Box,
    Button,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
    lighten,
} from '@mui/material';

import FileDownloadIcon from '@mui/icons-material/FileDownload';

//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

//Mock Data
import { data, Employee, roles } from './data';

import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here



const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

type DownloadType = 'XLSX' | 'CSV';
type Category = 'All Data' | 'All Rows' | 'Page Rows' | 'Selected Rows';

const Example = () => {
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
        console.log(`Downloading ${category} as ${type}`);
        // Adicione aqui a lógica para o download dos dados conforme o tipo e a categoria
        handleMenuClose();

        if (category === "All Data") handleExportData(type);
        else if (rows !== null) handleExportRows(rows, type);
    };

    const handleExportRows = (rows: MRT_Row<Employee>[], downloadType: DownloadType) => {
        if (downloadType === "CSV") {
            const visibleColumns = table.getVisibleLeafColumns();
            const visibleColumnIds = visibleColumns
                .map((col) => col.id as keyof Employee)
                .filter((columnId: string) => columnId !== "action");

            // Filtrar os dados das linhas para incluir apenas as colunas visíveis
            const filteredData = rows.map((row: any) =>
                visibleColumnIds.reduce((acc, columnId) => {
                    acc[columnId] = row.original[columnId]; // Garantir que o acesso está alinhado com a tipagem
                    return acc;
                }, {} as Partial<Employee>) // Usar Partial<Employee> para manter tipagem consistente
            );

            // Gerar o CSV apenas com os dados filtrados
            const csv = generateCsv(csvConfig)(filteredData);
            download(csvConfig)(csv);
        }
        else if (downloadType === "XLSX") {

        }
    };

    const handleExportData = (downloadType: DownloadType) => {
        if (downloadType === "CSV") {
            // Filtrar os dados para ignorar a coluna "action"
            const filteredData = data.map((row: any) => {
                const { action, ...rest } = row; // Remove a propriedade "action"
                return rest;
            });

            // Gerar o CSV apenas com os dados filtrados
            const csv = generateCsv(csvConfig)(filteredData);
            download(csvConfig)(csv);
        }
        else if (downloadType === "XLSX") {

        }
    };

    const columns = useMemo<MRT_ColumnDef<Employee>[]>(
        () => [
            {
                id: 'id',
                accessorKey: 'id',
                header: 'Id',
                filterFn: 'between',
                enableEditing: false,
                size: 20,
            },
            {
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
                //custom conditional format and styling
                // Cell: ({ cell }) => (
                //   <Box
                //     component="span"
                //     sx={(theme) => ({
                //       backgroundColor:
                //         cell.getValue<number>() < 50_000
                //           ? theme.palette.error.dark
                //           : cell.getValue<number>() >= 50_000 &&
                //               cell.getValue<number>() < 75_000
                //             ? theme.palette.warning.dark
                //             : theme.palette.success.dark,
                //       borderRadius: '0.25rem',
                //       color: '#fff',
                //       maxWidth: '9ch',
                //       p: '0.25rem',
                //     })}
                //   >
                //     {cell.getValue<number>()?.toLocaleString?.('en-US', {
                //       style: 'currency',
                //       currency: 'USD',
                //       minimumFractionDigits: 0,
                //       maximumFractionDigits: 0,
                //     })}
                //   </Box>
                // ),
            },
            {
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
            },
            {
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
            },
            {
                accessorFn: (row: Employee) => new Date(row.registerDate), //convert to Date for sorting and filtering
                id: 'dateRegister',
                header: 'Data de registro',
                filterVariant: 'date',
                filterFn: 'lessThan',
                sortingFn: 'datetime',
                enableEditing: false,
                Cell: ({ cell }) => {
                    const date = cell.getValue<Date>();
                    if (date instanceof Date && !isNaN(date.getTime())) {
                        // Se for uma data válida, formata para o formato PT-BR
                        return date.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric' });
                    }
                    return ''; // Caso a data seja inválida, retorna uma mensagem amigável
                },
                Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
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
        /*
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await createUser(values);
        */
        console.log(values)
        alert("enviei")
        table.setCreatingRow(null); //exit creating mode
    };

    //UPDATE action
    const handleSaveUser: MRT_TableOptions<Employee>['onEditingRowSave'] = async ({
        values,
        table,
    }) => {
        /*
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await updateUser(values);
        */
        console.log(values)
        alert("atualizei")
        table.setEditingRow(null); //exit editing mode
    };

    //DELETE action
    const openDeleteConfirmModal = (row: MRT_Row<Employee>) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            //deleteUser(row.original.id);
            alert(`user deleted! Id: ${row.original.id}`)
        }
    };

    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        enableColumnOrdering: true,
        enableColumnFilterModes: true, // More filters
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowSelection: true, // Enable row selection
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        localization: MRT_Localization_PT_BR,
        //columnFilterDisplayMode: 'popover',
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select'], // Pin selection column to the left
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
        createDisplayMode: 'row', // ('modal', and 'custom' are also available)
        editDisplayMode: 'row', // ('modal', 'cell', 'table', and 'custom' are also available)
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
                ? { sx: { textAlign: 'center', verticalAlign: 'middle', padding: 0 } } // Use sx for Material UI styles
                : {
                    sx: {
                        padding: 0,
                        textAlign: "center"
                    }
                },
        muiTableHeadCellProps: ({ column }) =>
            column.id === 'mrt-row-select'
                ? { sx: { textAlign: 'center', verticalAlign: 'middle', padding: 0 } } // Use sx for Material UI styles
                : {
                },
        muiTableBodyRowProps: () => ({
            sx: {
                '& .MuiCheckbox-root': {
                    margin: 'auto', // Center the checkbox horizontally and vertically
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
                        table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                        //or you can pass in a row object to set default values with the `createRow` helper function
                        // table.setCreatingRow(
                        //   createRow(table, {
                        //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                        //   }),
                        // );
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
                    {/* All Data */}
                    <MenuItem onClick={() => handleDownload(null, 'XLSX', 'All Data')}>Todos os registros (XLSX)</MenuItem>
                    <MenuItem onClick={() => handleDownload(null, 'CSV', 'All Data')}>Todos os registros (CSV)</MenuItem>
                    <Divider />
                    {/* All Rows */}
                    <MenuItem onClick={() => handleDownload(table.getPrePaginationRowModel().rows, 'XLSX', 'All Rows')}>Todas as linhas (XLSX)</MenuItem>
                    <MenuItem onClick={() => handleDownload(table.getPrePaginationRowModel().rows, 'CSV', 'All Rows')}>Todas as linhas (CSV)</MenuItem>
                    <Divider />
                    {/* Page Rows */}
                    <MenuItem onClick={() => handleDownload(table.getRowModel().rows, 'XLSX', 'Page Rows')}>Linhas da página (XLSX)</MenuItem>
                    <MenuItem onClick={() => handleDownload(table.getRowModel().rows, 'CSV', 'Page Rows')}>Linhas da página (CSV)</MenuItem>
                    <Divider />
                    {/* Selected Rows */}
                    <MenuItem onClick={() => handleDownload(table.getSelectedRowModel().rows, 'XLSX', 'Selected Rows')}>Linhas selecionadas (XLSX)</MenuItem>
                    <MenuItem onClick={() => handleDownload(table.getSelectedRowModel().rows, 'CSV', 'Selected Rows')}>Linhas selecionadas (CSV)</MenuItem>
                </Menu>
            </Box>
        ),
    });

    return <MaterialReactTable table={table} />;
};

const ExampleWithLocalizationProvider = () => (
    //App.tsx or AppProviders file
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="br">
        <Example />
    </LocalizationProvider>
);

export default ExampleWithLocalizationProvider;
