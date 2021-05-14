import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Avatar, Button, Box, DialogTitle } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import BasicTable from './table';
import QuestionFields from './StakeholderQuestions/questions';
import SunEditor from 'suneditor-react';
import Body from './SunEditor';
import 'suneditor/dist/css/suneditor.min.css';
import PropTypes from 'prop-types';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SuccessBanner from './../../../Banners/SuccessBanner';
import ErrorBanner from './../../../Banners/ErrorBanner';
//import LoadingSpinner from './../../../LoadingSpinner';
import GenericDeleteWarning from '../../../WarningDialogs/GenericDeleteWarning';
import GenericUnsavedWarning from '../../../WarningDialogs/GenericUnsavedWarning';
import get from './../../../../universalHTTPRequests/get';
import put from './../../../../universalHTTPRequests/put';
import GlobalUnsavedContext from '../../../Context/GlobalUnsavedContext';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    containerRow: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    containerColumn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
    },
    image: {
        width: '80%',
        height: '80%',
    },
    spacing: {
        margin: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
        textTransform: 'unset',
        height: '32px',
    },
    dialog: {
        overflowX: 'hidden',
    },
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5),
    },
    exitOutButton: {
        margin: theme.spacing(1),
        marginLeft: 'auto',
        float: 'right',
        height: '32px',
    },
    input: {
        display: 'none',
    },
    label: {
        color: '#808080',
        fontSize: 15,
    },
}));

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

Stakeholder.propTypes = {
    name: PropTypes.string,
    bio: PropTypes.string,
    mainConvo: PropTypes.string,
    id: PropTypes.number,
    removeStakeholder: PropTypes.any,
    job: PropTypes.string,
    photo: PropTypes.any,
    stakeholders: PropTypes.any,
    setStakeholders: PropTypes.func,
    scenario: PropTypes.number,
    version: PropTypes.number,
};

