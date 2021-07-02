//React
import React, { Component } from 'react';
import Nav from './navbar';

//Redux
import { connect } from 'react-redux';
import { setUsername } from './actions/index';

//React Bootstrap
import Form from 'react-bootstrap/Form';
import SubmitButton from 'react-bootstrap/Button';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";

//Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

//Toasts
import { errorToast } from './utils/toast';

//Profanity Checker
var Filter = require("bad-words");

const styles = {
    container: {
        background: "#333131"
    },
    header: {
        position: 'fixed',
        top: '38%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    bodyDiv: {
        width:'60%'
    },
    warning: {
        width:'15%', 
        textAlign: 'center'
    },
    form: {
        marginTop:'10px'
    },
}

class SetUsername extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.setUsername = this.setUsername.bind(this);
    
        this.state = {username: ''};
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            //user is logged in
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }
    
    onChangeUsername(e) {
        //don't allow user to enter space in username
        if (e.target.value.slice(-1) === ' ') {
            return
        }
    
        this.setState({
            username: e.target.value
        });
    }

    setUsername() {
        let uid = this.props.uid;
        let enteredUsername = this.state.username;
        var t = this;

        var filter = new Filter();
        if (filter.isProfane(enteredUsername)) {
            errorToast("Username must not contain any inappropriate language!");
            return
        }

        //Check if username is between 4-15 characters
        if (enteredUsername.length > 15 || enteredUsername.length < 4){
            errorToast("Username must be between 4-15 characters!");
            return
        }

        //Check if username already exists
        firebase.firestore().collection('users').where('username', '==', enteredUsername).limit(1).get()
        .then(function (querySnapshot) {
            if (!querySnapshot.empty) {
                errorToast('Username already exists, please try again');
            }
            else {
                firebase.firestore().collection("users").doc(uid).update({
                    username: enteredUsername,
                    usernameCreated: true
                })
                .then(() => t.props.setUsername(enteredUsername))
                .then(() => {window.location = '/'})
                .catch((err) => console.log("error", err))
            }
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Nav/>
                <div className={classes.header}>
                <h1>Set Username</h1>
                <Form>
                    <div className={classes.bodyDiv}>
                        <strong className={classes.warning}>
                            Note: You can only set your username once. Make sure you really like it!
                        </strong>
                        <Form.Group className={classes.form} controlId="exampleForm.ControlTextarea1">
                            <Form.Control 
                            onChange={this.onChangeUsername}
                            value={this.state.username} 
                            size="sm" as="textarea" rows={1}
                            placeholder="Username..." />
                        </Form.Group>
                        <Form.Text style={{marginTop: '-10px', paddingBottom: '25px'}} className="text-muted">
                            Username must be between 4-15 characters
                        </Form.Text>
                        <SubmitButton variant="primary" onClick ={() => {this.setUsername()}}>Submit</SubmitButton>
                        </div>
                </Form>
                </div>
            </div>
        );
    }
};

SetUsername.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    uid: state.uid
})

const mapActionsToProps = { setUsername };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(SetUsername));