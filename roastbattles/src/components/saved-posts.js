//React
import React, { Component } from 'react';
import Nav from './navbar';

//Redux
import { connect } from 'react-redux';
import { setSavedPosts, savePost, unsavePost } from './actions/index';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";

//Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';


const styles = {
    container: {
        background: "#333131"
    },
    header: {
        marginTop: '175px',
        paddingBottom: '20px'

    }
}

class SavedPosts extends Component {
    constructor(props) {
        super(props);

        this.state = {loading: true}

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.getSaves = this.getSaves.bind(this);

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
            if (this.props.saves.fetchedSaves === false){
                this.getSaves(user.uid);
            }
            else{
                this.setState({loading: false});
            }
            
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }
    
    getSaves(id) {
        firebase.firestore().collection('saves').where("saver", "==", id).get()
        .then((data) => {
            let saves = []
            data.forEach((doc) => {
                console.log(doc.id);
                const save = {
                    postOwnerID: doc.data().postOwnerID,
                    postOwnerUsername: doc.data().postOwnerUsername,
                    saver: doc.data().saver,
                    timeStamp: doc.data().timeStamp.toDate().toDateString()
                }
                saves.push(save)
            });
            return saves
        })
        .then((saves) => {
            console.log(saves);
            this.props.setSavedPosts(saves);
            this.setState({loading: false})
        })
    }

    Save = props => (
        <div>
            <a style={{fontSize: '150%'}} href={"/posts/" + props.save.postOwnerID} >{props.save.postOwnerUsername}</a>
            <br/>
            <small>Saved on {props.save.timeStamp.toString()}</small>
        </div>
    )

    render() {
        const { classes } = this.props;
        const { saves } = this.props;
        return (
            <div>
                <Nav/>
                <h1 className={classes.header}>Saved Posts</h1>
                {saves.saves.length > 0 
                    ? 
                    (saves.saves.sort(function(a,b){return a.timeStamp - b.timeStamp}).map((save) => (
                        <this.Save save={save} classes={classes}></this.Save>))
                    )
                    :
                    (
                    <div>
                        { this.state.loading ? (<CircularProgress />) : (
                        <div>
                        <p>No posts saved 😢</p>
                        <br/>
                        <p>Click the save icon <BookmarkBorderIcon/> on a post to save it. It will show up here!</p>
                        </div>
                        )}
                    </div>
                    )
                }
            </div>
        );
    }
};

SavedPosts.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    saves: state.saves,
    username: state.username
})

const mapActionsToProps = { setSavedPosts, savePost, unsavePost };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(SavedPosts));