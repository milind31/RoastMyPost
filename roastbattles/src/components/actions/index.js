//Created Post
export const userCreatedPost = () => {
    return {
        type: 'USER_CREATED_POST'
    }
}

export const userLoggedOut = () => {
    return {
        type: 'USER_LOGGED_OUT'
    }
}

export const userDeletedPost = () => {
    return {
        type: 'USER_DELETED_POST'
    }
}

export const userHasNoPost = () => {
    return {
        type: 'USER_HAS_NO_POST'
    }
}

//Saved Posts
export const setSavedPosts = (posts) => {
    return {
        type: 'SET_SAVES',
        payload: posts,
    }
}

export const savePost = (post) => {
    return {
        type: 'SAVE_POST',
        payload: post
    }
}

export const unsavePost = (postOwner) => {
    return {
        type: 'UNSAVE_POST',
        payload: postOwner
    }
}

export const clearSavedPosts = () => {
    return {
        type: 'CLEAR_SAVES',
    }
}

//UID
export const setUID = (uid) => {
    return {
        type: 'SET_UID',
        payload: uid.toString()
    }
}

export const clearUID = () => {
    return {
        type: 'CLEAR_UID',
    }
}


//username
export const setUsername = (username) => {
    return {
        type: 'SET_USERNAME',
        payload: username
    }
}

export const clearUsername = () => {
    return {
        type: 'CLEAR_USERNAME',
    }
}