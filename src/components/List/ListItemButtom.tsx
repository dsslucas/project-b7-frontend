import React from "react"
import { Divider, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

interface ListItemButtonInterface {
    sx: Object,
    children?: React.ReactNode;
    icon: React.ReactNode;
    text: string;
    isMenuList?: boolean;
}

// Used for LinkComponent.tsx and Button (scroll to top)
const ListItemButtomComponent: React.FC<ListItemButtonInterface> = (props: ListItemButtonInterface) => {
    if (props.isMenuList) {
        return <ListItemButton sx={props.sx}>
            <Divider sx={{
                display: "flex",
                justifyContent: "center",
                width: "65px",
                lineHeight: 0
            }}>
                {props.icon}
            </Divider>
            <ListItemText
                inset
                primary={props.text}
                sx={{
                    padding: 0,
                    maxWidth: "70%"
                }}
            />
        </ListItemButton>
    }
    else return <></>
}

export default ListItemButtomComponent;