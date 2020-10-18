import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0.5),
    marginTop: theme.spacing(0),
    width: 50,
    height: "5vh",
  },
}));

export default function InformationItem(props) {
  const classes = useStyles();

  return (
    <div>
      <Box
        display="flex"
        flexDirection="row"
        p={1}
        m={1}
        bgcolor="background.paper"
      >
        <Box p={1}>
          <form noValidate autoComplete="off">
            <TextField
              style={{ width: 500 }}
              id="outlined-multiline-static"
              label="Information Item"
              multiline
              rows={2}
              variant="outlined"
            />
          </form>
        </Box>
        <Box p={1}>
          <div>
            <Button
              className={classes.margin}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </div>
          <div>
            <Button
              className={classes.margin}
              variant="contained"
              color="primary"
              onClick={() => props.onDelete(props.iItem.id)}
            >
              Delete
            </Button>
          </div>
        </Box>
      </Box>
    </div>
  );
}