const endpointPUT = '/api/stakeholders/';
export default function Stakeholder({
    name,
    bio,
    mainConvo,
    id,
    removeStakeholder,
    job,
    photo,
    stakeholders,
    setStakeholders,
    scenario,
    version,
}) {
    const classes = useStyles();

    const [openBio, setOpenBio] = useState(false);
    const [openMainConvo, setOpenMainConvo] = useState(false);
    const [openPointSelection, setOpenPointSelection] = useState(false);
    const [openQuestions, setOpenQuestions] = useState(false);
    const [stakeholderName, setStakeholderName] = useState(name);
    const [stakeholderJob, setStakeholderJob] = useState(job);
    const [stakeholderBiography, setStakeholderBiography] = useState(bio);
    const [stakeholderPhoto, setStakeholderPhoto] = useState(photo); // Image object to be uploaded on save
    const [stakeholderConversation, setStakeholderConversation] = useState(
        mainConvo
    );
    const [displayedPhoto, setdisplayedPhoto] = useState(photo); // Local image to be displayed

    const [errorBody, setErrorBody] = useState(false);
    const [stakeholderPUT, setStakeholderPUT] = useState({
        data: null,
        loading: false,
        error: null,
    });
    const [stakeholderObj, setStakeholderObj] = useState({
        DESCRIPTION: bio,
        INTRODUCTION: mainConvo,
        JOB: job,
        NAME: name,
        PHOTO: photo,
        SCENARIO: scenario,
        STAKEHOLDER: id,
        VERSION: version,
    });
    const [unsavedMainConvo, setUnsavedMainConvo] = useState(false);
    const [unsavedBio, setUnsavedBio] = useState(false);
    const [unsavedQuestions, setUnsavedQuestions] = useState(false);
    const [unsavedPointSelection, setUnsavedPointSelection] = useState(false);
    const [generalUnsaved, setGeneralUnsaved] = useState(false);
    // eslint-disable-next-line
    const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);

    //used for delete warning dialog
    const [openDeleteWarningDialog, setOpenDeleteWarningDialog] = useState(
        false
    );

    const handleOpenDeleteWarningDialog = () => {
        setOpenDeleteWarningDialog(true);
    };

    //used for unsaved warning dialog
    const [openUnsavedWarningDialog, setOpenUnsavedWarningDialog] = useState(
        false
    );
    const handleOpenUnsavedWarningDialog = () => {
        setOpenUnsavedWarningDialog(true);
    };
    //for success and error banners
    // eslint-disable-next-line
    const [successBannerMessage, setSuccessBannerMessage] = useState('');
    const [successBannerFade, setSuccessBannerFade] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSuccessBannerFade(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [successBannerFade]);

    const [errorBannerMessage, setErrorBannerMessage] = useState('');
    const [errorBannerFade, setErrorBannerFade] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setErrorBannerFade(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [errorBannerFade]);

    //TABLE
    const handleClickOpenBio = () => {
        setOpenBio(true);
    };
    const handleCloseBio = () => {
        setUnsavedBio(false);
        setOpenUnsavedWarningDialog(false);
        setOpenBio(false);
        updateStakeholderInfo(
            stakeholderName,
            stakeholderJob,
            stakeholderBiography,
            stakeholderConversation
        );
    };
    const handleClickOpenMainConvo = () => {
        setOpenMainConvo(true);
    };
    const handleCloseMainConvo = () => {
        setUnsavedMainConvo(false);
        setOpenUnsavedWarningDialog(false);
        setOpenMainConvo(false);
        updateStakeholderInfo(
            stakeholderName,
            stakeholderJob,
            stakeholderBiography,
            stakeholderConversation
        );
    };

    const handleClickOpenPointSelection = () => {
        getIssues();
    };
    const handleClosePointSelection = () => {
        setUnsavedPointSelection(false);
        setOpenUnsavedWarningDialog(false);
        setOpenPointSelection(false);
    };

    const handleClickOpenQuestions = () => {
        getQRs();
    };
    const handleCloseQuestions = () => {
        setUnsavedQuestions(false);
        setOpenUnsavedWarningDialog(false);
        setOpenQuestions(false);
    };

    let handleChangeBiography = (content, firstTime) => {
        if (!firstTime) {
            setUnsavedBio(true);
        } else {
            setUnsavedBio(false);
        }
        updateStakeholderInfo(
            stakeholderName,
            stakeholderJob,
            content,
            stakeholderConversation
        );
    };

    let handleChangeConversation = (content, firstTime) => {
        if (!firstTime) {
            setUnsavedMainConvo(true);
        } else {
            setUnsavedMainConvo(false);
        }
        updateStakeholderInfo(
            stakeholderName,
            stakeholderJob,
            stakeholderBiography,
            content
        );
    };

    const onChangeName = (e) => {
        setGeneralUnsaved(true);
        setGlobalUnsaved(true);
        setStakeholderName(e.target.value);
        updateStakeholderInfo(
            e.target.value,
            stakeholderJob,
            stakeholderBiography,
            stakeholderConversation,
            stakeholderPhoto
        );
    };

    const onChangeJob = (e) => {
        setGeneralUnsaved(true);
        setGlobalUnsaved(true);
        setStakeholderJob(e.target.value);
        updateStakeholderInfo(
            stakeholderName,
            e.target.value,
            stakeholderBiography,
            stakeholderConversation,
            stakeholderPhoto
        );
    };

    const onUploadPhoto = (e) => {
        // Uses PUT request to upload photo to database
        setGeneralUnsaved(true);
        setGlobalUnsaved(true);
        var image = e.target.files[0];
        var url = URL.createObjectURL(image);
        setdisplayedPhoto(url);
        setStakeholderPhoto(image);
        updateStakeholderInfo(
            stakeholderName,
            stakeholderJob,
            stakeholderBiography,
            stakeholderConversation,
            image
        );
    };

    //Deals with bug of updateStakeholderInfo being called on initial load (because of SunEditor)
    //Don't want to set unsaved to false
    const [firstLoad, setFirstLoad] = useState(true);
    const updateStakeholderInfo = (shname, shjob, shbio, shconvo, shphoto) => {
        const updatedStakeholders = [...stakeholders];
        setStakeholders(
            updatedStakeholders.map((sh) => {
                if (sh.STAKEHOLDER === id) {
                    sh.NAME = shname;
                    sh.JOB = shjob;
                    sh.DESCRIPTION = shbio;
                    sh.INTRODUCTION = shconvo;
                    sh.PHOTO = shphoto;
                    if (!firstLoad) {
                        sh.unsaved = true;
                    } else {
                        setFirstLoad(false);
                    }
                }
                return sh;
            })
        );
        setStakeholderObj({
            ...stakeholderObj,
            NAME: shname,
            JOB: shjob,
            DESCRIPTION: shbio,
            INTRODUCTION: shconvo,
            PHOTO: shphoto,
        });
    };

    const [getQRsObj, setGetQRsObj] = useState({
        data: null,
        loading: false,
        error: null,
    });
    function getQRs() {
        const getEndpointQRs = '/api/conversations/?STAKEHOLDER=' + id;
        function onSuccess() {
            setOpenQuestions(true);
        }
        function onError(resp) {
            setErrorBannerMessage(
                'Failed to get stakeholder questions and answers! Please try again.'
            );
            setErrorBannerFade(true);
        }
        get(setGetQRsObj, getEndpointQRs, onError, onSuccess);
    }

    const [getIssuesObj, setGetIssuesObj] = useState({
        data: null,
        loading: false,
        error: null,
    });
    function getIssues() {
        const getEndpointIssues = '/coverages?stakeholder_id=';
        function onSuccess() {
            setOpenPointSelection(true);
        }
        function onError(resp) {
            setErrorBannerMessage(
                'Failed to get the issue(s) for this stakeholder! Please try again.'
            );
            setErrorBannerFade(true);
        }
        get(setGetIssuesObj, getEndpointIssues + id, onError, onSuccess);
    }

    const [error, setError] = useState(false);
    const saveStakeholders = (e) => {
        function onSuccess(resp) {
            let arr = [...stakeholders];
            arr = arr.map((obj) => {
                if (obj.STAKEHOLDER === resp.data.STAKEHOLDER) {
                    delete obj.unsaved;
                }
                return obj;
            });
            if (!arr.some((obj) => obj.unsaved)) {
                setGlobalUnsaved(false);
            }
            setStakeholders(arr);
            setGeneralUnsaved(false);
            setUnsavedBio(false);
            setUnsavedMainConvo(false);
            setStakeholderBiography(resp.data.DESCRIPTION);
            setStakeholderConversation(resp.data.INTRODUCTION);
            setSuccessBannerMessage('Successfully saved the stakeholder!');
            setSuccessBannerFade(true);
        }
        function onError(resp) {
            setErrorBannerMessage(
                'Failed to save Stakeholders! Please try again.'
            );
            setErrorBannerFade(true);
        }

        if (
            !stakeholderObj.DESCRIPTION ||
            !stakeholderObj.DESCRIPTION.trim() ||
            !stakeholderObj.INTRODUCTION ||
            !stakeholderObj.INTRODUCTION.trim()
        ) {
            setErrorBody(true);
            return;
        }
        setErrorBody(false);

        if (
            !stakeholderObj.JOB ||
            !stakeholderObj.JOB.trim() ||
            !stakeholderObj.NAME ||
            !stakeholderObj.NAME.trim()
        ) {
            setError(true);
            return;
        }
        setError(false);

        //1 second of timeout needed for text editor to save data
        setTimeout(
            () =>
                put(
                    setStakeholderPUT,
                    endpointPUT + id + '/',
                    onError,
                    onSuccess,
                    stakeholderObj
                ),
            1000
        );
    };

    /*
        if (stakeholderPUT.loading || isLoading) {
            return <LoadingSpinner />;
        }
    */

    return (
        <div id="parent">
            <SuccessBanner
                successMessage={successBannerMessage}
                fade={successBannerFade}
            />
            <ErrorBanner
                errorMessage={errorBannerMessage}
                fade={errorBannerFade}
            />
            {generalUnsaved ? (
                <Typography
                    style={{ marginLeft: '30px' }}
                    variant="h6"
                    align="center"
                    color="error"
                >
                    Unsaved
                </Typography>
            ) : null}
            {error ? (
                <Typography
                    style={{ marginLeft: '5px' }}
                    variant="h6"
                    align="center"
                    color="error"
                >
                    Fields cannot be empty.
                </Typography>
            ) : null}
            <div className={classes.containerRow}>
                <div id="SHname" className={classes.spacing}>
                    <TextField
                        label="Stakeholder Name"
                        value={stakeholderName}
                        onChange={onChangeName}
                    />
                </div>
                <div id="SHjob" className={classes.spacing}>
                    <TextField
                        label="Stakeholder Job"
                        value={stakeholderJob}
                        onChange={onChangeJob}
                    />
                </div>
            </div>

            <Box display="flex" flexDirection="row">
                <Box
                    p={1}
                    className={classes.containerColumn}
                    style={{ width: '25%' }}
                >
                    <Avatar
                        id="SHimg"
                        src={displayedPhoto}
                        className={classes.image}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        className={classes.button}
                    >
                        Select Image
                        <input
                            accept="image/jpeg, image/png"
                            type="file"
                            multiple={false}
                            hidden
                            onChange={onUploadPhoto}
                        />
                    </Button>
                </Box>

                <Box p={1} style={{ width: '75%' }}>
                    <div id="Bio">
                        <Typography
                            className={classes.label}
                            variant="h6"
                            color="initial"
                        >
                            Biography
                        </Typography>
                        <div onClick={handleClickOpenBio}>
                            <SunEditor
                                setContents={bio}
                                disable={true}
                                showToolbar={false}
                                setOptions={{
                                    width: 500,
                                    height: 1,
                                    placeholder:
                                        'Enter the biography of the stakeholder...',
                                    resizingBar: false,
                                    showPathLabel: false,
                                }}
                            />
                        </div>
                    </div>

                    <div id="MainConversationField">
                        <Typography
                            className={classes.label}
                            variant="h6"
                            color="initial"
                        >
                            Main Conversation
                        </Typography>
                        <div onClick={handleClickOpenMainConvo}>
                            <SunEditor
                                setContents={mainConvo}
                                disable={true}
                                showToolbar={false}
                                setOptions={{
                                    width: 500,
                                    height: 1,
                                    placeholder:
                                        'Enter the main conversation of the stakeholder...',
                                    resizingBar: false,
                                    showPathLabel: false,
                                }}
                                onChange={handleChangeConversation}
                            />
                        </div>
                    </div>
                </Box>
            </Box>

            <div className={classes.containerRow}>
                <div id="SaveButton">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={saveStakeholders}
                        className={classes.button}
                    >
                        Save
                    </Button>
                </div>

                <div id="DeleteButton">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenDeleteWarningDialog}
                        className={classes.button}
                    >
                        Delete
                    </Button>

                    <GenericDeleteWarning
                        remove={() => removeStakeholder(id)}
                        setOpen={setOpenDeleteWarningDialog}
                        open={openDeleteWarningDialog}
                    />
                </div>

                <div id="PointButton">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpenPointSelection}
                        className={classes.button}
                    >
                        Point Selection
                    </Button>
                </div>

                <div id="stakequestion">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpenQuestions}
                        className={classes.button}
                    >
                        View Questions
                    </Button>
                </div>
            </div>

            <Dialog
                onClose={handleCloseBio}
                aria-labelledby="customized-dialog-title"
                open={openBio}
                maxWidth="lg"
                fullWidth={true}
                className={classes.dialog}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
            >
                <GenericUnsavedWarning
                    func={handleCloseBio}
                    setOpen={setOpenUnsavedWarningDialog}
                    open={openUnsavedWarningDialog}
                />
                <div>
                    <DialogTitle
                        disableTypography={true}
                        style={{ display: 'flex' }}
                    >
                        <Typography
                            variant="h5"
                            align="center"
                            component="div"
                            style={{ display: 'flex' }}
                        >
                            Biography
                        </Typography>
                        <div className={classes.containerRow}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={saveStakeholders}
                                className={classes.button}
                                style={{ marginRight: '10px' }}
                            >
                                Save
                            </Button>
                        </div>
                        <Button
                            className={classes.exitOutButton}
                            variant="contained"
                            color="primary"
                            disabled={stakeholderPUT.loading}
                            onClick={
                                unsavedBio
                                    ? handleOpenUnsavedWarningDialog
                                    : handleCloseBio
                            }
                        >
                            <HighlightOffIcon />
                        </Button>
                    </DialogTitle>
                    <DialogContent className={classes.dialog}>
                        {unsavedBio ? (
                            <Typography
                                style={{ marginLeft: '3%', marginTop: '-20px' }}
                                variant="h6"
                                align="center"
                                color="error"
                            >
                                Unsaved
                            </Typography>
                        ) : null}
                        <Body
                            body={bio}
                            setBody={handleChangeBiography}
                            error={errorBody}
                            errorMessage={
                                'Stakeholder biography cannot be empty'
                            }
                        />
                    </DialogContent>
                </div>
            </Dialog>

            <Dialog
                onClose={handleCloseMainConvo}
                aria-labelledby="customized-dialog-title"
                maxWidth="lg"
                fullWidth={true}
                open={openMainConvo}
                className={classes.dialog}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
            >
                <GenericUnsavedWarning
                    func={handleCloseMainConvo}
                    setOpen={setOpenUnsavedWarningDialog}
                    open={openUnsavedWarningDialog}
                />
                <div>
                    <DialogTitle
                        disableTypography={true}
                        style={{ display: 'flex' }}
                    >
                        <Typography
                            variant="h5"
                            align="center"
                            component="div"
                            style={{ display: 'flex' }}
                        >
                            Main Conversation
                        </Typography>
                        <div className={classes.containerRow}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={saveStakeholders}
                                className={classes.button}
                                style={{ marginRight: '30px' }}
                            >
                                Save
                            </Button>
                        </div>
                        <Button
                            className={classes.exitOutButton}
                            variant="contained"
                            color="primary"
                            disabled={stakeholderPUT.loading}
                            onClick={
                                unsavedMainConvo
                                    ? handleOpenUnsavedWarningDialog
                                    : handleCloseMainConvo
                            }
                        >
                            <HighlightOffIcon />
                        </Button>
                    </DialogTitle>
                    <DialogContent className={classes.dialog}>
                        {unsavedMainConvo ? (
                            <Typography
                                style={{ marginLeft: '5%', marginTop: '-20px' }}
                                variant="h6"
                                align="center"
                                color="error"
                            >
                                Unsaved
                            </Typography>
                        ) : null}
                        <Body
                            body={mainConvo}
                            setBody={handleChangeConversation}
                            error={errorBody}
                            errorMessage={
                                'Stakeholder biography cannot be empty'
                            }
                        />
                    </DialogContent>
                </div>
            </Dialog>

            <Dialog
                onClose={handleCloseQuestions}
                aria-labelledby="customized-dialog-title"
                open={openQuestions}
                maxWidth="md"
                fullWidth={true}
                className={classes.dialog}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
            >
                <GenericUnsavedWarning
                    func={handleCloseQuestions}
                    setOpen={setOpenUnsavedWarningDialog}
                    open={openUnsavedWarningDialog}
                />
                <DialogTitle
                    disableTypography={true}
                    style={{ display: 'flex' }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        component="div"
                        style={{ display: 'flex' }}
                    >
                        Stakeholder Questions and Answers
                    </Typography>
                    <Button
                        className={classes.exitOutButton}
                        variant="contained"
                        color="primary"
                        disabled={stakeholderPUT.loading}
                        onClick={
                            unsavedQuestions
                                ? handleOpenUnsavedWarningDialog
                                : handleCloseQuestions
                        }
                    >
                        <HighlightOffIcon />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <QuestionFields
                        setErrorBannerFade={setErrorBannerFade}
                        setErrorBannerMessage={setErrorBannerMessage}
                        setSuccessBannerMessage={setSuccessBannerMessage}
                        setSuccessBannerFade={setSuccessBannerFade}
                        setUnsaved={setUnsavedQuestions}
                        unsaved={unsavedQuestions}
                        qrs={getQRsObj.data ? getQRsObj.data : []}
                        stakeholder_id={id}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                onClose={handleClosePointSelection}
                aria-labelledby="customized-dialog-title"
                open={openPointSelection}
                maxWidth="lg"
                fullWidth={true}
                className={classes.dialog}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
            >
                <GenericUnsavedWarning
                    func={handleClosePointSelection}
                    setOpen={setOpenUnsavedWarningDialog}
                    open={openUnsavedWarningDialog}
                />
                <DialogTitle
                    disableTypography={true}
                    style={{ display: 'flex' }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        component="div"
                        style={{ display: 'flex' }}
                    >
                        Stakeholder Questions and Answers
                    </Typography>
                    <Button
                        className={classes.exitOutButton}
                        variant="contained"
                        color="primary"
                        disabled={stakeholderPUT.loading}
                        onClick={
                            unsavedPointSelection
                                ? handleOpenUnsavedWarningDialog
                                : handleClosePointSelection
                        }
                    >
                        <HighlightOffIcon />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <BasicTable
                        setErrorBannerFade={setErrorBannerFade}
                        setErrorBannerMessage={setErrorBannerMessage}
                        setSuccessBannerMessage={setSuccessBannerMessage}
                        setSuccessBannerFade={setSuccessBannerFade}
                        setUnsaved={setUnsavedPointSelection}
                        unsaved={unsavedPointSelection}
                        stakeholder_id={id}
                        passed_issues={
                            getIssuesObj.data ? getIssuesObj.data.ISSUES : []
                        }
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
