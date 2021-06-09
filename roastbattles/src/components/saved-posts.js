//React
import React, { Component } from 'react';
import Nav from './navbar';

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
        marginTop: '-75px',
        paddingBottom: '20px'
    }
}

class SavedPosts extends Component {
    constructor(props) {
        super(props);

        this.state = {saves: [], loading: true}

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.getSaves = this.getSaves.bind(this);

    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            //user is logged in
            this.getSaves(user.uid)
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
                    postOwner: doc.data().postOwner,
                    saver: doc.data().saver,
                    timeStamp: doc.data().timeStamp.toDate()
                }
                saves.push(save)
            });
            return saves
        })
        .then((saves) => {
            console.log(saves);
            this.setState({saves: saves, loading: false});
        })
    }

    Save = props => (
        <div>
            <a href={"/posts/" + props.save.postOwner} >{props.save.postOwner}</a>
            <br/>
            <small>Saved on {props.save.timeStamp.toDateString()}</small>
        </div>
    )

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Nav/>
                <h1 className={classes.header}>Saved Posts</h1>
                {this.state.saves.length > 0 
                    ? 
                    (this.state.saves.sort(function(a,b){return a.timeStamp - b.timeStamp}).map((save) => (
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


export default withStyles(styles)(SavedPosts);