//React
import React, { Component } from 'react';
import Tooltip from './utils/tooltip';
import Popup from './utils/popup';
import { connect } from 'react-redux';
import { savePost, unsavePost } from './actions/index';

//React Bootstrap
import SubmitButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

//Material UI
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { withStyles } from '@material-ui/styles';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplyIcon from '@material-ui/icons/Reply';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

//Toasts
import { errorToast, successToast } from './utils/toast';

//Global Definitions
const INITIAL_NUMBER_OF_REPLIES = 5;
const NUMBER_OF_REPLIES_TO_ADD  = 5;
const POST_COMMENT              = 'POST_COMMENT';
const COMMENT_REPLY             = 'COMMENT_REPLY';

//Styling
const styles = ((theme) => ({
    container: {
        background: "#333131",
        padding: '15px 30px 15px 30px'
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
        float:'right', 
        marginTop: '-5px'
    },
    commentFilterBox: {
        float:'left', 
        marginTop:'-10px', 
        marginLeft:'10px'
    },
    flagPostButton: {
        float:'right', 
        padding:'0px', 
        marginLeft:'-35px', 
        marginRight:'-25px'
    },
    flagPostIcon: {
        color:'#525252', 
        height:'90%', 
        float:'right'
    },
    scoreDisplay: {
        float:'right',
        paddingRight: '20px'
    },
    belowCommentBar: {
        marginTop:'0px', 
        paddingTop:'15px', 
        paddingBottom:'25px'
    },
    belowCommentButton: {
        backgroundColor:'transparent', 
        marginLeft:'-15px', 
        marginRight:'-5px'
    },
    belowReplyButton: {
        backgroundColor:'transparent', 
        marginLeft:'-5px', 
        marginTop:'-5px'
    },
    belowCommentButtons: {
        float:'left', 
        marginTop:'-10px', 
        paddingTop:'0px'
    },
    belowCommentTimestamp: {
        paddingRight: '10px', 
        float:'left', 
        textAlign:'left'
    },
    popupMainText: {
        marginTop: '10px'
    },
    popupSubText: {
        fontSize:'90%', 
        marginBottom:'20px'
    },
    popupButton: {
        float: "right", 
        margin: "5px"
    },
    lineBreak: {
        color: '#5c5c5c', 
        backgroundColor:'#5c5c5c'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1, 
        color: '#fff',
        marginTop: '-50px'
    },
}));

