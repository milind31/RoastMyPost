//React
import React, { Component } from 'react';
import Nav from './navbar';

//Redux
import { connect } from 'react-redux';
import { setSavedPosts, savePost, unsavePost } from './actions/index';

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


const styles = {
    container: {
        background: "#333131"
    },
    header: {
        marginTop: '175px',
        paddingBottom: '20px'

    }
}

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {username: ''};

        this.onChangeUsername = this.onChangeUsername.bind(this);
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

    render() {
        const { classes } = this.props;
        const { saves } = this.props;
        return (
            <div>
                <Nav/>
                <h1 style={{paddingTop: '225px', paddingBottom: '15px'}}>Settings</h1>
                <Form>
                        <Form.Group style={{width:'50%'}} controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{}}>Change Username</Form.Label>
                            <Form.Control 
                            onChange={this.onChangeUsername}
                            value={this.state.username} 
                            size="sm" as="textarea" rows={1}
                            placeholder="Username..." />
                        </Form.Group>
                        <SubmitButton variant="primary" style={{}} type="submit">Submit</SubmitButton>
                </Form>
            </div>
        );
    }
};

Settings.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    saves: state.saves,
    gotSaves: state.gotSaves,
})

const mapActionsToProps = { setSavedPosts, savePost, unsavePost };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Settings));