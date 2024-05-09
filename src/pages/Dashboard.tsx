import { useNavigate } from "react-router-dom";
import signOut from "../services/firebase/auth/sign-out";
import PrivateRoute from "../routes";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";
import { getNotifications, newNotification, readNotification } from "../services/api/notifications";
import { NotificationContext } from "../context/notifications";
import { types } from "../context/notifications/notificationsReducer";

const Dashboard = () => {
    const { userAuth, setUserAuth} = useContext(AuthContext);
    const {notifications, dispatch} = useContext(NotificationContext);
    const navigate = useNavigate();
    
    const onNewNotification = async() => {
        await newNotification({description: `Hola ${userAuth?.auth?.uid} son las ${new Date()?.toTimeString()}`, to: userAuth?.auth?.uid})
    }

    const onNewAllNotification = async() => {
        await newNotification({description: 'Hola a todos', to: 'all'})
    }

    const onReadNotification = async(id: string) => {
        const {success} = await readNotification(id);
        if(success){
            dispatch({type: types.readNotification, payload: id})
        }
        
    }

    useEffect(() => {
        const getUserNotifications = async() => {
            if(userAuth?.auth?.uid){
                const res = await getNotifications(userAuth?.auth?.uid);
                if(res.success){                    
                    dispatch({type: types.allNotifications, payload: res.data})
                }            
            }
        }
        getUserNotifications()
    },[userAuth?.auth?.uid]);
    
    return (
        <PrivateRoute>
            <div className="py-10 px-2 md:px-20 bg-blue-100 h-screen w-screen">
                <div className="container py-6 px-6 bg-white rounded-md shadow-lg relative">
                    <p 
                    onClick={async() => {
                        setUserAuth({auth: null, user: null});
                        await signOut();
                        dispatch({type: types.allNotifications, payload: []})
                        navigate('/login')
                    }}
                    className="absolute top-4 right-6 text-sm cursor-pointer text-blue-500">
                        Cerrar sesión
                    </p>
                    <h1 className="text-xl pb-6">Notificaciones</h1>
                    <div className="flex flex-col gap-y-4 max-h-96 py-2 overflow-y-scroll md:px-2">
                    {
                        notifications?.notifications?.map((notification) => (
                            <div 
                            onClick={() => onReadNotification(notification.id)}
                             key={notification.id}
                            className={`flex gap-x-2 md:gap-x-8 items-center gap ${notification.read ? 'bg-gray-50': 'bg-gray-200'} rounded-lg px-4 py-2 cursor-pointer duration-300 hover:bg-gray-200`}>
                                {
                                    !notification.read && <div className="bg-blue-500 w-2 h-2 rounded-full"/>
                                }
                                <div className="flex flex-col w-3/4 md:w-full">
                                    <p className="text-sm md:text-base">{notification.description}</p>
                                    <span className="text-xs text-gray-400">{new Date(notification.createdAt)?.toTimeString()}</span>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                    <div className="pt-10 flex flex-col gap-y-2">
                        <button disabled={userAuth?.auth?.uid === undefined} onClick={onNewNotification} className="bg-blue-500 px-2 py-2 rounded-lg text-white" type="button">Mandar notificación</button>
                        <button disabled={userAuth?.auth?.uid === undefined} onClick={onNewAllNotification} className="bg-blue-500 px-2 py-2 rounded-lg text-white" type="button">Mandar notificación a todos</button>

                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}

export default Dashboard;