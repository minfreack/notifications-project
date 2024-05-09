import { Dispatch, ReactNode, createContext, useReducer } from "react";
import { notificationReducer } from "./notificationsReducer";

type Notification = {
    description: string,
    createdAt: number,
    to: string,
    read: boolean,
    id: string
}


interface NotificationProviderProps {
    children: ReactNode;
}

type State = {
    notifications: Notification[], 
}

type Action = { type: string; payload: any };


const initialState: State = {
    notifications: []
}

export const NotificationContext = createContext<{
    notifications: State;
    dispatch: Dispatch<Action>;
}>({ notifications: initialState, dispatch: () => {} });

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, dispatch] = useReducer(notificationReducer, initialState);

    return (
        <NotificationContext.Provider value={{ notifications, dispatch }}>
            {children}
        </NotificationContext.Provider>
    );
};