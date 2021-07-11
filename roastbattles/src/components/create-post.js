//React
import React, { Component } from 'react';
import Nav from './navbar';
import TooltipButton from './utils/tooltip-button';
import Loading from './loading';
import FormField from './utils/form-field';

//React Bootstrap
import SubmitButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

//Redux
import { connect } from 'react-redux';
import { userCreatedPost } from './actions/index';

//Material UI
import Paper from '@material-ui/core/Paper';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

//Toasts
import { errorToast } from './utils/toast';

//Styling
import { styles } from './styles/create-post-styles';

//create post page
class CreatePost extends Component {
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
            uid: '',
            
            //files
            files: null,
            fileList: [],
            fileNames: [],
            numberOfFiles: 0,
            
            loading: true,
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
        this.onSubmit = this.onSubmit.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
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

    handleFileChange(e) {
        let numFiles = this.state.numberOfFiles + e.target.files.length;
        console.log(this.state.files);
        if (numFiles <= 5){
            let fileNames = this.state.fileNames;
            let fileList = this.state.fileList;
            for (let i = 0; i < e.target.files.length; i++){
                if (e.target.files[i].name.slice(-4) !== '.png' && e.target.files[i].name.slice(-4) !== '.jpg' && e.target.files[i].name.slice(-5) !== '.jpeg') {
                    errorToast('Please only upload .png or .jpg files!');
                    continue;
                }
                if (e.target.files[i].size / 1024 / 1024 > 4) { // in MiB
                    errorToast('Files must be less than 4MiB!');
                    continue;
                }
                fileNames.push(e.target.files[i].name);
                fileList.push(e.target.files[i]);
            }
            this.setState({fileList: fileList, fileNames: fileNames, numberOfFiles: numFiles});
        }
        else{
            errorToast('You cannot upload more than 5 images! Please delete images before trying again');
            e.target.value = null;
        }
      }

    onDeleteFile(e, fileName) {
        e.preventDefault();

        var newFileNames = this.state.fileNames.filter(function(element) { return element !== fileName });
        var newFileList = this.state.fileList.filter(function(element) { return element.name !== fileName });
        var newNumberOfFiles  = this.state.numberOfFiles - 1;

        this.setState({fileNames: newFileNames, fileList: newFileList, numberOfFiles: newNumberOfFiles});
    }

    onChangeMusic(e) {
        this.setState({music: e.target.value});
    }

    onChangeAge(e) {
        this.setState({age: e.target.value});
    }

    onChangeDayAsOtherPerson(e) {
        this.setState({dayAsOtherPerson: e.target.value});
    }

    onChangeHobbies(e) {
        this.setState({hobbies: e.target.value});
    }

    onChangePeeves(e) {
        this.setState({peeves: e.target.value});
    }

    onChangeSelfRating(e) {
        this.setState({selfRating: e.target.value});
    }

    onChangeGuiltyPleasure(e) {
        this.setState({guiltyPleasure: e.target.value});
    }

    onChangeOtherInfo(e) {
        this.setState({otherInfo: e.target.value});
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
        }
        else {
            errorToast("You must upload at least one image!")
            this.setState({loading: false});
            return;
        }

        var user = firebase.auth().currentUser;

        //add post in firestore
        firebase.firestore().collection("posts").doc(this.state.uid).set({
            username: this.props.username,
            music: this.state.music,
            age: this.state.age,
            dayAsOtherPerson: this.state.dayAsOtherPerson,
            hobbies: this.state.hobbies,
            peeves: this.state.peeves,
            selfRating: this.state.selfRating,
            guiltyPleasure: this.state.guiltyPleasure,
            otherInfo: this.state.otherInfo,
            fileURLS: fileURLS,
            approved: true,
        })
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
            <div className={classes.mainDiv} style={{padding: '50px 75px 250px 75px'}}>
                {this.state.loading ? (<Loading/>) : (
                <div>
                    <Nav/>
                    <Paper className={classes.paper}>
                    <h1 style={{paddingTop:'40px'}}>Create post...</h1>
                    <Form className={classes.form} onSubmit={this.onSubmit}>

                        { /* file upload */ }
                        <Form.Group>
                            <Form.Label>Upload images of yourself</Form.Label>
                            <p style={{marginTop:'-50px'}}>     </p>
                            <div className={classes.fileName}>
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

                        {/* show files uploaded */}
                        {this.state.fileList.length > 0 && (
                            <div>
                            <strong>Files uploaded:</strong>
                            {this.state.fileNames.map((fileName) => 
                                <div>
                                <p className={classes.fileName}>{fileName}</p>
                                <TooltipButton message="Delete Image"
                                               color="secondary"
                                               onClick={(e) => this.onDeleteFile(e, fileName)}>
                                        <DeleteForeverIcon/>
                                </TooltipButton>
                                </div>
                            )}
                            </div>
                        )}

                        { /* optional fields */ }
                        <div style={{padding:'35px'}}></div>
                        <strong>
                            The following are optional; feel free to answer as many or as few as you would like
                        </strong>

                        { /* music */ }
                        <FormField 
                            classes={classes} 
                            label={"What music do you currently have on rotation?"}
                            onChange={this.onChangeMusic}
                            value={this.state.music} 
                            rows={1}/>

                        { /* age */ }
                        <FormField 
                            classes={classes} 
                            label={"How old are you?"}
                            onChange={this.onChangeAge}
                            value={this.state.age} 
                            rows={1}/>

                        { /* day as other person */ }
                        <FormField 
                            classes={classes} 
                            label={"If you could spend a day as anyone, dead or alive, who would it be?"}
                            onChange={this.onChangeDayAsOtherPerson}
                            value={this.state.dayAsOtherPerson} 
                            rows={1}/>


                        { /* hobbies */ }
                        <FormField 
                            classes={classes} 
                            label={"What do you enjoy doing in your spare time?"}
                            onChange={this.onChangeHobbies}
                            value={this.state.hobbies} 
                            rows={1}/>

                        { /* peeves */ }
                        <FormField 
                            classes={classes} 
                            label={"What pisses you off the most?"}
                            onChange={this.onChangePeeves}
                            value={this.state.peeves} 
                            rows={1}/>

                        { /* self rating */ }
                        <FormField 
                            classes={classes} 
                            label={"Rate your looks on a scale from 1-10"}
                            onChange={this.onChangeSelfRating}
                            value={this.state.selfRating} 
                            rows={1}/>

                        { /* guilty pleasure */ }
                        <FormField 
                            classes={classes} 
                            label={"What is your guilty pleasure"}
                            onChange={this.onChangeGuiltyPleasure}
                            value={this.state.guiltyPleasure} 
                            rows={1}/>

                        { /* additional info */ }
                        <FormField 
                            classes={classes} 
                            label={"Anything else you want to let people know..."}
                            onChange={this.onChangeOtherInfo}
                            value={this.state.otherInfo} 
                            rows={3}/>
                        
                        { /* submit */ }
                        {this.state.loading ? (<CircularProgress/>) : (
                        <SubmitButton variant="primary" type="submit">
                            Submit
                        </SubmitButton>)
                        }

                    </Form>
                    </Paper>
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

