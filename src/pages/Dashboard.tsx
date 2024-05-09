import { useNavigate } from "react-router-dom";
import signOut from "../services/firebase/auth/sign-out";
import PrivateRoute from "../routes";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { getNotifications, newNotification, readNotification } from "../services/api/notifications";
import { NotificationContext } from "../context/notifications";
import { types } from "../context/notifications/notificationsReducer";
import { toast } from "react-hot-toast";

const Dashboard = () => {
    const { userAuth, setUserAuth} = useContext(AuthContext);
    const {notifications, dispatch} = useContext(NotificationContext);
    const navigate = useNavigate();

    const [notificationDescription, setNotificationDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const onNewNotification = async() => {
    setLoading(true);
    if(!notificationDescription) {
        setLoading(false);
        return toast.error('Debes ingresar un texto')
    };
        const {success} = await newNotification({description: notificationDescription, to: userAuth?.auth?.uid})
        if(success){
            toast.success('Notificación enviada correctamente')
        }
        setNotificationDescription('')
        setLoading(false);
    }

    const onNewAllNotification = async() => {
        setLoading(true);
        if(!notificationDescription) {
            setLoading(false);
            return toast.error('Debes ingresar un texto')
        };
        const {success} = await newNotification({description: notificationDescription, to: 'all'})
        if(success){
            toast.success('Notificación enviada correctamente')
        }
        setNotificationDescription('')
        setLoading(false);
    }

    const onReadNotification = async(id: string) => {
        setLoading(true);
        const {success} = await readNotification(id);
        if(success){
            dispatch({type: types.readNotification, payload: id})
        }
        setLoading(false);
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
                            className={`flex gap-x-2 md:gap-x-4 items-center gap ${notification.read ? 'bg-gray-50': 'bg-gray-200'} rounded-lg p-4 cursor-pointer duration-300 hover:bg-gray-200`}>
                                {
                                    !notification.read ? <div className="bg-blue-500 w-2 h-2 rounded-full"/> : <div className="bg-transparent w-2 h-2 rounded-full"/>
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
                    <h1 className="text-xl">Administrador</h1>
                    <hr className="pb-6"/>
                    {
                        loading ? 
                        <p className="text-sm text-gray-400">Enviando notificación...</p> 
                        : (
                            <input 
                            onChange={(e) => setNotificationDescription(e.target.value)} 
                            value={notificationDescription} 
                            type="text" 
                            name="description"
                            placeholder="Ingresa el texto a enviar"
                            id="description" 
                            className="border border-gray-200 rounded-md px-3 py-4 text-sm duration-300 hover:duration-300 hover:border-gray-400"/>
                        )
                    }
                        <button disabled={userAuth?.auth?.uid === undefined || loading} onClick={onNewNotification} className="bg-blue-500 px-2 py-3 rounded-lg text-white disabled:bg-gray-300 duration-300 hover:duration-300 hover:bg-blue-700" type="button">Mandar notificación</button>
                        <button disabled={userAuth?.auth?.uid === undefined || loading} onClick={onNewAllNotification} className="bg-blue-500 px-2 py-3 rounded-lg text-white disabled:bg-gray-300 duration-300 hover:duration-300 hover:bg-blue-700" type="button">Mandar notificación a todos</button>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}

export default Dashboard;