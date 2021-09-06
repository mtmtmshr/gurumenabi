import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React from "react"


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 180,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

interface CheckboxLabelsProps {
    handleChange: any,
    label: string
    checked: boolean,
}

export function CheckboxLabels (props: CheckboxLabelsProps): any {
    const { handleChange, label, checked } = props;
    return (
        <FormControlLabel
            control={<Checkbox onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.checked)} name={label} checked={checked}/>}
            label={label}
        />
    );
}

interface SimpleSelectProps<T> {
    value:T,
    handleChange:(prm:any) => any,
    target_list: Array<T>,
    title: string,
    disabled: boolean,
}


export function SimpleSelect<T>(props: SimpleSelectProps<T>) :any {
    const { value, handleChange, target_list, title, disabled } = props
    const classes = useStyles();
    return (
        <FormControl className={classes.formControl} disabled={disabled}>
            <InputLabel>{title}</InputLabel>
            <Select
                value={value}
                onChange={(event: React.ChangeEvent<{value: unknown;}>) => handleChange(event.target.value)}
            >
            { target_list.map((item:any) => {
                return <MenuItem value={item} key={item}>{item}</MenuItem>
            })}
            </Select>
        </FormControl>
    );
}
