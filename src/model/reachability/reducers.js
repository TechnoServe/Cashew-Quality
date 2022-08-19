const reducer = (state = {isConnected: false}, action) => {
    switch (action.type) {
        case "CONNECTION_STATUS":
            return {
                isConnected: action.status
            }
        case 'CONNECTION_STATUS_CHANGED':
            return {
                isConnected: action.status
            }
        default:
            return state
    }
}

export {reducer}