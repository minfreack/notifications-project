import React, {useEffect, createContext, useContext} from 'react';
import { useSocket } from '../hooks/useSocket'
import { AuthContext } from './auth';
import { NotificationContext } from './notifications';
import { types } from './notifications/notificationsReducer';

interface SocketContextType {
    socket: any;
    online: boolean | undefined;
}

interface SocketProviderProps {
    children: React.ReactNode;
}


export const SocketContext = createContext<SocketContextType>({socket: null, online: false});

// const url = process.env.NEXT_PUBLIC_API_URL
const url = 'http://localhost:8080'
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {

    const {socket, online, connectarSocket, desconectarSocket} = useSocket(url);
    
    const { userAuth } = useContext(AuthContext);

    const {dispatch} = useContext(NotificationContext);

    useEffect(() => {
        //@ts-ignore
        if(userAuth?.auth?.uid){
            connectarSocket();
        }
    },[userAuth?.auth?.uid, connectarSocket])

    useEffect(() => {
         //@ts-ignore
        if(!userAuth?.auth?.uid){
            desconectarSocket();
        }
    },[userAuth?.auth?.uid, desconectarSocket])

    useEffect(() => {
        socket?.on('new_notification', data => {
            console.log('recibi una'); 
            dispatch({type: types.newNotification, payload: [data]})})
    },[socket])
     

    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}