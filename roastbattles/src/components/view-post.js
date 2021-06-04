//React
import React, { Component, Fragment } from 'react';
import Nav from './navbar';

//React Bootstrap
import SubmitButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

//Material UI
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
/*import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';*/
import withStyles from '@material-ui/core/styles/withStyles';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import DeleteIcon from '@material-ui/icons/Delete';
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

var Carousel = require('react-responsive-carousel').Carousel;

const styles = {
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
        background: "#333131"
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
    comment: {
        textAlign: 'left',
        backgroundColor: '#333131',
        color: 'white'
    },
    comments: {
        paddingTop: '50px',
        backgroundColor: '#333131',
    },
    scoreBar: {
        marginBottom: '-10px',
    },
    scoringButtons: {
        backgroundColor: '#333131',
        float: 'right'
    },
    saveButton: {
        float: 'right'
    }
}

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
            profileImage: null,
            
            //Determine if logged in user's post
            usersPost: true,

            //User's UID
            uid: '',

            //Comment Section
            commentLeft: '',
            comments: [],
            commentsToShow: [],
            numberOfCommentsToShow: 10,
            commentDeleteDialogueOpen: false,

            //Saving
            postSaved: false,

            //Loading
            loading: true
        }

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.onPostComment = this.onPostComment.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.onDeleteComment = this.onDeleteComment.bind(this);
        this.onChangeNumberOfComments = this.onChangeNumberOfComments.bind(this);
        this.getNewPost = this.getNewPost.bind(this);
        this.savePost = this.savePost.bind(this);
        this.unsavePost = this.unsavePost.bind(this);
        this.scoreComment = this.scoreComment.bind(this);
        this.getSavedStatus = this.getSavedStatus.bind(this); //used as helper function to getCommentsAndSavedStatus()
        this.getCommentsAndSavedStatus = this.getCommentsAndSavedStatus.bind(this);
        this.getPostInfo = this.getPostInfo.bind(this);
        this.Comment = this.Comment.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            this.setState({uid: user.uid});
            this.getPostInfo(user);
            this.getCommentsAndSavedStatus();
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
                    username: user.displayName,
                    music: docData.data().music,
                    age: docData.data().age,
                    dayAsOtherPerson: docData.data().dayAsOtherPerson,
                    hobbies: docData.data().hobbies,
                    peeves: docData.data().peeves,
                    selfRating: docData.data().selfRating,
                    guiltyPleasure: docData.data().guiltyPleasure,
                    otherInfo: docData.data().otherInfo,
                    files: docData.data().fileURLS,
                })
            })
        }
        else {
            firebase.firestore().collection('posts').doc(this.props.match.params.id).get()
            .then((docData) => {
                this.setState({
                    username: this.props.match.params.id,
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
                })
            })
        }
    }

    onPostComment(e) {
        e.preventDefault();

        var user = firebase.auth().currentUser;

        //add document to firestore
        firebase.firestore().collection("comments").add({
            comment: this.state.commentLeft,
            postOwner: this.props.match.params.id,
            commenter:  user.uid,
            totalScore: 0,
            numScores: 0,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            
            //update state
            const comment = {
                commentBody: this.state.commentLeft,
                commenter:  user.uid,
                postOwner: this.props.match.params.id,
                timeStamp: "just now",
                id: docRef.id,
                userScore: 0,
                totalScore: 0,
                numScores: 0,
            }
            let comments = this.state.comments;
            comments.push(comment);
            this.setState({commentLeft: '', comments: comments});
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    scoreComment(e, score, id) {
        e.preventDefault();

        var user = firebase.auth().currentUser;


        let comments = this.state.comments;
        let index = comments.slice(0, this.state.numberOfCommentsToShow).findIndex((comment => comment.id === id));
        comments[index].userScore = score;
        comments[index].totalScore += score;
        comments[index].numScores += 1;
        this.setState({comments: comments})

        firebase.firestore().collection("comments").doc(id).update({
            totalScore: comments[index].totalScore,
            numScores: comments[index].numScores
        })

        //add document to firestore
        firebase.firestore().collection("scores").add({
            user: user.uid,
            comment: comments[index].id,
            score: score
        });

        console.log("score", score);
    }

    onDeleteComment(e, id) {
        e.preventDefault();

        firebase.firestore().collection("comments").doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });

        let comments = this.state.comments;
        comments = comments.filter(function( obj ) {
            return obj.id !== id;
        });
        this.setState({comments: comments});
    }

    onChangeComment(e) {
        this.setState({
            commentLeft: e.target.value,
        });
    }

    //Move to new file later
    Comment = props => (
        <div className={props.classes.comment}>
            <p>
                <a href={"/posts/" + props.comment.commenter} 
                    style={{textDecoration:'none'}}
                    >{props.comment.commenter}
                </a>
                {(props.comment.commenter === props.comment.postOwner) && <WhatshotIcon/>}
                <p style={{float:'right', paddingRight: '20px'}}>Score: {isNaN(props.comment.totalScore / props.comment.numScores) ? "-" : (props.comment.totalScore / props.comment.numScores).toFixed(2)}</p>
            </p>

            <p style={{fontSize: '125%'}}>{props.comment.commentBody}</p>
            <small>{props.comment.timeStamp.toString()}</small>
            {(props.comment.commenter !== this.state.uid) && (<Fragment className={props.classes.scoreBar}>
                                                                    <Button 
                                                                        style={{float: 'right', marginBottom: '20px'}} 
                                                                        onClick={(e) => {this.scoreComment(e, 4, props.comment.id)}} 
                                                                        color={props.comment.userScore === 0 ? "secondary" : "primary"}
                                                                        disabled={props.comment.userScore !== 0 && props.comment.userScore !== 4}
                                                                        >4
                                                                    </Button> 
                                                                        <Button 
                                                                        style={{float: 'right', marginBottom: '20px'}} 
                                                                        onClick={(e) => {this.scoreComment(e, 3, props.comment.id)}} 
                                                                        color={props.comment.userScore === 0 ? "secondary" : "primary"}
                                                                        disabled={props.comment.userScore !== 0 && props.comment.userScore !== 3}
                                                                        >3
                                                                    </Button>
                                                                    <Button 
                                                                        style={{float: 'right', marginBottom: '20px'}} 
                                                                        onClick={(e) => {this.scoreComment(e, 2, props.comment.id)}} 
                                                                        color={props.comment.userScore === 0 ? "secondary" : "primary"}
                                                                        disabled={props.comment.userScore !== 0 && props.comment.userScore !== 2}
                                                                        >2
                                                                    </Button>
                                                                    <Button 
                                                                        style={{float: 'right', marginBottom: '20px'}} 
                                                                        onClick={(e) => {this.scoreComment(e, 1, props.comment.id)}} 
                                                                        color={props.comment.userScore === 0 ? "secondary" : "primary"}
                                                                        disabled={props.comment.userScore !== 0 && props.comment.userScore !== 1}
                                                                        >1
                                                                    </Button>
                                                             </Fragment>
                                                             )} 

            {this.state.uid === props.comment.commenter &&
            <OverlayTrigger
                placement='top'
                overlay={
                <div style={{borderRadius: "5px", backgroundColor:'black'}}>
                    <p style={{marginBottom:'0px'}}>Delete Post</p>
                </div>
                }
            ><Button color="primary" style={{backgroundColor:'transparent'}} onClick={() => this.setState({commentDeleteDialogueOpen: true})}>
                <DeleteIcon/>
            </Button>
          </OverlayTrigger>}
                
            <hr style={{color: '#5c5c5c', backgroundColor:'#5c5c5c'}}></hr>
        </div>
    )

    getSavedStatus() {
        var user = firebase.auth().currentUser;

        firebase.firestore().collection('saves').where("saver", "==", user.uid).where("postOwner", "==", this.props.match.params.id).get()
        .then((docData) => {
            console.log(docData);
            if (docData.size > 0){
                this.setState({postSaved: true});
            }
            else{
                this.setState({postSaved: false});
            }
        })
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
                        var score = 0
                        if (data.size > 0){
                            data.forEach((doc) => {
                                score = doc.data().score;
                            })
                        }
                        return score;
                    })
                    .then((score) => {
                        const comment = {
                            commentBody: doc.data().comment,
                            commenter: doc.data().commenter,
                            postOwner: doc.data().postOwner,
                            timeStamp: doc.data().timeStamp.toDate(),
                            id: doc.id,
                            totalScore: doc.data().totalScore,
                            numScores: doc.data().numScores,
                            userScore: score
                        }
                        comments.push(comment);
                    })
                })
                return comments
            })
            .then((comments) => {
                this.setState({comments: comments}, () => {this.getSavedStatus()});
            })
            .then(() => {return});
    }

    onChangeNumberOfComments(e) {
        e.preventDefault();

        this.setState({
            numberOfCommentsToShow: e.target.value
        })
        console.log(this.state.comments)
        console.log(e.target.value);
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

    savePost(e){
        e.preventDefault();

        var user = firebase.auth().currentUser;

        //add document to firestore
        firebase.firestore().collection("saves").add({
            saver: user.uid,
            postOwner: this.props.match.params.id,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            //update state
            this.setState({postSaved: true});
        })
        .catch((error) => {
            console.error("Error adding save document: ", error);
        });
    }

    unsavePost(e){
        e.preventDefault();

        var user = firebase.auth().currentUser;

        //add document to firestore
        firebase.firestore().collection('saves').where("saver", "==", user.uid).where("postOwner", "==", this.props.match.params.id).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              doc.ref.delete();
            })
        })
        .then(() => {
            console.log("Save document successfully deleted");
            this.setState({postSaved: false});
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

    render () {
        const { classes } = this.props;
        return (
           <div>
               <Nav/>
               
               {/* Profile */}
               <Paper className={classes.container}>
                    <h1 className={classes.header}>User #{this.props.match.params.id.replace(/\D/g, "") /* REGEX IS ONLY TEMPORARY (...unless) */}</h1>
                    {!this.state.usersPost && (this.state.postSaved ? <this.SavedButton classes={classes}/> : <this.UnsavedButton classes={classes}/>) }
                    <div className={classes.container} style={{paddingBottom:'75px'}}/>
                    <Carousel showArrows={true} showThumbs={false} dynamicHeight={true} infiniteLoop={true} autoPlay={false}>
                        {this.state.files.map((url, index) => (
                        <img key={index} src={url} style={{height:'auto',width:'800px'}} />
                        ))}
                    </Carousel>
                    {/*<img className={classes.media} src={this.state.files[0]}></img>*/}
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

                {/* Comment Section */}
                <Paper className={classes.container}>
                    {/* Header */}
                    <p className={classes.commentHeader}>Comments</p>
                    <Form>
                        <Form.Group className={classes.container}>
                        <Form.Row style = {{float:'left', marginTop:'-8px', marginLeft:'10px'}} className={classes.container}>
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
                    {this.state.comments.slice(0, this.state.numberOfCommentsToShow).map((comment) => (
                        <this.Comment comment={comment} classes={classes}></this.Comment>
                        ))}
                    </div>

                    <Form className={classes.form} onSubmit={this.onPostComment}>
                        <Form.Group className={classes.container} controlId="exampleForm.ControlTextarea1">
                            <Form.Control 
                            onChange={this.onChangeComment} 
                            value={this.state.commentLeft} 
                            as="textarea" rows={2}
                            placeholder="Leave comment here..." />
                        </Form.Group>
                        <SubmitButton variant="primary" type="submit">Post Comment</SubmitButton>
                    </Form>
                </Paper>

                { !!!this.state.usersPost && <Button className={classes.newPostButton} color="primary" onClick={this.getNewPost}>Find New Post</Button>}
            </div>
        )
  }
}
ViewPost.propTypes = {
    classes: PropTypes.object.isRequired
}


export default (withStyles(styles)(ViewPost));