//homepage
class Comments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //User info
            usersPost: true,
            uid: '',
            postSaved: '',

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
            commentIDToDelete: '',
            replyToDelete: '',
            commentIDToDeleteReply: '',
            commentIDToFlag: '',
            commenterToFlag: '',

            //Loading
            contentLoading: true,
        }

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.onPostComment = this.onPostComment.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.onChangeReply = this.onChangeReply.bind(this);
        this.onChangeNumberOfComments = this.onChangeNumberOfComments.bind(this);
        this.scoreComment = this.scoreComment.bind(this);
        this.getCommentsAndSort = this.getCommentsAndSort.bind(this);
        this.sortComments = this.sortComments.bind(this);
        this.handleClickReply = this.handleClickReply.bind(this);
        this.handleCancelReply = this.handleCancelReply.bind(this);
        this.submitReply = this.submitReply.bind(this);
        this.onDeleteComment = this.onDeleteComment.bind(this);
        this.onDeleteReply = this.onDeleteReply.bind(this);
        this.onShowMoreReplies = this.onShowMoreReplies.bind(this);
        this.Comment = this.Comment.bind(this);
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
            this.getCommentsAndSort();     
            this.sortComments(); 
            this.setState({contentLoading: false});  
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }

    markAsHarassment(e, commentID, commenterID) {
        e.preventDefault();

        //add document to firestore
        firebase.firestore().collection("flagged").add({
            commentID: commentID,
            commenterID: commenterID,
            flagger: this.props.uid
        })
        .then(() => {
            successToast("Post/User flagged!")
            this.setState({markAsHarassmentMode: false, commentIDToFlag: '', commenterToFlag: ''});
        })
        .catch((err) => {errorToast("Error flagging post", err)});

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
            postOwner: this.props.url,
            commenterID:  user.uid,
            commenterUsername: this.props.username, //current user
            totalScore: 0,
            numScores: 0,
            replies: [],
            timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {            
            //update state
            const comment = {
                commentBody: this.state.commentLeft,
                commenterID:  user.uid,
                commenterUsername: this.props.username, //current user
                postOwner: this.props.url,
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
            if (user.uid !== this.props.url){
                this.sendNotification(POST_COMMENT, this.props.url, this.props.username);
            }
        })
        .catch((err) => {
            errorToast("Error posting comment", err)
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
        this.setState({comments: comments, deleteCommentMode: false, commentIDToDelete: ''});

        successToast('Comment Deleted!');
    }

    onChangeComment(e) {
        this.setState({
            commentLeft: e.target.value,
        });
    }

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

    sortComments() {
        //sort comments by score and finish loading
        this.setState({comments: this.state.comments.sort((a, b) => (a.totalScore/a.numScores > b.totalScore/b.numScores) ? -1 : 1), contentLoading: false})
    }

    //query for comments on this post from firestore
    getCommentsAndSort() {
        var user = firebase.auth().currentUser;
        firebase.firestore().collection("comments").where("postOwner", "==", this.props.url).get()
            .then((data) => {
                var comments = [];
                data.forEach((doc) => {
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
                return comments
            })
            .then((comments) => {
                this.setState({comments: comments});
                return comments.sort((a, b) => (a.totalScore/a.numScores > b.totalScore/b.numScores) ? -1 : 1)
            })
            .then((sorted) => {console.log(sorted)});
    }

    onChangeNumberOfComments(e) {
        e.preventDefault();

        this.setState({
            numberOfCommentsToShow: e.target.value
        });
    }

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

        var user = firebase.auth().currentUser;
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
        reply.timeStamp = "just now";
        comments[index].replies.push(reply);
        this.setState({
            replyMode: false,
            replyID: '',
            replyCommentOwnerID: '',
            reply: '',
            comments: comments
        });
        
        successToast('Reply Posted!');

        if (user.uid !== ownerID){
            this.sendNotification(COMMENT_REPLY, ownerID, this.props.username);
        }
    }

    onDeleteReply(e, commentID, reply) {
        e.preventDefault();

        firebase.firestore().collection("comments").doc(commentID).update({
            replies: firebase.firestore.FieldValue.arrayRemove(reply)
        })
        .then(() => {
            let comments = this.state.comments;
            let index = comments.slice(0, this.state.numberOfCommentsToShow).findIndex((comment => comment.id === commentID));
            comments[index].replies = comments[index].replies.filter(function( r ) {
                return r !== reply;
            });
            this.setState({comments: comments, deleteReplyMode: false, commentIDToDeleteReply:'', replyToDelete: ''});

            successToast('Reply Deleted!');
            return comments;
        })
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
            post: this.props.url,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }

    Comment = props => (
        <div className={props.classes.commentSection}>
            <p>
                {/* Username */}
                <a href={"/posts/" + props.comment.commenterID} 
                    style={{textDecoration:'none'}}
                    >{props.comment.commenterUsername}
                </a>
                {(props.comment.commenterID === props.comment.postOwner) && <WhatshotIcon/>}

                {/* Flag */}
                {(props.comment.commenterID !== this.state.uid) && 
                <Tooltip message="Mark user/post for harassment">
                    <Button size="small" className={props.classes.flagPostButton} onClick={() => this.setState({markAsHarassmentMode: true, commentIDToFlag: props.comment.id, commenterToFlag:props.comment.commenterID})}>
                        <MoreVertIcon className={props.classes.flagPostIcon}/>
                    </Button>
                </Tooltip>}

                {/* Score */}
                <strong className={props.classes.scoreDisplay}>Score: {isNaN(props.comment.totalScore / props.comment.numScores) ? "-" : (props.comment.totalScore / props.comment.numScores).toFixed(2)}</strong>
            </p>

            {/* Comment Body */}
            <p style={{fontSize: '125%'}}>{props.comment.commentBody}</p>

            <div className={props.classes.belowCommentBar}>
                {/* Timestamp */}
                <small className={props.classes.belowCommentTimestamp}>{props.comment.timeStamp.toString().replace( /\d{2}:.*/,"")}</small>

                {/* Delete & Reply Buttons */}
                <div className={props.classes.belowCommentButtons}>
                    {this.state.uid === props.comment.commenterID &&
                    <Tooltip message="Delete Comment">
                        <Button color="primary" className={props.classes.belowCommentButton} onClick={() => {this.setState({deleteCommentMode: true, commentIDToDelete:props.comment.id})}}>
                            <DeleteIcon/>
                        </Button>
                    </Tooltip>}

                    <Tooltip message="Reply">
                        <Button color="primary" className={props.classes.belowCommentButton} onClick={(e) => {this.handleClickReply(e, props.comment.id, props.comment.commenterID)}}>
                            <ReplyIcon/>
                        </Button>
                    </Tooltip>
                </div>

                {/* Score Bar */}
                {(props.comment.commenterID !== this.state.uid) && (<div className={props.classes.scoringButtons}>
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

            {/* Line Break */}
            <hr className={props.classes.lineBreak}></hr>

            {/* Replies */}
            {props.comment.replies.slice(0, props.comment.numRepliesToShow).map((reply, index) => (
                <div key={index} className={props.classes.commentSection} style={{marginLeft: '25px'}}>
                    <p>
                        {/* Username */}
                        <a href={"/posts/" + reply.replyUserID} 
                            style={{textDecoration:'none'}}
                            >{reply.replyUsername}
                        </a>
                        {(reply.replyUserID === props.comment.postOwner) && <WhatshotIcon style={{paddingLeft:'7px'}}/>}
                    </p>

                    {/* Reply Body */}
                    <p style={{fontSize: '125%'}}>{reply.body}</p>

                    {/* Timestamp */}
                    <small>{reply.timeStamp}</small>

                    {/* Delete Button */}
                    {this.state.uid === reply.replyUserID &&
                    <Tooltip message={"Delete Reply"}>
                            <Button color="primary" className={props.classes.belowReplyButton} onClick={() => this.setState({deleteReplyMode: true, commentIDToDeleteReply: props.comment.id, replyToDelete: reply})}>
                                <DeleteIcon/>
                            </Button>
                    </Tooltip>}

                    {/* Linebreak */}
                    <hr className={props.classes.lineBreak}></hr>
                </div>
            ))}
            
            {/* Show more and hide replies buttons */}
            {props.comment.replies.length > 0 && props.comment.numRepliesToShow < props.comment.replies.length && <Button style={{margin: '0 auto', display: "flex"}} color="primary" onClick={(e) => {this.onShowMoreReplies(e, props.comment.id)}}>Show more replies</Button>}
            {props.comment.replies.length > INITIAL_NUMBER_OF_REPLIES && props.comment.numRepliesToShow >= props.comment.replies.length && <Button style={{margin: '0 auto', display: "flex"}} color="primary" onClick={(e) => {this.onHideReplies(e, props.comment.id)}}>Hide replies</Button>}
        </div>
    )

    render () {
        const { classes } = this.props;
        return (
           <div>
                {this.state.contentLoading ? <CircularProgress/> : (
                <div>

                    {/* Reply Popup */}
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
                                <SubmitButton variant="primary" className={classes.popupButton} type="submit">Reply</SubmitButton>
                                <SubmitButton variant="secondary" className={classes.popupButton} type="submit" onClick={this.handleCancelReply}>Cancel</SubmitButton>
                            </Form>
                        </Backdrop>
                    }

                    {/* Delete Comment Popup */}
                    {this.state.deleteCommentMode && 
                        <Popup open={this.state.deleteCommentMode} classes={classes}>
                                <h3 className={classes.popupMainText}>Are you sure you want to delete this comment?</h3>
                                <p className={classes.popupSubText}>This action cannot be undone...</p>
                                <SubmitButton variant="primary" className={classes.popupButton} type="submit" onClick={(e) => {this.onDeleteComment(e, this.state.commentIDToDelete)}}>Yes</SubmitButton>
                                <SubmitButton variant="secondary" className={classes.popupButton} type="submit" onClick={() => this.setState({deleteCommentMode: false, commentIDToDelete: ''})}>Cancel</SubmitButton>
                        </Popup>
                    }

                    {/* Flag Popup */}
                    {this.state.markAsHarassmentMode && 
                        <Popup open={this.state.markAsHarassmentMode} classes={classes}>
                                <h3 className={classes.popupMainText}>Are you sure you want to flag this post and or user for harassment?</h3>
                                <SubmitButton variant="primary" className={classes.popupButton} type="submit" onClick={(e) => this.markAsHarassment(e, this.state.commentIDToFlag, this.state.commenterToFlag)}>Yes</SubmitButton>
                                <SubmitButton variant="secondary" className={classes.popupButton} type="submit" onClick={() => this.setState({markAsHarassmentMode: false, commentIDToFlag:'', commenterToFlag: ''})}>Cancel</SubmitButton>
                        </Popup>
                    }

                    {/* Delete Reply Popup */}
                    {this.state.deleteReplyMode && 
                        <Popup open={this.state.deleteReplyMode} classes={classes}>
                                <h3 className={classes.popupMainText}>Are you sure you want to delete this reply?</h3>
                                <p className={classes.popupSubText}>This action cannot be undone...</p>
                                <SubmitButton variant="primary" className={classes.popupButton} onClick={(e) => {this.onDeleteReply(e, this.state.commentIDToDeleteReply, this.state.replyToDelete)}}>Yes</SubmitButton>
                                <SubmitButton variant="secondary" className={classes.popupButton} onClick={() => this.setState({deleteReplyMode: false, commentIDToDeleteReply:'', replyToDelete: ''})}>Cancel</SubmitButton>
                        </Popup>
                    }

                    {/* Comment Section */}
                    <Paper className={classes.container}>
                        <p className={classes.commentHeader}>Comments</p>

                        {/* Filter Number of Comments */}
                        <Form>
                            <Form.Group className={classes.container}>
                            <Form.Row className={classes.commentFilterBox}>
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
                        
                        {/* Comments */}
                        <div className={classes.comments}>
                            {this.state.comments.length === 0 && <div className={classes.container}><p>No comments yet :(</p><br/><p>Be the first to leave one below!</p></div>}
                            {this.state.comments.slice(0, this.state.numberOfCommentsToShow).map((comment, index) => (
                                <this.Comment key={index} comment={comment} classes={classes}></this.Comment>
                            ))}
                            {this.state.newCommentsAdded.length > 0 && this.state.comments.length > this.state.numberOfCommentsToShow && this.state.newCommentsAdded.map((comment, index) => (
                                <this.Comment key={index} comment={comment} classes={classes}></this.Comment>
                            ))}
                        </div>

                        {/* Submit Comment */}
                        <Form onSubmit={this.onPostComment}>
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
                </div>
                )}
            </div>
        )
  }
}
Comments.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    uid: state.uid,
    username: state.username
});

const mapActionsToProps = { savePost, unsavePost };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Comments));