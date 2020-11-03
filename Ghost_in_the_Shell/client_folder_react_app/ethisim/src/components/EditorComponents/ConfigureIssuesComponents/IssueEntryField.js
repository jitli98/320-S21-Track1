import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import get from '../../../get';
import deleteReq from '../../../delete';
import post from '../../../post';
import put from '../../../put';
import useInterval from '../../../shared/useInterval';

//TODO once scenario dashabord and component/page loading is finished
const tempScenarioID = 1;

//Need scenarioID
const endpointGET = 'http://localhost:8000/api/Issues/?SCENARIO_ID=';

const endpointPOST = 'http://localhost:8000/api/Issues/';
//Need issueID
const endpointPUT = 'http://localhost:8000/api/Issues/';
//Need issueID
const endpointDELETE = 'http://localhost:8000/api/Issues/';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(0.5),
        marginTop: theme.spacing(0),
        width: '100%',
        textTransform: 'unset',
    },
}));

IssueEntryField.propTypes = {
    id: PropTypes.number.isRequired,
    issue: PropTypes.string,
    score: PropTypes.number,
    isNewIssue: PropTypes.bool,
    issueEntryFieldList: PropTypes.any.isRequired,
    setIssueEntryFieldList: PropTypes.any.isRequired,
};

export default function IssueEntryField({
    id,
    issue,
    score,
    isNewIssue,
    setIssueEntryFieldList,
    issueEntryFieldList,
}) {
    const classes = useStyles();
    //TODO replace
    const scenarioID = 1;
    const versionID = 2;

    const [postValue, setPost] = useState({
        data: null,
        loading: true,
        error: null,
    });
    const [putValue, setPut] = useState({
        data: null,
        loading: true,
        error: null,
    });
    const [deleteReqValue, setDeleteReq] = useState({
        data: null,
        loading: true,
        error: null,
    });
    const [issueID, setIssueID] = useState(id);
    const [issueScore, setIssueScore] = useState(score ? score : 0);
    const [issueName, setIssueName] = useState(issue ? issue : 0);
    const [newIssue, setNewIssue] = useState(isNewIssue);

    //const [processed, setProcessed] = useState(true);

    //const [newList, setNewList] = useState(issueEntryFieldList);
    //const [newValue, setNewValue] = useState(newList.data ? newList.data.length : 0);

    /*
    function poll() {
        console.log("POLL");
        console.log(newValue);
        if(newList.data) {
            console.log(newList.data.length);
        }
        get(setNewList, endpointGET + tempScenarioID);
        if(newList.data && newList.data.length === newValue) {
            setIssueEntryFieldList(newList);
            setProcessed(true);
        }
    }   
    */

    //useInterval(poll, processed ? null : 500);

    const handleChangeScore = (content) => {
        setIssueScore(content.target.value);
    };

    const handleChangeName = (content) => {
        setIssueName(content.target.value);
    };

    const saveIssue = () => {
        if (newIssue) {
            function setID(resp) {
                //if newly created issue, replace fake ID with new ID
                if (resp.data) {
                    setIssueID(resp.data.ISSUE_ID);
                }
            }
            post(setPost, endpointPOST, null, setID, {
                SCENARIO_ID: scenarioID,
                VERSION_ID: versionID,
                IMPORTANCE_SCORE: issueScore,
                NAME: issueName,
            });
            setNewIssue(false);
        } else {
            put(setPut, endpointPUT + id + '/', null, null, {
                SCENARIO_ID: scenarioID,
                VERSION_ID: versionID,
                IMPORTANCE_SCORE: issueScore,
                NAME: issueName,
                ISSUE_ID: id,
            });
        }
    };

    const deleteIssue = () => {
        //remove issue from array, id represents the id in issueEntryFieldList
        //If issue is a new issue, A POST request will replace the fake ID with the ID in database
        //ID in the array will remain the fake id, so that is why we compare with 'id' rather than 'issueID'
        let newData = issueEntryFieldList.data.filter(
            (entry) => entry.ISSUE_ID !== id
        );
        setIssueEntryFieldList({ ...issueEntryFieldList, data: newData });
        if (!newIssue) {
            deleteReq(
                setDeleteReq,
                endpointDELETE + issueID + '/',
                null,
                null,
                {
                    SCENARIO_ID: scenarioID,
                    ISSUE_ID: issueID,
                }
            );
        }
    };

    return (
        <div>
            {newIssue ? (
                <Typography variant="h6" align="center" color="error">
                    Unsaved
                </Typography>
            ) : null}
            <Box display="flex" flexDirection="row" p={1} m={1}>
                <Box p={1}>
                    <TextField
                        style={{ width: '75%' }}
                        id="outlined-text"
                        label="Issue"
                        value={issueName}
                        onChange={handleChangeName}
                        multiline
                        rows={2}
                        variant="outlined"
                    />
                    <TextField
                        style={{ width: '25%' }}
                        margin="normal"
                        id="outlined-number"
                        label="Score"
                        onChange={handleChangeScore}
                        value={issueScore}
                        rows={1}
                        variant="filled"
                    />
                </Box>
                <Box p={1}>
                    <div>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={() => saveIssue(id)}
                        >
                            Save
                        </Button>
                    </div>
                    <div>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={() => deleteIssue()}
                        >
                            Delete
                        </Button>
                    </div>
                </Box>
            </Box>
        </div>
    );
}
