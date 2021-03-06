import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Container,
    Link,
    Grid,
} from '@material-ui/core';
import { DOMAIN } from '../Constants/Config';
import { Link as RouterLink } from 'react-router-dom';
import Copyright from '../components/Copyright';
import RedLogo from '../shared/RedLogo.png';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logo: {
        width: '100px',
    },
    form: {
        marginTop: theme.spacing(1),
        width: '100%',
    },
    submit: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    copyright: {
        margin: theme.spacing(2),
        opacity: 0.5,
    },
}));

export default function Login() {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.container}>
                <img src={RedLogo} alt="EthismLogo" className={classes.logo} />
                <Typography variant="h4">Login (placeholder)</Typography>
                <form className={classes.form}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Grid container direction="column">
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        onClick={() => window.location.href = DOMAIN + ((process.env.NODE_ENV === 'production') ? '/simulator' : ':3001')}
                        className={classes.submit}
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Login for Simulator
                    </Button>
                    <Button
                        onClick={() => window.location.href = DOMAIN + ((process.env.NODE_ENV === 'production') ? '/editor' : ':3000')}
                        className={classes.submit}
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Login for Editor
                    </Button>
                </form>
            </div>
            <Box className={classes.copyright}>
                <Copyright />
            </Box>
        </Container>
    );
}
