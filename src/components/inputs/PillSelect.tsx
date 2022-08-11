import React, { Component } from "react";
import { Chip, } from "@mui/material";
import { withStyles } from "@mui/styles";

interface PillSelectProps<T extends { [k: string]: string }> {
    values: T,
    onChange: (v:keyof T) => void,
    selected: string[]
}
interface PillSelectState {
    selected: string[]
}

const StyledChip = withStyles({
    root: {},

    label: {
        padding: "0",
    },

})(Chip);
const bluechip = {
    background: "#3E64FF", "&:hover": {
        background: "#3E64FF",
        color: "white",
    }, borderRadius: "5px", color: "white", fontSize: "15px", width: "126px", height: "41px"
};

const greychip = {
    background: "#F0F0F0",
    borderRadius: "5px",
    color: "black",
    fontSize: "15px",
    width: "126px",
    height: "41px"
};

export class PillSelect<T extends { [k: string]: string }> extends Component<PillSelectProps<T>, PillSelectState>
{
    constructor(props: PillSelectProps<T>) 
    {
        super(props);
    }

    render() 
    {
        return Object.entries(this.props.values).map(([value, label], key) => (
            <div key={key} className="child mb-2">
                <StyledChip onClick={() => this.props.onChange(value)}
                    sx={this.props.selected.includes(value) ? bluechip : greychip}
                    label={label} />
            </div>
        ));
    }
}

