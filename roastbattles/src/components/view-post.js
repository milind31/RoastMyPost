//React
import React, { Component } from 'react';
import Nav from './navbar';
import Loading from './loading';
import PostNotFound from './post-not-found';
import Tooltip from './utils/tooltip';
import { connect } from 'react-redux';
import { savePost, unsavePost } from './actions/index';

//React Bootstrap
import SubmitButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

//Material UI
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Backdrop from '@material-ui/core/Backdrop';
import { withStyles } from '@material-ui/styles';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplyIcon from '@material-ui/icons/Reply';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
const INITIAL_NUMBER_OF_REPLIES = 5;
const NUMBER_OF_REPLIES_TO_ADD  = 5;
const POST_COMMENT              = 'POST_COMMENT';
const COMMENT_REPLY             = 'COMMENT_REPLY';


//Styling
const styles = ((theme) => ({
    signOutButton: {
        position: "absolute",
        top: "20px",
        right: "20px"
    },
    homeButton: {
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "3%",
        height: "auto"
    },
    container: {
        background: "#333131",
        padding: '15px 30px 15px 30px'
    },
    username: {
        fontSize: '150%',
        marginTop: '5%',
        marginLeft: '0',
    },
    bio: {
        backgroundColor: "#333131",
    },
    media: {
        height: '95%',
        width: '95%'
    },
    profileImg: {
        marginRight: '0',
        height: '55%',
        width: '55%'
    },
    header: {
        float: 'left',
        padding: '23px',
        paddingTop: '50px'
    },
    commentHeader: {
        float: 'left',
        fontSize: '200%',
        marginTop: '5%',
        paddingLeft: '20px',
    },
    form: {
        backgroundColor: '#333131',
    },
    newPostButton: {
        marginTop: '50px'
    },
    commentSection: {
        textAlign: 'left',
        backgroundColor: '#333131',
        color: 'white'
    },
    comments: {
        paddingTop: '50px',
        backgroundColor: '#333131',
    },
    scoringButtons: {
        backgroundColor: '#333131',
        float: 'right'
    },
    saveButton: {
        float: 'right'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1, 
        color: '#fff',
        marginTop: '-50px'
    },
}));

//homepage
class ViewPost extends Component {
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
            
            //Determine if logged in user's post
            usersPost: true,

            //User's UID
            uid: '',

            //Comment Section
            commentLeft: '',
            comments: [],
            newCommentsAdded: [],
            numberOfCommentsToShow: 10,
            replyID: '',
            replyCommentOwnerID: '',
            reply: '',

            //Popups
            deleteCommentMode: false,
            deleteReplyMode: false,
            replyMode: false,
            markAsHarassmentMode: false,

            //Saving
            postSaved: false,

