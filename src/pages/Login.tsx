import { FormEvent, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import signIn from "../services/firebase/auth/sign-in";
import { getUser } from "../services/api/users";
import { AuthContext } from "../context/auth/index";
import PrivateRoute from "../routes";


type FormValues = {
    email: string;
    password: string;
}

const Login = () => {
    const {setUserAuth} = useContext(AuthContext)
    
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState<FormValues>({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
    }


    const onSubmit = async(e: FormEvent<HTMLFormElement>) => {
        try {
            e?.preventDefault();
            const res = await signIn(formValues?.email, formValues?.password);
            
            if(
                res?.error?.code
            ){                
                switch (res?.error.code) {
                    case 'auth/user-not-found':
                      return toast.error('No se encontró ninguna cuenta asociada a esta dirección de correo electrónico. Por favor, registra una cuenta o verifica la dirección de correo electrónico proporcionada.');
                    case 'auth/invalid-email':
                      return toast.error('La dirección de correo electrónico proporcionada no es válida. Por favor, verifica e inténtalo nuevamente.');
                    case 'auth/invalid-credential':
                      return toast.error('La dirección de correo electrónico proporcionada no es válida o no hay un usuario registrado con estas credenciales. Por favor, verifica e inténtalo nuevamente.');
                    case 'auth/too-many-requests':
                      return toast.error('Tu acceso se ha bloqueado temporalmente por muchos intentos fallidos. Por favor, espera e inténtalo nuevamente en unos minutos.');
                    case 'auth/wrong-password':
                      return toast.error('La contraseña proporcionada es incorrecta. Por favor, verifica e inténtalo nuevamente.');
                    default:
                      return toast.error('Se ha producido un error al intentar iniciar sesión. Por favor, intenta nuevamente más tarde.');
                  }
            }            
            if(res?.result?.user?.uid){
                const {data: resData} = await getUser({id: res?.result?.user?.uid})                           
                if(resData?.success){
                    toast.success('Bienvenido de vuelta :)')
                    setUserAuth({
                        user: resData?.data,
                        auth: res?.result?.user
                    })
                    navigate('/dashboard')
                }else{
                    return toast.error('Parece que no hay ningún usuario vinculado a esta cuenta, intenta nuevamente o regístrate');
                }
                navigate('/dashboard')
            }else{
                return toast.error('Parece que no hay ningún usuario vinculado a esta cuenta, intenta nuevamente o regístrate');
            }
        } catch (error) {            
            return toast.error('Se ha producido un error, por favor comunícate con el desarrollador');
        }
    }

    return (
        <PrivateRoute>
            <div className="py-10 px-4 md:px-20 bg-blue-100 h-screen w-screen">
                <div className="container py-6 px-6 bg-white rounded-md shadow-lg relative">
                    <h1 className="text-xl font-semibold pb-6">Iniciar sesión</h1>
                    <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium" htmlFor="email">Correo electrónico</label>
                            <input
                            onChange={handleChange}
                            value={formValues?.email} 
                            type="email" 
                            name="email"
                            placeholder="Ingresa tu email..."
                            id="email" 
                            className="border border-gray-200 rounded-md px-3 py-4 text-sm duration-300 hover:duration-300 hover:border-gray-400"/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium" htmlFor="password">Contraseña</label>
                            <input 
                            onChange={handleChange} 
                            value={formValues?.password} 
                            type="password" 
                            name="password" 
                            placeholder="Ingresa tu contraseña..."
                            id="password" 
                            className="border border-gray-200 rounded-md px-3 py-4 text-sm duration-300 hover:duration-300 hover:border-gray-400"/>
                        </div>
                        <button className="bg-blue-500 text-white px-2 py-4 font-medium rounded-lg">Iniciar sesión</button>
                        <p className="text-sm inline-flex items-center">¿No tienes una cuenta? <b className="pl-2 text-sm cursor-pointer text-blue-500" onClick={() => navigate('/register')}>Regístrate</b></p>
                    </form>
                </div>
            </div>
        </PrivateRoute>
    )
}

export default Login;

