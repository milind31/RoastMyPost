//React
import React, { Component } from 'react';
import { Fragment } from 'react';
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

const styles = {
    header: {
        paddingTop: '20px'
    },
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

        this.state = {createdPost: false, uid: ''};

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.getNewPost = this.getNewPost.bind(this);

    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            //user is logged in
            this.setState({uid: user.uid})
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }

    getNewPost(e) {
        e.preventDefault();

        var db = firebase.firestore();
        var users = db.collection("users");

        var key = users.doc().id;

        console.log("key", key);
        users.where(firebase.firestore.FieldPath.documentId(), '>=', key).where(firebase.firestore.FieldPath.documentId(), '!=', this.state.uid).limit(1).get()
        .then(snapshot => {
            if(snapshot.size > 0) {
                snapshot.forEach(doc => {
                    window.location = '/posts/' + doc.id;
                });
            }
            else {
                var user = users.where(firebase.firestore.FieldPath.documentId(), '<', key).where(firebase.firestore.FieldPath.documentId(), '!=', this.state.uid).limit(1).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        window.location = '/posts/' + doc.id;
                    });
                })
                .catch(err => {
                    console.log('Error getting random post', err);
                    //COULDN'T FIND POST, PLEASE TRY AGAIN ERROR
                });
            }
        })
        .catch(err => {
            console.log('Error getting random post', err);
            //COULDN'T FIND POST, PLEASE TRY AGAIN ERROR
        });
    }


    render () {
        const { classes } = this.props;

        return (
            <div>
                <Nav/>
                <h1 className={classes.header}>Welcome!</h1>
                {
                    this.props.createdPost ? 
                    <Button 
                        onClick={() => window.location = `/posts/${this.state.uid}` } 
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
                    onClick={this.getNewPost} 
                    className={classes.button} 
                    variant="outlined" 
                    color="primary"
                    >Find Random Post
                </Button>
                <Button 
                    onClick={() => window.location = '/saved' /*TODO: ADD POST ID THROUGH RANDOM DOCUMENT QUERY*/ } 
                    className={classes.savedPostsButton} 
                    variant="outlined" 
                    color="secondary"
                    >Saved Posts
                </Button>
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
