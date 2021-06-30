import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Nav from './navbar';

const styles = (() => ({
    link: {
        decoration: 'none',
        color: '#ed6c09',
    },
    header: {
        position: 'fixed',
        top: '38%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
}));

class PageNotFound extends Component {
    render() {
        const { classes } = this.props;
        return(
            <div>
                <Nav/>
                <div className={classes.header}>
                    <h1>This page does not exist</h1>
                    <p style={{fontSize: '175%', paddingBottom:'25px'}}>Nice going...</p>
                    <a className={classes.link} href='/' style={{textDecoration: 'none'}}>Take me back home</a>
                </div>
            </div>
        )
    } 
}

export default (withStyles(styles)(PageNotFound));
