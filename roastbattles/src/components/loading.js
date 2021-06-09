import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    container: {
        background: "#333131",
        backgroundColor: 'transparent',
        margin: '0',
        position: 'absolute',
        top: '50%',
        mstransform: 'translateY(-50%)'
    },
  }));

export default function Loading() {
const classes = useStyles();
    return ( 
        <CircularProgress size={50} className={classes.container}/>
    );
}