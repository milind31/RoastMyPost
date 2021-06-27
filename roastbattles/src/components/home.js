//React
import React, { Component } from 'react';
import NavWithNotifications from './navbar-with-notifications';

//Material UI
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

//Redux
import { connect } from 'react-redux';
import { errorToast } from './utils/toast';

const styles = {
    header: {
        position: 'fixed',
        top: '38%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
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

        this.state = {createdPost: false, uid: '', loading: true};

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.getNewPost = this.getNewPost.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            //user is logged in
            //user hasn't created username yet
            if (this.props.username === '') {
                window.location = '/set-username';
            }
            this.setState({uid: user.uid, loading: false})
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }

    getNewPost(e) {
        e.preventDefault();

        var db = firebase.firestore();
        var posts = db.collection("posts");

        var key = posts.doc().id;

        console.log("key", key);
        //try to get post above key
        posts.where(firebase.firestore.FieldPath.documentId(), '>=', key).where(firebase.firestore.FieldPath.documentId(), '!=', this.state.uid).limit(1).get()
        .then(snapshot => {
            if(snapshot.size > 0) {
                snapshot.forEach(doc => {
                    window.location = '/posts/' + doc.id;
                });
            }
            else {
                //no post above key, get one below key
                posts.where(firebase.firestore.FieldPath.documentId(), '<', key).where(firebase.firestore.FieldPath.documentId(), '!=', this.state.uid).limit(1).get()
                .then(snapshot => {
                    if(snapshot.size > 0) {
                        snapshot.forEach(doc => {
                            window.location = '/posts/' + doc.id;
                        });
                    }
                    else {
                        errorToast("Couldn't find any posts!")
                    }
                })
                .catch(() => {
                    errorToast("There was an error! Please try again later")
                });
            }
        })
        .catch(() => {
            errorToast("There was an error! Please try again later")
        });
    }


    render () {
        const { classes } = this.props;

        return (
            <div>
                <NavWithNotifications/>
                <div className={classes.header}>
                <h1>Welcome!</h1>
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
                </div>
            </div>
        )
  }
}
Home.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    createdPost: state.createdPost,
    username: state.username
})

export default connect((mapStateToProps),)(withStyles(styles)(Home));
