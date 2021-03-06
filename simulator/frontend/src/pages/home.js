import React, { useState, createContext, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import '../App.css';
import deleteReq from '../universalHTTPRequests/delete';
import post from '../universalHTTPRequests/post';
import get from '../universalHTTPRequests/get';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Button, Tabs, Tab, Box, Typography } from '@material-ui/core';
import ScenarioCard from './components/scenarioCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorIcon from '@material-ui/icons/Error';
import RefreshIcon from '@material-ui/icons/Refresh';
import CodeButton from './components/classCodeDialog';
import ProgressBar from './components/progressBar';
import { STUDENT_ID,changeID } from './../constants/config';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  errorContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    background: theme.palette.primary,
    '&:hover': {
      transform: "scale3d(1.05, 1.05, 1)",
      backgroundColor: '#f3e4e3'

    }
  },

  button: {
    variant: 'contained',
    color: 'primary',
  },
  grid: {
    justifyContent: "center",
    textAlign: "center",
    width: '100%',
    margin: '0px',
  },
  button: {
    variant: 'contained',
    color: 'white',
    background: 'black',
  },

}));

const endpointGet = '/scenarios?userId=';
const endpointPost = '/dashboard';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#000',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(18),
    backgroundColor: 'white',
    //backgroundColor: '#d9d9d9',
    '&:hover': {
      backgroundColor: '#8c8c8c',
      color: 'white',
      opacity: 1,
      selected: {
        backgroundColor: '#8c8c8c'
      }

    },
  },
}))((props) => <Tab disableRipple {...props} />);

const StyledTabs = withStyles({
  root: {

  },

  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 200,
      width: '100%',
      backgroundColor: '#881c1c',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

export default function Home() {
  const classes = useStyles();


  // post on success, concatenating a scenario card to array
  //delete on success, concatenating a scenario card to array

  //when posting a new scenario setting fake id, now deleting that scenario, have to replace id with id in database

  //post returns new id of scenario, when you concatenating to array set the id to that
  const [menuCourseItems, setMenuCourseItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [scenarioList, setScenarioList] = useState({     //temporary array of scenarios
      incompleteScenarios: [
        {
          title: " ",
          course: " ",
          num_conversations: 0,
          is_finished: false,
          first_page: 0,
          date: " ",
          completed: 10,
          max: 10,
        }
      ],
      completeScenarios: [
        {
          title: " ",
          num_conversations: 0,
          is_finished: true,
          first_page: 0,
          course: " ",
          date: " ",
          completed: 10,
          max: 10,
        }
      ]
    });
  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });


  
  // // eslint-disable-next-line
  // const [fetchCourseResponse, setFetchCourseResponse] = useState({
  //     data: null,
  //     loading: false,
  //     error: null,
  // });
  // eslint-disable-next-line
  const [shouldFetch, setShouldFetch] = useState(0);
  // eslint-disable-next-line

  //Get Scenario
  let getData = () => {
    function onSuccess(response) {
      let incomplete = response.data.result.filter(
        (data) => !data.is_finished
      );
      let complete = response.data.result.filter(
          (data) => data.is_finished
      );
      incomplete = incomplete.map((data) => (
        {
          title: data.name,
          num_conversations: data.num_conversation,
          is_finished: data.is_finished,
          date: data.date_created,
          version_id: data.version_id,
          first_page: data.first_page, 
          course: data.course_name
        }
      ));
      complete = complete.map((data) => (
        {
          title: data.name,
          num_conversations: data.num_conversation,
          is_finished: data.is_finished,
          date: data.last_date_modified,
          version_id: data.version_id,
          first_page: data.first_page,
          course: data.course_name
        }
      ));
      let scen = {
        incompleteScenarios: incomplete,
        completeScenarios: complete
      };
      setScenarioList(scen);
      debugger;
    }

    function onFailure() {
      //setErrorBannerMessage('Failed to get scenarios! Please try again.');
      //setErrorBannerFade(true);
    }
    get(setFetchScenariosResponse, (endpointGet + STUDENT_ID), onFailure, onSuccess);
  };

  // //Get Courses
  // let getCourses = () => {
  //     function onSuccessCourse(response) {
  //         setMenuCourseItems(response.data);
  //     }

  //     function onFailureCourse() {
  //         setErrorBannerMessage('Failed to get courses! Please try again.');
  //         setErrorBannerFade(true);
  //     }
  //     get(
  //         setFetchCourseResponse,
  //         endpointGetCourses,
  //         onFailureCourse,
  //         onSuccessCourse
  //     );
  // };


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(getData, [shouldFetch]);

  if (fetchScenariosResponse.loading) {
    return (
      <div>
        <div style={{ marginTop: '100px' }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (fetchScenariosResponse.error) {
    return (
      <div>
        <div className={classes.issue}>
          <div className={classes.errorContainer}>
            <ErrorIcon className={classes.iconError} />
            <Typography align="center" variant="h3">
              Error in fetching Scenarios.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={getData}
            >
              <RefreshIcon className={classes.iconRefreshLarge} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <StyledTabs value={value} variant='fullWidth' centered onChange={handleChange} aria-label="simple tabs example">
        <StyledTab label="In Progress Scenarios" {...a11yProps(0)} />
        <StyledTab label="Completed Scenarios" {...a11yProps(1)} />
      </StyledTabs>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2} className={classes.grid}>   {/*incomplete scenarios section*/}
          <Grid container direction="row" item xs={12} justify="space-evenly" alignItems="baseline">
            <h1>To-Do</h1>
          </Grid>
          {scenarioList.incompleteScenarios.map(scenario => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Paper elevation={5} className={classes.paper}>
                <ScenarioCard
                  finished={false}
                  title={scenario.title}
                  course = {scenario.course}
                  date={scenario.date}
                />
                <Button
                    component={Link}
                    to={{
                        pathname: '/simulation/'+scenario.version_id+'/'+scenario.first_page,
                        data: scenario,
                    }}
                    className={classes.button}
                    variant="contained"
                    color="primary"
                >Select Scenario</Button>
                {/* <Button onClick={() => {
                  changeID(scenario.version_id)
                  //TEMPORARY SOLUTION
                  window.location.href="/simulation";
                }} className={classes.button}>Select Scenario</Button> */}
                {/* <ProgressBar completed={scenario.completed} max={scenario.max} size={10} /> */}
              </Paper>
            </Grid>
          ))}
          {/* <Grid container direction="row" item xs={12} justify="space-evenly" alignItems="center">
            <Box m={2} pt={3}>
              <CodeButton />
            </Box>
          </Grid> */}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={2} className={classes.grid}>     {/*completed scenarioList section*/}
          <Grid item xs={12}>
            <h1>Completed</h1>
          </Grid>
          {scenarioList.completeScenarios.map(scenario => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Paper elevation={5} className={classes.paper}>
                <ScenarioCard
                  finished={true}
                  title={scenario.title}
                  course={scenario.course}
                  date={scenario.date}
                />
                <Button
                    component={Link}
                    to={{
                        pathname: '/simulation/'+scenario.version_id+'/'+scenario.first_page,
                        data: scenario,
                    }}
                    className={classes.button}
                    variant="contained"
                    color="primary"
                >Review Scenario</Button>
                {/* <ProgressBar completed={scenario.completed} max={scenario.max} size={10} /> */}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </TabPanel>



    </div>
  );
}
