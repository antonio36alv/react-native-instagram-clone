const initialState = {
    currentUser: null
}

// HACER
export const user = (state = initialState, action) => {
    return {
        ...state,
        currentUser: action.currentUser
    }
}