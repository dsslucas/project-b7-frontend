import React from 'react';

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
} from 'material-react-table';

//Material UI Imports
import {
    Box,
    Button,
    ListItemIcon,
    MenuItem,
    Typography,
    lighten,
} from '@mui/material';

import FileDownloadIcon from '@mui/icons-material/FileDownload';

//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';

//Mock Data
import { data } from './data';

import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here

export type Employee = {
    id: string;
    name: string;
    email: string;
    role: string;
    dateRegister: string;
    action?: any
};

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const Example = () => {
    const handleExportRows = (rows: MRT_Row<Employee>[]) => {
        const visibleColumns = table.getVisibleLeafColumns();
        const visibleColumnIds = visibleColumns
            .map((col) => col.id as keyof Employee)
            .filter((columnId) => columnId !== "action");

        // Filtrar os dados das linhas para incluir apenas as colunas visíveis
        const filteredData = rows.map((row) =>
            visibleColumnIds.reduce((acc, columnId) => {
                acc[columnId] = row.original[columnId]; // Garantir que o acesso está alinhado com a tipagem
                return acc;
            }, {} as Partial<Employee>) // Usar Partial<Employee> para manter tipagem consistente
        );

        // Gerar o CSV apenas com os dados filtrados
        const csv = generateCsv(csvConfig)(filteredData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        // Filtrar os dados para ignorar a coluna "action"
        const filteredData = data.map((row) => {
            const { action, ...rest } = row; // Remove a propriedade "action"
            return rest;
        });
    
        // Gerar o CSV apenas com os dados filtrados
        const csv = generateCsv(csvConfig)(filteredData);
        download(csvConfig)(csv);
    };

    const columns = useMemo<MRT_ColumnDef<Employee>[]>(
        () => [
            {
                id: 'id',
                header: '',
                columns: [
                    {
                        accessorKey: 'name',
                        // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
                        filterFn: 'between',
                        header: 'Nome',
                        size: 100,
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
                    },
                    {
                        accessorKey: 'role',
                        header: 'Cargo',
                    },
                    {
                        accessorFn: (row) => new Date(row.dateRegister), //convert to Date for sorting and filtering
                        id: 'dateRegister',
                        header: 'Data de registro',
                        filterVariant: 'date',
                        filterFn: 'lessThan',
                        sortingFn: 'datetime',
                        Cell: ({ cell }) => {
                            const date = cell.getValue<Date>();
                            if (date instanceof Date && !isNaN(date.getTime())) {
                                // Se for uma data válida, formata para o formato PT-BR
                                return date.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric' });
                            }
                            return 'Data inválida'; // Caso a data seja inválida, retorna uma mensagem amigável
                        },
                        Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
                        muiFilterTextFieldProps: {
                            sx: {
                                minWidth: '250px',
                            },
                        },
                    },
                    {
                        id: 'actions',
                        header: 'Ações',
                        Cell: ({ cell }) => {
                            return <>
                                <Button variant='contained'>A</Button>
                                <Button variant='contained'>B</Button>
                            </>
                        },
                        size: 10,
                    }
                ],
            },
        ],
        [],
    );

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
                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                    onClick={handleExportData}
                    startIcon={<FileDownloadIcon />}
                >
                    Export All Data
                </Button>
                <Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    //export all rows, including from the next page, (still respects filtering and sorting)
                    onClick={() =>
                        handleExportRows(table.getPrePaginationRowModel().rows)
                    }
                    startIcon={<FileDownloadIcon />}
                >
                    Export All Rows
                </Button>
                <Button
                    disabled={table.getRowModel().rows.length === 0}
                    //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                    onClick={() => handleExportRows(table.getRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                >
                    Export Page Rows
                </Button>
                <Button
                    disabled={
                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                    }
                    //only export selected rows
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                >
                    Export Selected Rows
                </Button>
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
