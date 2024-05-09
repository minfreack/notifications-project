import * as io from "socket.io-client";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth/index";

export const useSocket = (serverPath: string) => {
    const [socket, setSocket] = useState<io.Socket | null>(null);
    const [online, setOnline] = useState<boolean | undefined>(false);

    const {userAuth} = useContext(AuthContext)
    
    const connectarSocket = useCallback(() => {        
        const socketTemp = io.connect(serverPath, {
            transports: ['websocket'], autoConnect: true, forceNew: true, query: {
                'id': userAuth?.auth?.uid
            }
        })        
        setSocket(socketTemp)
    }, [serverPath, userAuth?.auth?.uid])

    const desconectarSocket = useCallback(() => {
        socket?.disconnect()
    }, [socket])

    useEffect(() => {
        setOnline(socket?.connected)
    }, [socket])

    const handleConnect = () => {
        setOnline(true);
    };

    const handleDisconnect = () => {
        setOnline(false);
    };

    useEffect(() => {
        socket?.on("connect", handleConnect);
    }, [socket])

    useEffect(() => {
        socket?.off("disconnect", handleDisconnect);
    }, [socket])

    return {
        socket,
        online,
        connectarSocket,
        desconectarSocket
    };
};