            //Loading
            postNotFound: false,
            contentLoading: true,
            saveStatusLoading: true,
        }

        this.wrapper = React.createRef();
        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.onPostComment = this.onPostComment.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.onChangeReply = this.onChangeReply.bind(this);
        this.onChangeNumberOfComments = this.onChangeNumberOfComments.bind(this);
        this.getNewPost = this.getNewPost.bind(this);
        this.savePost = this.savePost.bind(this);
        this.unsavePost = this.unsavePost.bind(this);
        this.scoreComment = this.scoreComment.bind(this);
        this.getSavedStatusAndSortComments = this.getSavedStatusAndSortComments.bind(this); //used as helper function to getCommentsAndSavedStatus()
        this.getCommentsAndSavedStatus = this.getCommentsAndSavedStatus.bind(this);
        this.sortComments = this.sortComments.bind(this);
        this.getPostInfo = this.getPostInfo.bind(this);
        this.handleClickReply = this.handleClickReply.bind(this);
        this.handleCancelReply = this.handleCancelReply.bind(this);
        this.submitReply = this.submitReply.bind(this);
        this.onDeleteComment = this.onDeleteComment.bind(this);
        this.onDeleteReply = this.onDeleteReply.bind(this);
        this.onShowMoreReplies = this.onShowMoreReplies.bind(this);
        this.Comment = this.Comment.bind(this);
        this.Reply = this.Reply.bind(this);
    };

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            if (this.props.username === '') {
                window.location = '/set-username';
            }
            this.setState({uid: user.uid});
            this.getPostInfo(user);
            this.getCommentsAndSavedStatus();
            this.setState({contentLoading: false});
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }

    getPostInfo(user) {
        if (this.props.match.params.id === user.uid) {
            firebase.firestore().collection('posts').doc(user.uid).get()
            .then((docData) => {
                console.log(docData.data().fileURLS);
                this.setState({
                    username: docData.data().username,
                    music: docData.data().music,
                    age: docData.data().age,
                    dayAsOtherPerson: docData.data().dayAsOtherPerson,
                    hobbies: docData.data().hobbies,
                    peeves: docData.data().peeves,
                    selfRating: docData.data().selfRating,
                    guiltyPleasure: docData.data().guiltyPleasure,
                    otherInfo: docData.data().otherInfo,
                    files: docData.data().fileURLS,
                });
            });
        }
        else {
            firebase.firestore().collection('posts').doc(this.props.match.params.id).get()
            .then((docData) => {
                this.setState({
                    username: docData.data().username,
                    music: docData.data().music,
                    age: docData.data().age,
                    dayAsOtherPerson: docData.data().dayAsOtherPerson,
                    hobbies: docData.data().hobbies,
                    peeves: docData.data().peeves,
                    selfRating: docData.data().selfRating,
                    guiltyPleasure: docData.data().guiltyPleasure,
                    otherInfo: docData.data().otherInfo,
                    files: docData.data().fileURLS,
                    usersPost: false
                });
            })
            .catch(() => {
                this.setState({postNotFound: true});
            });
        }
    }

    markAsHarassment(e, commentID, commenterID) {
        e.preventDefault();

        //add document to firestore
        firebase.firestore().collection("flagged").add({
            commentID: commentID,
            commenterID: commenterID
        })
        .then(() => {console.log("post/user flagged");})
        .catch((err) => console.log(err));

    }

    onPostComment(e) {
        e.preventDefault();

        //comments are being added too quickly
        if (this.state.newCommentsAdded.length >= 5) {
            errorToast("Comments are being added too quickly! Please try again in a bit");
            return;
        }

        var user = firebase.auth().currentUser;

        //add document to firestore
        firebase.firestore().collection("comments").add({
            commentBody: this.state.commentLeft,
            postOwner: this.props.match.params.id,
            commenterID:  user.uid,
            commenterUsername: this.props.username, //current user
            totalScore: 0,
            numScores: 0,
            replies: [],
            timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            
            //update state
            const comment = {
                commentBody: this.state.commentLeft,
                commenterID:  user.uid,
                commenterUsername: this.props.username, //current user
                postOwner: this.props.match.params.id,
                timeStamp: "just now",
                id: docRef.id,
                userScore: 0,
                totalScore: 0,
                numScores: 0,
                replies: [],
                numRepliesToShow: INITIAL_NUMBER_OF_REPLIES,
            };
            let comments = this.state.comments;
            let newCommentsAdded = this.state.newCommentsAdded;

            comments.push(comment);
            newCommentsAdded.push(comment);

            this.setState({commentLeft: '', commentPostedToast: true, comments: comments, newCommentsAdded: newCommentsAdded});

            successToast('Comment Posted!');

            //send notification
            if (user.uid !== this.props.match.params.id){
                this.sendNotification(POST_COMMENT, this.props.match.params.id, this.props.username);
            }
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    scoreComment(e, score, id, userScore) {
        e.preventDefault();
        if (userScore === 0) {

            var user = firebase.auth().currentUser;


            let comments = this.state.comments;
            let index = comments.slice(0, this.state.numberOfCommentsToShow).findIndex((comment => comment.id === id));
            comments[index].userScore = score;
            comments[index].totalScore += score;
            comments[index].numScores += 1;
            this.setState({comments: comments});

            firebase.firestore().collection("comments").doc(id).update({
                totalScore: comments[index].totalScore,
                numScores: comments[index].numScores
            });

            //add document to firestore
            firebase.firestore().collection("scores").add({
                user: user.uid,
                comment: comments[index].id,
                score: score
            });

            console.log("score", score);
        }
    }

    onDeleteComment(e, id) {
        e.preventDefault();

        firebase.firestore().collection("comments").doc(id).delete()
        .then(() => {
            //delete associated saves from firestore
            firebase.firestore().collection('scores').where("comment", "==", id).get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    doc.ref.delete();
                });
            })
        })
        .catch((error) => {
            console.error("Error removing document: ", error);
        });

        let comments = this.state.comments;
        comments = comments.filter(function( obj ) {
            return obj.id !== id;
        });
        this.setState({comments: comments, deleteCommentMode: false});

        successToast('Comment Deleted!');
    }

    onChangeComment(e) {
        this.setState({
            commentLeft: e.target.value,
        });
    }

    Reply = props => (
        <div>
            {this.state.deleteReplyMode && 
                <Backdrop open={this.state.deleteReplyMode} className={props.classes.backdrop}>
                    <Form className={props.classes.form} style={{ borderRadius: '5px', width: "25%", padding: '10px'}}>
                        <h3 style={{marginTop: '10px'}}>Are you sure you want to delete this reply?</h3>
                        <p style={{ fontSize:'90%', marginBottom:'20px'}}>This action cannot be undone...</p>
                        <SubmitButton variant="primary" style={{float: "right", margin: "5px"}} onClick={(e) => {this.onDeleteReply(e, props.commentID, props.reply)}}>Yes</SubmitButton>
                        <SubmitButton variant="secondary" style={{float: "right", margin: "5px"}} onClick={() => this.setState({deleteReplyMode: false})}>Cancel</SubmitButton>
                    </Form>
                </Backdrop>
            }
            <div className={props.classes.comment} style={{marginLeft: '25px'}}>
                <p>
                    <a href={"/posts/" + props.reply.replyUserID} 
                        style={{textDecoration:'none'}}
                        >{props.reply.replyUsername}
                    </a>
                    {(props.reply.replyUserID === props.postOwner) && <WhatshotIcon/>}
                </p>
                <p style={{fontSize: '125%'}}>{props.reply.body}</p>
                <small>{props.reply.timeStamp}</small>
                {this.state.uid === props.reply.replyUserID &&
                <Tooltip message={"Delete Reply"}>
                        <Button color="primary" style={{backgroundColor:'transparent'}} onClick={() => this.setState({deleteReplyMode: true})}>
                            <DeleteIcon/>
                        </Button>
                </Tooltip>}
            <hr style={{color: '#5c5c5c', backgroundColor:'#5c5c5c'}}></hr>
            </div>
        </div>
    )

    Comment = props => (
        <div>
            {this.state.deleteCommentMode && 
                <Backdrop open={this.state.deleteCommentMode} className={props.classes.backdrop}>
                    <Form className={props.classes.form} style={{ borderRadius: '5px', width: "25%", padding: '10px'}}>
                        <h3 style={{marginTop: '10px'}}>Are you sure you want to delete this comment?</h3>
                        <p style={{ fontSize:'90%', marginBottom:'20px'}}>This action cannot be undone...</p>
                        <SubmitButton variant="primary" style={{float: "right", margin: "5px"}} type="submit" onClick={(e) => {this.onDeleteComment(e, props.comment.id)}}>Yes</SubmitButton>
                        <SubmitButton variant="secondary" style={{float: "right", margin: "5px"}} type="submit" onClick={() => this.setState({deleteCommentMode: false})}>Cancel</SubmitButton>
                    </Form>
                </Backdrop>
            }

            {this.state.markAsHarassmentMode && 
                <Backdrop open={this.state.markAsHarassmentMode} className={props.classes.backdrop}>
                    <Form className={props.classes.form} style={{ borderRadius: '5px', width: "25%", padding: '10px'}}>
                        <h3 style={{marginTop: '10px'}}>Are you sure you want to flag this post and or user for harassment?</h3>
                        <SubmitButton variant="primary" style={{float: "right", margin: "5px"}} type="submit" onClick={(e) => this.markAsHarassment(e, props.comment.id, props.comment.commenterID)}>Yes</SubmitButton>
                        <SubmitButton variant="secondary" style={{float: "right", margin: "5px"}} type="submit" onClick={() => this.setState({markAsHarassmentMode: false})}>Cancel</SubmitButton>
                    </Form>
                </Backdrop>
            }

            {this.state.deleteReplyMode && 
                <Backdrop open={this.state.deleteReplyMode} className={props.classes.backdrop}>
                    <Form className={props.classes.form} style={{ borderRadius: '5px', width: "25%", padding: '10px'}}>
                        <h3 style={{marginTop: '10px'}}>Are you sure you want to delete this reply?</h3>
                        <p style={{ fontSize:'90%', marginBottom:'20px'}}>This action cannot be undone...</p>
                        <SubmitButton variant="primary" style={{float: "right", margin: "5px"}} onClick={(e) => {this.onDeleteReply(e, props.commentID, props.reply)}}>Yes</SubmitButton>
                        <SubmitButton variant="secondary" style={{float: "right", margin: "5px"}} onClick={() => this.setState({deleteReplyMode: false})}>Cancel</SubmitButton>
                    </Form>
                </Backdrop>
            }

        <div className={props.classes.commentSection}>
            <div>
                    <a href={"/posts/" + props.comment.commenterID} 
                        style={{textDecoration:'none', textAlign:'left', float:'left'}}
                        >{props.comment.commenterUsername}
                    </a>
                    {(props.comment.commenterID === props.comment.postOwner) && <WhatshotIcon style={{float:'left', paddingLeft:'7px'}}/>}
                    {(props.comment.commenterID !== this.state.uid) && <Tooltip message="Mark user/post for harassment"><Button size="small" style={{float:'right', padding:'0px', marginLeft:'-35px', marginRight:'-25px'}} onClick={() => this.setState({markAsHarassmentMode: true})}><MoreVertIcon style={{color:'#525252', height:'90%', float:'right'}}/></Button></Tooltip>}
                    <strong style={{float:'right', paddingRight: '20px'}}>Score: {isNaN(props.comment.totalScore / props.comment.numScores) ? "-" : (props.comment.totalScore / props.comment.numScores).toFixed(2)}</strong>
            </div>

            <div style={{paddingTop:'40px'}}>
                <p style={{fontSize: '125%', float:'left'}}>{props.comment.commentBody}</p>
            </div>

            <div style={{paddingTop:'15px', paddingBottom:'25px'}}>
                <small style={{paddingRight: '10px', float:'left', textAlign:'left'}}>{props.comment.timeStamp.toString().replace( /\d{2}:.*/,"")}</small>
                <div style={{float:'left', marginTop:'-10px', paddingTop:'0px'}}>
                    {this.state.uid === props.comment.commenterID &&
                        <Tooltip message="Delete Comment">
                            <Button color="primary" style={{backgroundColor:'transparent', marginLeft:'-15px', marginRight:'-5px'}} onClick={() => this.setState({deleteCommentMode: true})}>
                                <DeleteIcon/>
                            </Button>
                        </Tooltip>}
                        <Tooltip message="Reply">
                            <Button color="primary" style={{backgroundColor:'transparent', marginLeft:'-15px', marginRight:'-5px'}} onClick={(e) => {this.handleClickReply(e, props.comment.id, props.comment.commenterID)}}>
                                <ReplyIcon/>
                            </Button>
                        </Tooltip>
                </div>
                {(props.comment.commenterID !== this.state.uid) && (<div style={{float:'right', marginTop: '-5px'}}>
                                                                        <Button 
                                                                            onClick={(e) => {this.scoreComment(e, 1, props.comment.id, props.comment.userScore)}} 
                                                                            color={props.comment.userScore === 0 ? "secondary" : "primary"}
                                                                            disabled={props.comment.userScore !== 0 && props.comment.userScore !== 1}
                                                                            >1
                                                                        </Button>
                                                                        <Button 
                                                                            onClick={(e) => {this.scoreComment(e, 2, props.comment.id, props.comment.userScore)}} 
                                                                            color={props.comment.userScore === 0 ? "secondary" : "primary"}
                                                                            disabled={props.comment.userScore !== 0 && props.comment.userScore !== 2}
                                                                            >2
                                                                        </Button>
                                                                            <Button 
                                                                            onClick={(e) => {this.scoreComment(e, 3, props.comment.id, props.comment.userScore)}} 
                                                                            color={props.comment.userScore === 0 ? "secondary" : "primary"}
                                                                            disabled={props.comment.userScore !== 0 && props.comment.userScore !== 3}
                                                                            >3
                                                                        </Button>
                                                                        <Button                      
                                                                            onClick={(e) => {this.scoreComment(e, 4, props.comment.id, props.comment.userScore)}} 
                                                                            color={props.comment.userScore === 0 ? "secondary" : "primary"}
                                                                            disabled={props.comment.userScore !== 0 && props.comment.userScore !== 4}
                                                                            >4
                                                                        </Button> 
                                                                </div>
                                                                )} 
            </div>
            <hr style={{color: '#5c5c5c', backgroundColor:'#5c5c5c'}}></hr>
            {props.comment.replies.slice(0, props.comment.numRepliesToShow).map((reply, index) => (
                <div className={props.classes.commentSection} style={{marginLeft: '25px'}}>
                    <p>
                        <a href={"/posts/" + reply.replyUserID} 
                            style={{textDecoration:'none'}}
                            >{reply.replyUsername}
                        </a>
                        {(reply.replyUserID === props.comment.postOwner) && <WhatshotIcon style={{paddingLeft:'7px'}}/>}
                    </p>
                    <p style={{fontSize: '125%'}}>{reply.body}</p>
                    <small>{reply.timeStamp}</small>
                    {this.state.uid === reply.replyUserID &&
                    <Tooltip message={"Delete Reply"}>
                            <Button color="primary" style={{backgroundColor:'transparent', marginLeft:'-5px', marginTop:'-5px'}} onClick={() => this.setState({deleteReplyMode: true})}>
                                <DeleteIcon/>
                            </Button>
                    </Tooltip>}
                <hr style={{color: '#5c5c5c', backgroundColor:'#5c5c5c'}}></hr>
                </div>
            ))}
            {props.comment.replies.length > 0 && props.comment.numRepliesToShow < props.comment.replies.length && <Button style={{margin: '0 auto', display: "flex"}} color="primary" onClick={(e) => {this.onShowMoreReplies(e, props.comment.id)}}>Show more replies</Button>}
            {props.comment.replies.length > INITIAL_NUMBER_OF_REPLIES && props.comment.numRepliesToShow >= props.comment.replies.length && <Button style={{margin: '0 auto', display: "flex"}} color="primary" onClick={(e) => {this.onHideReplies(e, props.comment.id)}}>Hide replies</Button>}
        </div>
        </div>
    )

    onShowMoreReplies(e, commentID) {
        e.preventDefault();

        let comments = this.state.comments;
        let index = comments.slice(0, this.state.numberOfCommentsToShow).findIndex((comment => comment.id === commentID));

        comments[index].numRepliesToShow += NUMBER_OF_REPLIES_TO_ADD;
        this.setState(this.state);
    }

    onHideReplies(e, commentID) {
        e.preventDefault();

        let comments = this.state.comments;
        let index = comments.slice(0, this.state.numberOfCommentsToShow).findIndex((comment => comment.id === commentID));

        comments[index].numRepliesToShow = INITIAL_NUMBER_OF_REPLIES;
        this.setState(this.state);
    }

    getSavedStatusAndSortComments() {
        var user = firebase.auth().currentUser;

        firebase.firestore().collection('saves').where("saver", "==", user.uid).where("postOwnerID", "==", this.props.match.params.id).get()
        .then((docData) => {
            console.log(docData);
            if (docData.size > 0){
                this.setState({postSaved: true}, () => {this.sortComments()});
            }
            else{
                this.setState({postSaved: false}, () => {this.sortComments()});
            }
        });
    }

    sortComments() {
        //sort comments by score and finish loading
        this.setState({comments: this.state.comments.sort((a, b) => (a.totalScore/a.numScores > b.totalScore/b.numScores) ? -1 : 1), saveStatusLoading: false});
    }

    //query for comments on this post from firestore
    getCommentsAndSavedStatus() {
        var user = firebase.auth().currentUser;
        firebase.firestore().collection("comments").where("postOwner", "==", this.props.match.params.id).get()
            .then((data) => {
                var comments = [];
                data.forEach((doc) => {
                    console.log(doc.id);
                    firebase.firestore().collection("scores").where("comment", "==", doc.id).where("user", "==", user.uid).get()
                    .then((data) => {
                        var score = 0;
                        if (data.size > 0){
                            data.forEach((doc) => {
                                score = doc.data().score;
                            });
                        }
                        return score;
                    })
                    .then((score) => {
                        const comment = {
                            commentBody: doc.data().commentBody,
                            commenterID: doc.data().commenterID,
                            commenterUsername: doc.data().commenterUsername,
                            postOwner: doc.data().postOwner,
                            timeStamp: doc.data().timeStamp.toDate(),
                            id: doc.id,
                            totalScore: doc.data().totalScore,
                            numScores: doc.data().numScores,
                            userScore: score,
                            replies: doc.data().replies,
                            numRepliesToShow: INITIAL_NUMBER_OF_REPLIES
                        };
                        comments.push(comment);
                    });
                })
                return comments;
            })
            .then((comments) => {
                this.setState({comments: comments}, () => {this.getSavedStatusAndSortComments()});
            })
            .then(() => {return;});
    }

    onChangeNumberOfComments(e) {
        e.preventDefault();

        this.setState({
            numberOfCommentsToShow: e.target.value
        });
        console.log(this.state.comments);
        console.log(e.target.value);
    }

    getNewPost(e) {
        e.preventDefault();

        var db = firebase.firestore();
        var posts = db.collection("posts");

        var key = posts.doc().id;

        console.log("key", key);
        posts.where(firebase.firestore.FieldPath.documentId(), '>=', key).where(firebase.firestore.FieldPath.documentId(), '!=', this.state.uid).limit(1).get()
        .then(snapshot => {
            if(snapshot.size > 0) {
                snapshot.forEach(doc => {
                    window.location = '/posts/' + doc.id;
                });
            }
            else {
                posts.where(firebase.firestore.FieldPath.documentId(), '<', key).where(firebase.firestore.FieldPath.documentId(), '!=', this.state.uid).limit(1).get()
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

    savePost(e){
        e.preventDefault();

        var user = firebase.auth().currentUser;

        //add document to firestore
        firebase.firestore().collection("saves").add({
            saver: user.uid,
            postOwnerID: this.props.match.params.id,
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
                postOwnerID: this.props.match.params.id,
                postOwnerUsername: this.state.username,
                timeStamp: today.toDateString(),
            });

            successToast('Post Saved!');
        })
        .catch((error) => {
            console.error("Error adding save document: ", error);
        });
    }

    unsavePost(e){
        e.preventDefault();

        var user = firebase.auth().currentUser;

        //delete document from firestore
        firebase.firestore().collection('saves').where("saver", "==", user.uid).where("postOwner", "==", this.props.match.params.id).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              doc.ref.delete();
            });
        })
        .then(() => {
            console.log("Save document successfully deleted");
            this.setState({postSaved: false});

            this.props.unsavePost(this.props.match.params.id);

            successToast('Post Unsaved!');
        })
        .catch((err) => {console.log("Error unsaving post", err)});
        
    }

    SavedButton = props => (
        <div className={props.classes.container}>
            <Button color="primary" className={props.classes.saveButton} onClick={this.unsavePost}>
                <BookmarkBorderIcon/>
            </Button>
        </div>
    )

    UnsavedButton = props => (
        <div className={props.classes.container}>
            <Button color="secondary" className={props.classes.saveButton} onClick={this.savePost}>
                <BookmarkBorderIcon/>
            </Button>
        </div>
    )

    handleClickReply(e, id, ownerID) {
        e.preventDefault();
        this.setState({
            replyMode: true,
            replyID: id,
            replyCommentOwnerID: ownerID
        });
    }

    handleCancelReply(e) {
        e.preventDefault();
        this.setState({
            replyMode: false,
            replyID: '',
            replyCommentOwnerID: '',
            reply: ''
        });
    }

    submitReply(e, id, ownerID) {
        e.preventDefault();

        var time = Date.now();
        var timeStamp = new Date(time);

        const reply = {
            body: this.state.reply.toString(),
            replyUserID: this.state.uid.toString(),
            replyUsername: this.props.username.toString(),
            timeStamp: timeStamp.toDateString()
        };

        firebase.firestore().collection("comments").doc(id).update({
            replies: firebase.firestore.FieldValue.arrayUnion(reply)
        });

        let comments = this.state.comments;
        let index = comments.slice(0, this.state.numberOfCommentsToShow).findIndex((comment => comment.id === id));
        console.log(comments[index]);
        reply.timeStamp = "just now";
        comments[index].replies.push(reply);
        console.log(ownerID);
        this.setState({
            replyMode: false,
            replyID: '',
            replyCommentOwnerID: '',
            reply: '',
            comments: comments
        });
        
        successToast('Reply Posted!');

        var user = firebase.auth().currentUser;

        console.log(ownerID);

        if (user.uid !== ownerID){
            this.sendNotification(COMMENT_REPLY, ownerID, this.props.username);
        }
    }

    onDeleteReply(e, commentID, reply) {
        e.preventDefault();

        firebase.firestore().collection("comments").doc(commentID).update({
            replies: firebase.firestore.FieldValue.arrayRemove(reply)
        });

        let comments = this.state.comments;
        let index = comments.slice(0, this.state.numberOfCommentsToShow).findIndex((comment => comment.id === commentID));
        comments[index].replies = comments[index].replies.filter(function( r ) {
            return r !== reply;
        });
        this.setState({comments: comments, deleteReplyMode: false});

        successToast('Reply Deleted!');
    }

    onChangeReply(e) {
        e.preventDefault();
        this.setState({reply: e.target.value});
    }

    sendNotification(type, to, from) {
        firebase.firestore().collection("notifications").add({
            comment: type === POST_COMMENT ? true : false,
            reply:  type === COMMENT_REPLY ? true : false,
            to: to,
            from: from,
            post: this.props.match.params.id,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {console.log("notification added");})
        .catch((err) => {console.log(err)});
    }

    render () {
        const { classes } = this.props;
        return (
           <div ref={this.wrapper}>
               {this.state.postNotFound ? (<PostNotFound/>) : (this.state.contentLoading || this.state.saveStatusLoading ? (<Loading/>) : (
               <div>
               <Nav/>
               {this.state.replyMode &&
                <Backdrop open={this.state.replyMode} className={classes.backdrop}>
                    <Form className={classes.form} style={{borderRadius: '5px', width: "25%", padding: '10px'}} onSubmit={(e) => {this.submitReply(e, this.state.replyID, this.state.replyCommentOwnerID);}}>
                        <Form.Group className={classes.container} controlId="exampleForm.ControlTextarea1">
                            <Form.Control 
                            onChange={this.onChangeReply}
                            value={this.state.reply} 
                            size="sm" as="textarea" rows={3}
                            placeholder="Leave response here..." />
                        </Form.Group>
                        <SubmitButton variant="primary" style={{float: "right", margin: "5px"}} type="submit">Reply</SubmitButton>
                        <SubmitButton variant="secondary" style={{float: "right", margin: "5px"}} type="submit" onClick={this.handleCancelReply}>Cancel</SubmitButton>
                    </Form>
                </Backdrop>
                }

               <div style={{padding: '75px 0px 100px 0px'}}>
               <Paper className={classes.container} >
                    <h1 className={classes.header}>{this.state.username}</h1>
                    {!this.state.usersPost && (this.state.postSaved ? <this.SavedButton classes={classes}/> : <this.UnsavedButton classes={classes}/>) }
                    <div className={classes.container} style={{paddingBottom:'75px'}}/>
                    <Carousel showArrows={true} emulateTouch={true} showThumbs={false} dynamicHeight={true} infiniteLoop={false} autoPlay={false}>
                        {this.state.files.map((url, index) => (
                        <img key={index} src={url} alt={`profileimg${index}`} style={{height:'auto',width:'800px'}}/>
                        ))}
                    </Carousel>
                    <div className={classes.bio}>
                        { this.state.music !== '' && <p>Music currently on rotation: <strong>{this.state.music}</strong></p>}
                        { this.state.age !== '' && <p>Age: <strong>{this.state.age}</strong></p>}
                        { this.state.dayAsOtherPerson !== '' && <p>If I could spend a day as another person, I would be: <strong>{this.state.dayAsOtherPerson}</strong></p>}
                        { this.state.hobbies !== '' && <p>When I'm bored, I like to: <strong>{this.state.hobbies}</strong></p>}
                        { this.state.peeves !== '' && <p>It really pisses me off when: <strong>{this.state.peeves}</strong></p>}
                        { this.state.selfRating !== '' && <p>Out of 10, I would rate myself as: <strong>{this.state.selfRating}</strong></p>}
                        { this.state.guiltyPleasure !== '' && <p>My guilty pleasure is: <strong>{this.state.guiltyPleasure}</strong></p>}
                        { this.state.otherInfo !== '' && <p>Bio: <strong>{this.state.otherInfo}</strong></p>}
                    </div>
                    { this.state.usersPost && <Button color="primary" onClick={() => window.location = `/posts/${this.props.match.params.id}/edit`}>Edit</Button>}
                </Paper>

                <Paper className={classes.container}>
                    <p className={classes.commentHeader}>Comments</p>
                    <Form>
                        <Form.Group className={classes.container}>
                        <Form.Row style = {{float:'left', marginTop:'-20px', marginLeft:'10px'}} className={classes.container}>
                            <Col xs={12} className={classes.container}>
                                <Form.Control as="select" onChange={this.onChangeNumberOfComments} placeholder="Number of Comments Displayed">
                                    <option value={10}>Top 10</option>
                                    <option value={25}>Top 25</option>
                                    <option value={Number.MAX_SAFE_INTEGER}>Show all ({this.state.comments.length})</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>
                        </Form.Group>
                    </Form>
                    
                    <div className={classes.comments}>
                    {this.state.comments.length === 0 && <div className={classes.container}><p>No comments yet :(</p><br/><p>Be the first to leave one below!</p></div>}
                    {this.state.comments.slice(0, this.state.numberOfCommentsToShow).map((comment, index) => (
                        <this.Comment key={index} comment={comment} classes={classes}></this.Comment>
                    ))}
                    {this.state.newCommentsAdded.length > 0 && this.state.comments.length > this.state.numberOfCommentsToShow && this.state.newCommentsAdded.map((comment, index) => (
                        <this.Comment key={index} comment={comment} classes={classes}></this.Comment>
                    ))}
                    </div>

                    <Form className={classes.form} onSubmit={this.onPostComment}>
                        <Form.Group className={classes.container} controlId="exampleForm.ControlTextarea1">
                            <Form.Control 
                            onChange={this.onChangeComment} 
                            size = "sm"
                            value={this.state.commentLeft} 
                            as="textarea" rows={3}
                            placeholder="Leave comment here..." />
                        </Form.Group>
                        <SubmitButton variant="primary" type="submit">Post Comment</SubmitButton>
                    </Form>
                </Paper>

                { !!!this.state.usersPost && <Button className={classes.newPostButton} color="primary" onClick={this.getNewPost}>Find New Post</Button>}
            </div>
            </div>
            ))}
        </div>
        )
  }
}
ViewPost.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    uid: state.uid,
    username: state.username
});

const mapActionsToProps = { savePost, unsavePost };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ViewPost));