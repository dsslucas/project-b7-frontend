import { UserInterface } from "../../Common/interfaces";
import { MRT_ColumnDef, MRT_Row, MRT_TableOptions } from "material-react-table";

export interface TableComponentInterface {
    data: UserInterface[] | any;
    columns: MRT_ColumnDef<UserInterface | any>[];
    create: (data: UserInterface | any) => void;
    update: (data: UserInterface | any) => void;
    delete: (id: number) => void;

}