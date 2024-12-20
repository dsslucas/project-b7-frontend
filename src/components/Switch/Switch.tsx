import * as React from 'react';
import Switch from '@mui/material/Switch';

interface SwitchInterface {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}


const SwitchComponent: React.FC<SwitchInterface> = (props: any) => {
    return <Switch checked={props.checked} onChange={props.onChange}/>
}

export default SwitchComponent;