//React
import React, { Component } from 'react';
import Nav from './navbar';
import Tooltip from './utils/tooltip';

//React Bootstrap
import SubmitButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

//Redux
import { connect } from 'react-redux';
import { userCreatedPost } from './actions/index';

//Material UI
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './loading';

//Configure toasts
toast.configure();

const styles = {
    form: {
        backgroundColor: '#242323',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#ed6c09'
    },
    fileUpload: {
        alignItems: 'center',
    }
}

//TODO: ERROR HANDLING
//IF MORE THAN 5 FILES UPLOADED, DISPLAY ERROR MESSAGE

//TODO: REDIRECT
//REDIRECT TO EDIT IF POST NOT CREATED

//create post page
class CreatePost extends Component {
    constructor(props) {
        super(props);

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
        this.onSubmit = this.onSubmit.bind(this);
        this.uploadImage = this.uploadImage.bind(this);

        this.state = {
            music: '',
            age: '',
            dayAsOtherPerson: '',
            hobbies: '',
            peeves: '',
            selfRating: '',
            guiltyPleasure: '',
            otherInfo: '',
            uid: '',
            
            //files
            files: null,
            fileList: [],
            fileNames: [],
            numberOfFiles: 0,
            
            loading: true,
        }
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleFileChange(e) {
        let numFiles = this.state.numberOfFiles + e.target.files.length;
        console.log(this.state.files);
        if (numFiles <= 5){
            let fileNames = this.state.fileNames;
            let fileList = this.state.fileList;
            for (let i = 0; i < e.target.files.length; i++){
                fileNames.push(e.target.files[i].name);
                fileList.push(e.target.files[i]);
            }
            this.setState({fileList: fileList, fileNames: fileNames, numberOfFiles: numFiles});
        }
        else{
            toast.error('You cannot upload more than 5 images! Please delete images before trying again', {
                style: { fontFamily: 'Roboto Mono, monospace', textAlign:'left' },
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            e.target.value = null;
        }
      }

    onDeleteFile(e, fileName) {
        e.preventDefault();

        var newFileNames = this.state.fileNames.filter(function(element) { return element !== fileName });
        var newFileList = this.state.fileList.filter(function(element) { return element.name !== fileName });
        var newNumberOfFiles  = this.state.numberOfFiles - 1;

        console.log("new file names", newFileNames);
        console.log("new file list", newFileList);

        this.setState({fileNames: newFileNames, fileList: newFileList, numberOfFiles: newNumberOfFiles});
    }

    handleAuthChange(user) {
        if (user) {
            //user hasn't created username yet
            if (this.props.username === '') {
                window.location = '/set-username';
            }

            if (this.props.createdPost){
                window.location = '/posts/' + user.uid;
            }
            this.setState({loading: false, uid: user.uid})
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

        this.setState({loading: true});
        var fileURLS = [];
        if (this.state.fileList.length > 0) {
            // 3. Loop over all the files
            for (var i = 0; i < this.state.fileList.length; i++) {
                // 3A. Get a file to upload...
                // We only want to upload files still in the fileNames list
                const imageFile = this.state.fileList[i];

                // 3B. handleFileUploadOnFirebaseStorage function is in above section
                const downloadFileResponse = await this.uploadImage(imageFile);
                
                // 3C. Push the download url to URLs array
                fileURLS.push(downloadFileResponse);
            }
            console.log(fileURLS);          
        }

        var user = firebase.auth().currentUser;

        //add post in firestore
        firebase.firestore().collection("posts").doc(this.state.uid).set({
            music: this.state.music,
            age: this.state.age,
            dayAsOtherPerson: this.state.dayAsOtherPerson,
            hobbies: this.state.hobbies,
            peeves: this.state.peeves,
            selfRating: this.state.selfRating,
            guiltyPleasure: this.state.guiltyPleasure,
            otherInfo: this.state.otherInfo,
            fileURLS: fileURLS})
        .then(() => {
            //change user's created post attribute to true
            firebase.firestore().collection("users").doc(user.uid.toString()).update({
                createdPost: true
            })
            .then(() => {
                this.props.userCreatedPost();
            })
            .then(() => {window.location = '/'})
        })
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
    


    render () {
        const { classes } = this.props;
        return (
            <div style={{padding: '100px 0px 200px 0px'}}>
                {this.state.loading ? (<Loading/>) : (
                <div>
                <Nav/>
                <h1>Create post...</h1>
                <Form className={classes.form}  onSubmit={this.onSubmit}>


                { /*file upload*/ }
                <Form.Group>
                    <Form.Label>Upload images of yourself</Form.Label>
                    <p style={{marginTop: '-50px'}}>     </p>
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

                {this.state.numberOfFiles > 0 && (
                    <div>
                    <strong>Files uploaded:</strong>
                    {this.state.fileNames.map((fileName) => 
                        <div>
                        <p style={{display: 'inline-block'}}>{fileName}</p>
                        <Tooltip message="Delete Image">
                            <Button color="secondary" onClick={(e) => this.onDeleteFile(e, fileName)}><DeleteForeverIcon></DeleteForeverIcon></Button>
                        </Tooltip>
                        </div>
                    )}
                    </div>
                )}

                    { /*optional fields*/ }
                    <div style={{padding:'35px'}}></div>
                    <strong>
                        The following are optional; feel free to answer as many or as few as you would like
                    </strong>

                    { /*music*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{float:'left'}}>
                            What music do you currently have on rotation?
                        </Form.Label>
                        <Form.Control 
                        onChange={this.onChangeMusic} 
                        value={this.state.music} 
                        as="textarea" 
                        rows={1} 
                        placeholder="" />
                    </Form.Group>

                    { /*age*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{float:'left'}}>
                            How old are you?
                        </Form.Label>
                        <Form.Control 
                        onChange={this.onChangeAge} 
                        value={this.state.age} 
                        as="textarea" rows={1} 
                        placeholder="" />
                    </Form.Group>

                    { /*day as other person*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{float:'left'}}>
                            If you could spend a day as anyone, dead or alive, who would it be?
                        </Form.Label>
                        <Form.Control 
                        onChange={this.onChangeDayAsOtherPerson} 
                        value={this.state.dayAsOtherPerson} 
                        as="textarea" rows={1} 
                        placeholder="" />
                    </Form.Group>

                    { /*hobbies*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{float:'left'}}>
                            What do you enjoy doing in your spare time?
                        </Form.Label>
                        <Form.Control 
                        onChange={this.onChangeHobbies} 
                        value={this.state.hobbies} 
                        as="textarea" 
                        rows={1} 
                        placeholder="" />
                    </Form.Group>

                    { /*peeves*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{float:'left'}}>
                            What pisses you off the most?
                        </Form.Label>
                        <Form.Control 
                        onChange={this.onChangePeeves}
                        value={this.state.peeves} 
                        as="textarea" 
                        rows={1} 
                        placeholder="" />
                    </Form.Group>

                    { /*self rating*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{float:'left'}}>
                            Rate your looks on a scale from 1-10
                        </Form.Label>
                        <Form.Control 
                        onChange={this.onChangeSelfRating} 
                        value={this.state.selfRating} 
                        as="textarea" 
                        rows={1} 
                        placeholder="" />
                    </Form.Group>

                    { /*guilty pleasure*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{float:'left'}}>
                            What is you guilty pleasure?
                        </Form.Label>
                        <Form.Control 
                        onChange={this.onChangeGuiltyPleasure} 
                        value={this.state.guiltyPleasure} 
                        as="textarea" 
                        rows={1} 
                        placeholder="" />
                    </Form.Group>

                    { /*additional info*/ }
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{float:'left'}}>
                            Anything else you want to let people know...
                        </Form.Label>
                        <Form.Control 
                        onChange={this.onChangeOtherInfo}
                        value={this.state.otherInfo}  
                        as="textarea" 
                        rows={3} 
                        placeholder="" />
                    </Form.Group>
                    
                    { /*submit*/ }
                    {this.state.loading ? (<CircularProgress/>) : (
                    <SubmitButton variant="primary" type="submit">
                        Submit
                    </SubmitButton>)
                    }

                    </Form>
                    </div>
                    )}
            </div>
        )
  }
}

CreatePost.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    createdPost: state.createdPost,
    username: state.username
})

const mapActionsToProps = { userCreatedPost };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(CreatePost))

