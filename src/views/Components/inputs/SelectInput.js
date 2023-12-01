import React from "react";
import {FormControl , InputLabel} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function SelectInput({label, items, value, name, onChange}) {
    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label-match">
                {label}
            </InputLabel>
            <Select
                fullWidth
                id="demo-simple-select"
                label={label}
                value={value}
                onChange={onChange}
                name={name}
            >
                {Object.entries(items).map(([id, value]) => {
                    return (
                        <MenuItem key={id} value={id}>{value}</MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}