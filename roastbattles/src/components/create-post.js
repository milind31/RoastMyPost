import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

const styles = {
    root: {
    }
}

//homepage
class CreatePost extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount = () => {
    }


    render () {
        const { classes } = this.props;
        return (
            <div>
                <h2>Create post...</h2>
                <div>
                    <TextField
                    id="filled-helperText"
                    label="Helper text"
                    defaultValue="Default Value"
                    variant="filled"
                    style={{backgroundColor: "#3b3b3b"}}
                    InputProps={{style: {color: "white"}}}
                    />
                </div>
                <div>
                    <TextField
                    id="filled-helperText"
                    label="Helper text"
                    defaultValue="Default Value"
                    variant="filled"
                    style={{backgroundColor: "#3b3b3b"}}
                    InputProps={{style: {color: "white"}}}
                    />
                </div>
                <div>
                    <TextField
                    id="filled-helperText"
                    label="Helper text"
                    defaultValue="Default Value"
                    variant="filled"
                    style={{backgroundColor: "#3b3b3b"}}
                    InputProps={{style: {color: "white"}}}
                    />
                </div>
                <div>
                    <TextField
                    id="filled-helperText"
                    label="Helper text"
                    defaultValue="Default Value"
                    variant="filled"
                    style={{backgroundColor: "#3b3b3b", marginBottom: '20px'}}
                    InputProps={{style: {color: "white"}}}
                    />
                </div>
                <Button color="primary" variant="outlined">Submit Form</Button>

            </div>
        )
  }
}
CreatePost.propTypes = {
    classes: PropTypes.object.isRequired
}


export default (withStyles(styles)(CreatePost));
