import React, { useContext } from "react";
import { withStyles, Typography, Box, Grid, Button } from "@material-ui/core";
import { GatheredInfoContext } from './simulationWindow';
import { BASE_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import axios from 'axios';

const TextTypography = withStyles({
  root: {
    color: "#373a3c"
  }
})(Typography);

function Stakeholders({pages, setPages, activePage, setActivePage}) {

  const [gatheredInfo, setGatheredInfo] = useContext(GatheredInfoContext);

  function goToGatheredInformation(){
    if (!pages.gatheredInformation.visited) {
      setPages(prevPages => {
        let copy = {...prevPages};
        copy.gatheredInformation.visited = true;
        return copy;
      });
    }
    setActivePage(prevPage => 'gatheredInformation')
  }

  function goToMiddleReflection(){
    if (!pages.middleReflection.visited) {
      setPages(prevPages => {
        let copy = {...prevPages};
        copy.middleReflection.visited = true;
        return copy;
      });
      const PAGE_ID_OF_PAGE_BEFORE_CONVERSATIONS = 'gatheredInformation' // TODO: 'gatheredInformation' is the wrong answer here!
      setGatheredInfo(infos => {
        let ind = infos.findIndex(info => info.pageId === PAGE_ID_OF_PAGE_BEFORE_CONVERSATIONS);
        if (ind < 0) { ind = infos.length; }
        let newInfos = [...infos];
        newInfos.splice(ind, 0,
          {name: 'Stakeholder 0', id: 's0', pageId: 'stakeholders'},
          {name: 'Stakeholder 1', id: 's1', pageId: 'stakeholders'}); // placeholder stakeholder values
        return newInfos;
      });
    }
    setActivePage(prevPage => 'middleReflection')
  }
  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt = {5}>
          <TextTypography variant="h4" align="center" gutterBottom>
              Stakeholders
          </TextTypography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
            <Button variant="contained" disableElevation onClick={goToGatheredInformation}>Back</Button>
        </Grid>

        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>

          <Button variant="contained" disableElevation color="primary" onClick={goToMiddleReflection}>Next</Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12}>
          <Box m="2rem">
          </Box>
          <TextTypography variant="body1" align="center">
            Some Stakeholders.
          </TextTypography>
        </Grid>
      </Grid>
    </div>
  );
}

export default Stakeholders;
