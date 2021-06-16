//React
import React, { Component } from 'react';
import Nav from './navbar';

//React Bootstrap
import SubmitButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

//Material UI
import { withStyles } from '@material-ui/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
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
    },
    container: {
        background: "#333131"
    }
}

//TODO: REDIRECT
//REDIRECT TO EDIT IF POST NOT CREATED

//create post page
class EditPost extends Component {
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
        this.onDeleteFileFromThumbnail = this.onDeleteFileFromThumbnail.bind(this);
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

            //files
            fileURLS: [],
            newFiles: [],
            newFileNames: [], 
            numberOfFiles: 0,
        }
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
                newFileNames.push(e.target.files[i].name);
                newFiles.push(e.target.files[i]);
            }
            this.setState({newFiles: newFiles, newFileNames: newFileNames, numberOfFiles: numFiles});
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

    handleAuthChange(user) {
        if (user) {
            //user is logged in
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
        firebase.firestore().collection("posts").doc(user.uid.toString()).set({
            music: this.state.music,
            age: this.state.age,
            dayAsOtherPerson: this.state.dayAsOtherPerson,
            hobbies: this.state.hobbies,
            peeves: this.state.peeves,
            selfRating: this.state.selfRating,
            guiltyPleasure: this.state.guiltyPleasure,
            otherInfo: this.state.otherInfo,
            fileURLS: fileURLS})
        .then(() => {window.location = '/';})
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
    
    imageThumbnails = props => (
        <div style={{marginTop:'-75px'}}>
                    <Container>
                    <Row>
                        {this.state.fileURLS.length !== 0 && this.state.fileURLS.map((url, index) => (
                            <Col xs={6} md={4}>
                                <Image thumbnail  src={url}></Image>
                                <Button color="primary"onClick={(e) => {this.onDeleteFileFromThumbnail(e, url)}}><DeleteForeverIcon/></Button>
                            </Col>
                        ))}
                    </Row>
                    </Container>
                </div>
    )

    onDeleteFileFromThumbnail(e, url) {
        let fileURLS = this.state.fileURLS;

        var idx = fileURLS.findIndex(item => item==url);
        fileURLS.splice(idx,1);   

        var user = firebase.auth().currentUser;
        var newNumberOfFiles = this.state.numberOfFiles - 1;

        toast.info('Image temporarily deleted! Click submit below to save this change', {
            style: { fontFamily: 'Roboto Mono, monospace', textAlign:'left' },
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        //save to state
        this.setState({fileURLS: fileURLS, numberOfFiles: newNumberOfFiles});
    }

    onDeleteNewFile(e, fileName) {
        e.preventDefault();

        let newFileNames = this.state.newFileNames;
        let newFiles = this.state.newFiles;

        var idx = newFileNames.findIndex(item => item==fileName);
        newFileNames.splice(idx,1);   

        idx = newFiles.findIndex(item => item.name==fileName);
        newFiles.splice(idx,1);   


        //var newFileNames = this.state.newFileNames.filter(function(element) { return element !== fileName });
        //var newFiles = this.state.newFiles.filter(function(element) { return element.name !== fileName });
        var newNumberOfFiles  = this.state.numberOfFiles - 1;

        this.setState({newFileNames: newFileNames, newFiles: newFiles, numberOfFiles: newNumberOfFiles});
    }


    render () {
        const { classes } = this.props;
        return (
            <div style={{paddingBottom: '500px'}}>
                <Nav/>
                <h1 style={{paddingTop:'125px'}}>Edit post...</h1>
                <Form className={classes.form}  onSubmit={this.onSubmit}>

                { /*file upload*/ }
                <Form.Group>
                    <Form.Label>Upload new images of yourself</Form.Label>
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
                
                {!this.state.filesUploaded && (
                    <div>
                        <Form.Label style={{paddingBottom: '20px'}}>
                                Currently uploaded images:
                        </Form.Label>
                        <this.imageThumbnails/>
                    </div>
                    )
                }

                {this.state.newFiles.length > 0 && (
                    <div>
                    <strong>Newly uploaded files:</strong>
                    {this.state.newFileNames.map((fileName) => 
                        <div>
                        <p style={{display: 'inline-block'}}>{fileName}</p>
                        <Button color="secondary" onClick={(e) => this.onDeleteNewFile(e, fileName)}><DeleteForeverIcon></DeleteForeverIcon></Button>
                        </div>
                    )}
                    </div>
                )}

                <br/>

                { /*optional fields*/ }
                    <div></div>

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
                    <SubmitButton variant="primary" type="submit">
                        Submit
                    </SubmitButton>

                    </Form>
            </div>
        )
  }
}

EditPost.propTypes = {
    classes: PropTypes.object.isRequired
}


export default withStyles(styles)(EditPost);
