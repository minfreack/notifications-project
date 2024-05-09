export const types = {
    newNotification: 'new-notification',
    allNotifications: 'all-notifications',
    readNotification: 'read-notification'
}

type Notification = {
    description: string,
    createdAt: number,
    to: string,
    read: boolean,
    id: string
}

type State = {
    notifications: Notification[], 
}

export const notificationReducer = (state : State, action: any) => {    
    switch (action.type) {
        case types.newNotification:
            return {
                ...state,
                notifications: [...action.payload, ...state.notifications]
            }
        case types.allNotifications:
                return {
                    ...state,
                    notifications: [...action.payload]
                }
        case types.readNotification:
            return {
                ...state,
                notifications: state.notifications.map((notification) => {
                    if(notification.id === action.payload){
                        return {
                            ...notification,
                            read: true
                        }
                    }
                    return notification
                })
            }
        default:
            return state;
    }
}