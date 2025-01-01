import { UserInterface } from "../../Common/interfaces";
import { MRT_ColumnDef, MRT_RowData, MRT_TableInstance } from "material-react-table";

export interface TableComponentInterface<T extends MRT_RowData> {
    data: T[];
    columns: MRT_ColumnDef<T>[];
    create: (data: T, table: MRT_TableInstance<T>) => void;
    update: (data: T, table: MRT_TableInstance<T>) => void;
    delete: (id: number) => void;
}