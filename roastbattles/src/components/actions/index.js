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
