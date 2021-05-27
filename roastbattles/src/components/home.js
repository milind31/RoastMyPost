//React
import React, { Component } from 'react';
import Nav from './navbar';

//Material UI
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

//Redux
import { connect } from 'react-redux';
import { Fragment } from 'react';

const styles = {
    button: {
        margin: "10px",
    },
    signOutButton: {
        position: "absolute",
        top: "20px",
        right: "20px"
    },

}

//homepage
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {createdPost: false, userID: ''};

        this.handleAuthChange = this.handleAuthChange.bind(this);

    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            //user is logged in
            this.setState({userID: user.uid})
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }


    render () {
        const { classes } = this.props;

        return (
            <div>
            <div>
                <Nav/>
                <h1>Welcome!</h1>
                {
                    this.props.createdPost ? 
                    <Button 
                        onClick={() => window.location = `/posts/${this.state.userID}` } 
                        variant="outlined" color="secondary"
                        >View My Post
                    </Button> 
                    : 
                    <Button 
                        onClick={() => window.location = '/create-post' }
                        variant="outlined" color="secondary"
                        >Create My Post
                    </Button>
                }
                <Button 
                    onClick={() => window.location = '/posts/ZAYY1HbEpfcJ5Jyoi6xVsD96EGI3' /*TODO: ADD POST ID THROUGH RANDOM DOCUMENT QUERY*/ } 
                    className={classes.button} 
                    variant="outlined" 
                    color="primary"
                    >Find Random Post
                </Button>
            </div>
                <Fragment>
                    <Button 
                    onClick={() => window.location = '/saved' /*TODO: ADD POST ID THROUGH RANDOM DOCUMENT QUERY*/ } 
                    className={classes.savedPostsButton} 
                    variant="outlined" 
                    color="secondary"
                    >Check in on Saved Posts
                    </Button>
                </Fragment>
            </div>
        )
  }
}
Home.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    createdPost: state.createdPost
})

export default connect((mapStateToProps),)(withStyles(styles)(Home));
