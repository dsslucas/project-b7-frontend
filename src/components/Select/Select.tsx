import React from "react"
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { ProfilesTypeInterface } from "../../Common/interfaces";

interface SelectInterface {
    id: string;
    name: string;
    type: string;
    value: string;

    // Optional
    label?: string;
    placeholder?: string;
    autoFocus?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    variant?: "filled" | "outlined" | "standard";
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
    size?: "small" | "medium";
    error?: boolean;
    helperText?: string;
    onChange: (event: SelectChangeEvent) => void
    options: ProfilesTypeInterface[] | any
}

const SelectComponent: React.FC<SelectInterface> = (props: SelectInterface) => {
    return <FormControl size={props.size}>
        <InputLabel id={`${props.id}-label`}>{props.label}</InputLabel>
        <Select
            id={props.id}
            labelId={`${props.id}-label`}
            value={props.value}
            label={props.label}
            onChange={props.onChange}
            size={props.size}
            color={props.color || (props.error ? "error" : "primary")}
        >
            {props.options.map((element: ProfilesTypeInterface, index: number) => {
                return <MenuItem key={index} value={element.value}>{element.label}</MenuItem>
            })}
        </Select>
    </FormControl>
}

export default SelectComponent;