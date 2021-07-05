//React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { savePost, unsavePost } from './actions/index';

//Material UI
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/styles';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

//Carousel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

//Toasts
import { errorToast, successToast } from './utils/toast';

//Global Definitions
var Carousel = require('react-responsive-carousel').Carousel;

//Styling
const styles = ((theme) => ({
    container: {
        background: "#333131",
        padding: '15px 30px 15px 30px'
    },
    header: {
        float: 'left',
        padding: '23px',
        paddingTop: '50px'
    },
}));

//homepage
class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //Profile Info
            username: '', 
            music: '',
            age: '',
            dayAsOtherPerson: '',
            hobbies: '',
            peeves: '',
            selfRating: '',
            guiltyPleasure: '',
            otherInfo: '',
            files: [],
            
            //User info
            userLoggedIn: false,
            usersPost: false,
            uid: '',
            postSaved: false,

            //loading
            contentLoading: true,
        }

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.getNewPost = this.getNewPost.bind(this);
        this.savePost = this.savePost.bind(this);
        this.unsavePost = this.unsavePost.bind(this);
        this.getSavedStatus = this.getSavedStatus.bind(this);
        this.getPostInfo = this.getPostInfo.bind(this);
    };

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            //user is logged in
            this.setState({uid: user.uid, userLoggedIn: true});
            this.getPostInfo(user);
            this.getSavedStatus();
            this.setState({contentLoading: false});
        }
        else {
            this.getPostInfo(null);
            this.setState({contentLoading: false});
        }
    }

    getPostInfo(user) {
        this.setState({
            username: this.props.docData.data().username,
            music: this.props.docData.data().music,
            age: this.props.docData.data().age,
            dayAsOtherPerson: this.props.docData.data().dayAsOtherPerson,
            hobbies: this.props.docData.data().hobbies,
            peeves: this.props.docData.data().peeves,
            selfRating: this.props.docData.data().selfRating,
            guiltyPleasure: this.props.docData.data().guiltyPleasure,
            otherInfo: this.props.docData.data().otherInfo,
            files: this.props.docData.data().fileURLS,
        });
        if (this.state.userLoggedIn && this.props.url === user.uid) {
            this.setState({usersPost: true})
        }
    }

    getSavedStatus() {
        var user = firebase.auth().currentUser;

        firebase.firestore().collection('saves').where("saver", "==", user.uid).where("postOwnerID", "==", this.props.url).get()
        .then((docData) => {
            if (docData.size > 0){
                this.setState({postSaved: true});
            }
            else{
                this.setState({postSaved: false});
            }
        });
    }

    getNewPost(e) {
        e.preventDefault();

        var db = firebase.firestore();
        var posts = db.collection("posts");
        var key = posts.doc().id;
        var query;        

        if (this.state.userLoggedIn) {
            query = posts.where(firebase.firestore.FieldPath.documentId(), '>=', key).where(firebase.firestore.FieldPath.documentId(), '!=', this.state.uid).limit(1);
        }
        else {
            query = posts.where(firebase.firestore.FieldPath.documentId(), '>=', key).limit(1);
        }

        //try to get post above key
        query.get()
        .then(snapshot => {
            if(snapshot.size > 0) {
                snapshot.forEach(doc => {
                    if (doc.id === this.props.url){
                        errorToast("Woah, we randomly ended back up at this post. Please try again!")
                    }
                    else {
                        window.location = '/posts/' + doc.id;
                    }
                });
            }
            else {
                //no post above key, get one below key
                query.get()
                .then(snapshot => {
                    if(snapshot.size > 0) {
                        snapshot.forEach(doc => {
                            if (doc.id === this.props.url){
                                errorToast("Woah, we randomly ended back up at this post. Please try again!")
                            }
                            else {
                                window.location = '/posts/' + doc.id;
                            }
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

    savePost(e){
        e.preventDefault();

        if (!this.state.userLoggedIn) {
            window.location = '/signin';
        }

        var user = firebase.auth().currentUser;

        //add document to firestore
        firebase.firestore().collection("saves").add({
            saver: user.uid,
            postOwnerID: this.props.url,
            postOwnerUsername: this.state.username,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            //update state
            this.setState({postSaved: true});

            const timeElapsed = Date.now();
            const today = new Date(timeElapsed);

            this.props.savePost({
                saver: user.uid,
                postOwnerID: this.props.url,
                postOwnerUsername: this.state.username,
                timeStamp: today.toDateString(),
            });
            successToast('Post Saved!');
        })
        .catch((err) => {errorToast("Error saving post", err)});
    }

    unsavePost(e){
        e.preventDefault();

        if (!this.state.userLoggedIn) {
            window.location = '/signin';
        }

        var user = firebase.auth().currentUser;

        //delete document from firestore
        firebase.firestore().collection('saves').where("saver", "==", user.uid).where("postOwnerID", "==", this.props.url).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              doc.ref.delete();
            });
        })
        .then(() => {
            this.setState({postSaved: false});
            this.props.unsavePost(this.props.url);

            successToast('Post Unsaved!');
        })
        .catch((err) => {errorToast("Error unsaving post", err)});
    }

    render () {
        const { classes } = this.props;
        return (
        <div>
            {this.state.contentLoading ? <CircularProgress/> : (
            <div style={{paddingBottom: '100px'}}>
                <Paper className={classes.container} >
                    {/* Username */}
                    <h1 className={classes.header}>{this.state.username}</h1>

                    {/* Save & Unsave Post */}
                    {!this.state.usersPost && (this.state.postSaved ? <Button color="primary" style={{float: 'right', marginTop:'25px'}} onClick={this.unsavePost}>
                                                                        <BookmarkBorderIcon/>
                                                                        </Button>
                                                                        : 
                                                                        <Button color="secondary" style={{float: 'right', marginTop:'25px'}} onClick={this.savePost}>
                                                                        <BookmarkBorderIcon/>
                                                                        </Button>)}
                    
                    {/* Profile Images */}
                    <Carousel showArrows={true} showThumbs={false} dynamicHeight={true} infiniteLoop={false} autoPlay={false}>
                        {this.state.files.map((url, index) => (
                        <img key={index} src={url} alt={`profileimg${index}`}  style={{height:'500px', width:'auto'}}/>
                        ))}
                    </Carousel>

                    {/* Bio */}
                    <div>
                        { this.state.music !== '' && <p>Music currently on rotation: <strong>{this.state.music}</strong></p>}
                        { this.state.age !== '' && <p>Age: <strong>{this.state.age}</strong></p>}
                        { this.state.dayAsOtherPerson !== '' && <p>If I could spend a day as another person, I would be: <strong>{this.state.dayAsOtherPerson}</strong></p>}
                        { this.state.hobbies !== '' && <p>In my spare time, I like to: <strong>{this.state.hobbies}</strong></p>}
                        { this.state.peeves !== '' && <p>What pisses me off the most: <strong>{this.state.peeves}</strong></p>}
                        { this.state.selfRating !== '' && <p>Out of 10, I would rate myself as: <strong>{this.state.selfRating}</strong></p>}
                        { this.state.guiltyPleasure !== '' && <p>My guilty pleasure is: <strong>{this.state.guiltyPleasure}</strong></p>}
                        { this.state.otherInfo !== '' && <p>Bio: <strong>{this.state.otherInfo}</strong></p>}
                    </div>

                    {/* Edit & Find New Post */}
                    { this.state.userLoggedIn && this.state.usersPost && <Button color="primary" onClick={() => window.location = `/posts/${this.props.url}/edit`}>Edit</Button>}
                    { !!!this.state.usersPost && <Button style={{marginTop: '50px'}} color="primary" onClick={this.getNewPost}>Find New Post</Button>}
                </Paper>
            </div>
            )}
        </div>
        )
  }
}
Profile.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    uid: state.uid,
    username: state.username
});

const mapActionsToProps = { savePost, unsavePost };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));