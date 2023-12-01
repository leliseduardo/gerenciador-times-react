import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";

export default function ListColumn({handleToggle, items, checked, name}){
  const createList = (items) => {
    return (
      <Paper sx={{ width: 200, height: 230, overflow: "auto" }}>
        <List dense component="div" role="list">
          {Object.entries(items).map(([index, value]) => {
            const labelId = `transfer-list-item-${index}-label`;

            return (
              <ListItem
                key={index}
                role="listitem"
                button
                onClick={() => handleToggle(index, name)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={value.checked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value.label} />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    );
  };

  return createList(items);
}

