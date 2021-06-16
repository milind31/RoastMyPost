import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Nav from './navbar';

const styles = (() => ({
    link: {
        decoration: 'none',
        color: '#ed6c09',
    },
}));

class PostNotFound extends Component {
    render() {
        const { classes } = this.props;
        return(
                <div>
                    <Nav/>
                    <h1 style={{paddingTop:'250px'}}>This user has not created a post</h1>
                    <p style={{fontSize: '175%', paddingBottom:'25px'}}>What a wuss...</p>
                    <a className={classes.link} href='/' style={{textDecoration: 'none'}}>Take me back home</a>
                </div>
            )
    } 
}

export default (withStyles(styles)(PostNotFound));
