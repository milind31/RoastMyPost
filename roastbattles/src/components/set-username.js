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
import CircularProgress from '@material-ui/core/CircularProgress';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

//Toasts
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const styles = {
    container: {
        background: "#333131"
    },
    header: {
        marginTop: '175px',
        paddingBottom: '20px'

    }
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
        this.setState({
            username: e.target.value
        });
    }

    setUsername() {
        let uid = this.props.uid;
        let enteredUsername = this.state.username;
        var t = this;

        //Check if username already exists
        firebase.firestore().collection('users').where('username', '==', enteredUsername).limit(1).get()
        .then(function (querySnapshot) {
            if (!querySnapshot.empty) {
                toast.error('Username already exists, please try again', {
                    style: { fontFamily: 'Roboto Mono, monospace', textAlign:'left' },
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
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
                <h1 style={{paddingTop: '225px', paddingBottom: '10px'}}>Set Username</h1>
                <Form>
                    <div style={{width:'40%'}}>
                        <strong style={{width:'15%', textAlign: 'center'}}>
                            Note: You can only set your username once. Make sure you really like it!
                        </strong>
                        <Form.Group style={{marginTop:'10px'}} controlId="exampleForm.ControlTextarea1">
                            <Form.Control 
                            onChange={this.onChangeUsername}
                            value={this.state.username} 
                            size="sm" as="textarea" rows={1}
                            placeholder="Username..." />
                        </Form.Group>
                        <SubmitButton variant="primary" style={{}} onClick ={() => {this.setUsername()}}>Submit</SubmitButton>
                        </div>
                </Form>
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