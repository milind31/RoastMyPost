//React
import React, { Component } from 'react';
import Nav from './navbar';
import Tooltip from './utils/tooltip';
import Popup from './utils/popup';

//Redux
import { connect } from 'react-redux';
import { userDeletedPost } from './actions/index';

//React Bootstrap
import SubmitButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

//Material UI
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

//Toasts
import { errorToast, infoToast } from './utils/toast';

const styles = ((theme) => ({
    form: {
        alignItems: 'center',
        background: "#333131", 
        color:'white'
    },
    button: {
        backgroundColor: '#ed6c09'
    },
    paper: {
        background: "#333131", 
        padding: '15px 30px 15px 30px'
    },
    mainDiv: {
        padding: '100px 0px 200px 0px'
    },
    fileUpload: {
        alignItems: 'center',
    },
    container: {
        background: "#333131"
    },
    formLabel: {
        float: 'left'
    },
    fileName: {
        display: 'inline-block'
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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1, 
        color: '#fff',
        marginTop: '-50px'
    },
}))

//create post page
class EditPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //bio fields
            music: '',
            age: '',
            dayAsOtherPerson: '',
            hobbies: '',
            peeves: '',
            selfRating: '',
            guiltyPleasure: '',
            otherInfo: '',

            //files
            fileURLS: [],
            newFiles: [],
            newFileNames: [], 
            numberOfFiles: 0,

            //popups
            deletePostMode: false,

            //loading
            loadingSubmit: false,
            loadingDelete: false,
        }

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.onChangeMusic = this.onChangeMusic.bind(this);
        this.onChangeAge = this.onChangeAge.bind(this);
        this.onChangeDayAsOtherPerson = this.onChangeDayAsOtherPerson.bind(this);
        this.onChangeHobbies = this.onChangeHobbies.bind(this);
        this.onChangePeeves = this.onChangePeeves.bind(this);
        this.onChangeSelfRating = this.onChangeSelfRating.bind(this);
        this.onChangeGuiltyPleasure = this.onChangeGuiltyPleasure.bind(this);
        this.onChangeOtherInfo = this.onChangeOtherInfo.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.onDeleteFileFromThumbnail = this.onDeleteFileFromThumbnail.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleFileChange(e) {
        let numFiles = this.state.numberOfFiles + e.target.files.length;

        if (numFiles <= 5){
            let newFileNames = this.state.newFileNames;
            let newFiles = this.state.newFiles;
            for (let i = 0; i < e.target.files.length; i++){
                if (e.target.files[i].name.slice(-4) !== '.png' && e.target.files[i].name.slice(-4) !== '.jpg' && e.target.files[i].name.slice(-5) !== '.jpeg') {
                    errorToast('Please only upload .png or .jpg files!');
                    continue;
                }
                newFileNames.push(e.target.files[i].name);
                newFiles.push(e.target.files[i]);
            }
            this.setState({newFiles: newFiles, newFileNames: newFileNames, numberOfFiles: numFiles});
        }
        else{
            errorToast('You cannot upload more than 5 images! Please delete images before trying again');
            e.target.value = null;
        }
    }

    handleAuthChange(user) {
        if (user) {
            //user is logged in
            //user hasn't created username yet
            if (this.props.username === '') {
                window.location = '/set-username';
            }

            if (user.uid !== this.props.match.params.id) {
                window.location = '/';
            }
            else {
                firebase.firestore().collection('posts').doc(user.uid).get()
                .then((docData) => {
                    this.setState({
                        music: docData.data().music,
                        age: docData.data().age,
                        dayAsOtherPerson: docData.data().dayAsOtherPerson,
                        hobbies: docData.data().hobbies,
                        peeves: docData.data().peeves,
                        selfRating: docData.data().selfRating,
                        guiltyPleasure: docData.data().guiltyPleasure,
                        otherInfo: docData.data().otherInfo,
                        fileURLS: docData.data().fileURLS,
                        numberOfFiles: docData.data().fileURLS.length,
                    })
                })
            }
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }

    onChangeMusic(e) {
        this.setState({
            music: e.target.value
        });
    }

    onChangeAge(e) {
        this.setState({
            age: e.target.value
        });
    }

    onChangeDayAsOtherPerson(e) {
        this.setState({
            dayAsOtherPerson: e.target.value
        });
    }

    onChangeHobbies(e) {
        this.setState({
            hobbies: e.target.value
        });
    }

    onChangePeeves(e) {
        this.setState({
            peeves: e.target.value
        });
    }

    onChangeSelfRating(e) {
        this.setState({
            selfRating: e.target.value
        });
    }

    onChangeGuiltyPleasure(e) {
        this.setState({
            guiltyPleasure: e.target.value
        });
    }

    onChangeOtherInfo(e) {
        this.setState({
            otherInfo: e.target.value
        });
    }

    onSubmit = async (e) =>{
        e.preventDefault();

        let numFiles = this.state.numberOfFiles;

        if (numFiles === 0){
            errorToast("Remember, you must have at least one image uploaded!")
            return;
        }

        this.setState({loadingSubmit: true});

        var user = firebase.auth().currentUser;
        var fileURLS = this.state.fileURLS;
        if (this.state.newFiles.length > 0){
            if (this.state.files !== []) {
                // 3. Loop over all the files
                for (var i = 0; i < this.state.newFiles.length; i++) {
                    // 3A. Get a file to upload
                    const imageFile = this.state.newFiles[i];

                    // 3B. handleFileUploadOnFirebaseStorage function is in above section
                    const downloadFileResponse = await this.uploadImage(imageFile);
                    
                    // 3C. Push the download url to URLs array
                    fileURLS.push(downloadFileResponse);
                }
                console.log(fileURLS);          
            }
        }
        else{
            fileURLS = this.state.fileURLS
        }

        //add post in firestore
        firebase.firestore().collection("posts").doc(user.uid.toString()).update({
            music: this.state.music,
            age: this.state.age,
            dayAsOtherPerson: this.state.dayAsOtherPerson,
            hobbies: this.state.hobbies,
            peeves: this.state.peeves,
            selfRating: this.state.selfRating,
            guiltyPleasure: this.state.guiltyPleasure,
            otherInfo: this.state.otherInfo,
            fileURLS: fileURLS})
        .then(() => {this.setState({loadingSubmit: false}); window.location = '/';})
        .catch((err) => {console.log(err)})
    }

    uploadImage = async (imageFile) => {
        // 1. If no file, return
        if (imageFile === "") return "";

        // 2. Put the file into bucketName
        const uploadTask = await firebase.storage().ref().child('images/' + imageFile.name).put(imageFile);
        
        // 3. Get download URL and return it as 
        return uploadTask.ref.getDownloadURL().then((fileURL) => fileURL);
    }
    
    imageThumbnails = () => (
        <div style={{marginTop:'-75px'}}>
                    <Container>
                    <Row>
                        {this.state.fileURLS.length !== 0 && this.state.fileURLS.map((url, index) => (
                            <Col xs={6} md={4}>
                                <Image thumbnail  src={url}></Image>
                                <Tooltip message="Delete Image" location="bottom">
                                    <Button color="primary"onClick={(e) => {this.onDeleteFileFromThumbnail(e, url)}}><DeleteForeverIcon/></Button>
                                </Tooltip>
                            </Col>
                        ))}
                    </Row>
                    </Container>
                </div>
    )

    //delete previously uploaded image
    onDeleteFileFromThumbnail(e, url) {
        let fileURLS = this.state.fileURLS;

        var idx = fileURLS.findIndex(item => item===url);
        fileURLS.splice(idx,1);   

        var newNumberOfFiles = this.state.numberOfFiles - 1;

        infoToast('Image temporarily deleted! Click submit below to save this change')

        //save to state
        this.setState({fileURLS: fileURLS, numberOfFiles: newNumberOfFiles});
    }

    //delete file that hasn't been updated in firestore
    onDeleteNewFile(e, fileName) {
        e.preventDefault();

        let newFileNames = this.state.newFileNames;
        let newFiles = this.state.newFiles;

        var idx = newFileNames.findIndex(item => item===fileName);
        newFileNames.splice(idx,1);   

        idx = newFiles.findIndex(item => item.name===fileName);
        newFiles.splice(idx,1);   

        var newNumberOfFiles  = this.state.numberOfFiles - 1;

        this.setState({newFileNames: newFileNames, newFiles: newFiles, numberOfFiles: newNumberOfFiles});
    }

    deletePost(){
        this.setState({loadingDelete: true});
        let t = this;
        // delete post from firestore
        firebase.firestore().collection("posts").doc(this.props.match.params.id).delete()
        .then(() => {
            //delete associated comments/scores from firestore
            return firebase.firestore().collection("comments").where("postOwner", "==", t.props.match.params.id).get()
            .then(querySnapshot =>  {
                //if there are no comments, trying to delete scores will not work, so just delete saves and notifications
                if (querySnapshot.empty) {
                    //delete associated saves from firestore
                    return firebase.firestore().collection('saves').where("postOwnerID", "==", t.props.match.params.id).get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            doc.ref.delete();
                        })
                        //delete associated notifications from firestore
                        return firebase.firestore().collection('notifications').where("post", "==", t.props.match.params.id).get()
                        .then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                doc.ref.delete();
                            })
                            //update user document to reflect deleted post
                            return firebase.firestore().collection("users").doc(t.props.match.params.id).update({
                                createdPost: false
                            })
                            .then(() => {
                                t.props.userDeletedPost();
                                t.setState({deletePostMode:false, loadingDelete: false});
                                window.location = '/';
                            })
                        })
                    })
                }
                //if there are comments delete its scores before deleting saves and notifications
                querySnapshot.forEach(function(comment) {
                    //delete scores from each comment
                    return firebase.firestore().collection('scores').where("comment", "==", comment.id).get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(score) {
                            score.ref.delete();
                        })
                        comment.ref.delete();
                        //delete associated saves from firestore
                        return firebase.firestore().collection('saves').where("postOwnerID", "==", t.props.match.params.id).get()
                        .then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                doc.ref.delete();
                            })
                            //delete associated notifications from firestore
                            return firebase.firestore().collection('notifications').where("post", "==", t.props.match.params.id).get()
                            .then(function(querySnapshot) {
                                querySnapshot.forEach(function(doc) {
                                    doc.ref.delete();
                                })
                                //update user document to reflect deleted post
                                return firebase.firestore().collection("users").doc(t.props.match.params.id).update({
                                    createdPost: false
                                })
                                .then(() => {
                                    t.props.userDeletedPost();
                                    t.setState({deletePostMode:false, loadingDelete: false});
                                    window.location = '/';
                                })
                            })
                        })
                    })
                })
            })
        })
        .catch((err) => {console.log(err)})
    }

    render () {
        const { classes } = this.props;
        return (
            <div>
                {/* delete post popup */}
                {this.state.deletePostMode && 
                    <Popup open={this.state.deletePostMode} classes={classes}>
                        <h3 className={classes.popupMainText}>Are you sure you want to delete this post?</h3>
                        <p className={classes.popupSubText}>This action cannot be undone...</p>
                        {this.state.loadingDelete ? <CircularProgress/> : (<div>
                            <SubmitButton variant="primary" className={classes.popupButton} onClick={() => {this.deletePost()}}>Yes</SubmitButton>
                            <SubmitButton variant="secondary" className={classes.popupButton} onClick={() => this.setState({deletePostMode: false})}>Cancel</SubmitButton>
                        </div>)}
                    </Popup>
                }

                <div className={classes.mainDiv}>
                    <Nav/>
                    <Paper className={classes.paper}>
                    <h1 style={{paddingTop:'40px'}}>Edit post...</h1>
                    <Form className={classes.form} onSubmit={this.onSubmit}>

                        {/* file upload */}
                        <Form.Group>
                            <Form.Label>Upload new images of yourself</Form.Label>
                            <p style={{marginTop: '-50px'}}></p>
                            <div style={{display: 'inline-block'}}>
                            <Form.File 
                                onChange={this.handleFileChange} 
                                className={classes.fileUpload} 
                                id="exampleFormControlFile1" 
                                multiple/>
                            </div>
                            <Form.Text style={{paddingTop: '10px'}} className="text-muted">
                                    Required: please upload 1-5 images
                            </Form.Text>
                        </Form.Group>
                        
                        {/* previously uploaded image thumbnails */}
                        {!!!this.state.filesUploaded && this.state.fileURLS.length > 0 && (
                            <div>
                                <Form.Label style={{paddingBottom: '20px'}}>
                                        Currently uploaded images:
                                </Form.Label>
                                <this.imageThumbnails/>
                            </div>
                            )
                        }

                        {/* newly uploaded files */}
                        {this.state.newFiles.length > 0 && (
                            <div>
                            <strong>Newly uploaded files:</strong>
                            {this.state.newFileNames.map((fileName) => 
                                <div>
                                <p className={classes.fileName}>{fileName}</p>
                                <Tooltip message="Delete Image">
                                    <Button color="secondary" onClick={(e) => this.onDeleteNewFile(e, fileName)}><DeleteForeverIcon></DeleteForeverIcon></Button>
                                </Tooltip>
                                </div>
                            )}
                            </div>
                        )}

                        {/* optional fields */}
                        <br/>
                        <div></div>

                        {/* music */}
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label className={classes.formLabel}>
                                What music do you currently have on rotation?
                            </Form.Label>
                            <Form.Control 
                            onChange={this.onChangeMusic} 
                            value={this.state.music} 
                            as="textarea" 
                            rows={1} 
                            placeholder="" />
                        </Form.Group>

                        {/* age */}
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label className={classes.formLabel}>
                                How old are you?
                            </Form.Label>
                            <Form.Control 
                            onChange={this.onChangeAge} 
                            value={this.state.age} 
                            as="textarea" rows={1} 
                            placeholder="" />
                        </Form.Group>

                        {/* day as other person */}
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label className={classes.formLabel}>
                                If you could spend a day as anyone, dead or alive, who would it be?
                            </Form.Label>
                            <Form.Control 
                            onChange={this.onChangeDayAsOtherPerson} 
                            value={this.state.dayAsOtherPerson} 
                            as="textarea" rows={1} 
                            placeholder="" />
                        </Form.Group>

                        {/* hobbies */}
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label className={classes.formLabel}>
                                What do you enjoy doing in your spare time?
                            </Form.Label>
                            <Form.Control 
                            onChange={this.onChangeHobbies} 
                            value={this.state.hobbies} 
                            as="textarea" 
                            rows={1} 
                            placeholder="" />
                        </Form.Group>

                        {/* peeves */}
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label className={classes.formLabel}>
                                What pisses you off the most?
                            </Form.Label>
                            <Form.Control 
                            onChange={this.onChangePeeves}
                            value={this.state.peeves} 
                            as="textarea" 
                            rows={1} 
                            placeholder="" />
                        </Form.Group>

                        {/* self rating */}
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label className={classes.formLabel}>
                                Rate your looks on a scale from 1-10
                            </Form.Label>
                            <Form.Control 
                            onChange={this.onChangeSelfRating} 
                            value={this.state.selfRating} 
                            as="textarea" 
                            rows={1} 
                            placeholder="" />
                        </Form.Group>

                        {/* guilty pleasure */}
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label className={classes.formLabel}>
                                What is you guilty pleasure?
                            </Form.Label>
                            <Form.Control 
                            onChange={this.onChangeGuiltyPleasure} 
                            value={this.state.guiltyPleasure} 
                            as="textarea" 
                            rows={1} 
                            placeholder="" />
                        </Form.Group>

                        {/* additional info */}
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label className={classes.formLabel}>
                                Anything else you want to let people know...
                            </Form.Label>
                            <Form.Control 
                            onChange={this.onChangeOtherInfo}
                            value={this.state.otherInfo}  
                            as="textarea" 
                            rows={3} 
                            placeholder="" />
                        </Form.Group>
                        
                        {/* submit */}
                        {this.state.loadingSubmit ? <CircularProgress/> : (
                            <SubmitButton variant="primary" type="submit">
                                Submit
                            </SubmitButton>
                        )}
                        {/* end optional fields */}
                    </Form>
                </Paper>
                <Button color="primary" style={{marginTop: '125px'}} onClick={() => this.setState({deletePostMode: true})}>Delete Post</Button>

                </div>
            </div>
        )
  }
}

EditPost.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    username: state.username
})

const mapActionsToProps = { userDeletedPost };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(EditPost));
