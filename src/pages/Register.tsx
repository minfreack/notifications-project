import { FormEvent, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import signUp from "../services/firebase/auth/sign-up";
import newUser from "../services/api/users";
import { AuthContext } from "../context/auth";
import PrivateRoute from "../routes";

type FormValues = {
    email: string;
    password: string;
}

const Register = () => {
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
            const res = await signUp(formValues?.email, formValues?.password);
            if(
                res?.error?.code
            ){
                switch (res.error?.code) {
                    case "auth/email-already-in-use":
                        return toast.error('El correo electrónico ya está siendo utilizado por otra cuenta o vínculado a otro tipo de autenticación.');
                    case "auth/invalid-email":
                        return toast.error('El correo electrónico proporcionado no es válido.');
                    case "auth/weak-password":
                        return toast.error('La contraseña proporcionada no es lo suficientemente segura. Debe tener al menos 6 caracteres.');
                    case "auth/network-request-failed":
                        return toast.error('Hubo un error de red al intentar realizar la operación. Por favor, inténtelo de nuevo más tarde.');
                    case "auth/timeout":
                        return toast.error('La solicitud ha excedido el tiempo de espera. Por favor, inténtelo de nuevo más tarde.');
                    case "auth/internal-error":
                        return toast.error('Se ha producido un error interno en el servidor de autenticación. Por favor, inténtelo de nuevo más tarde.');
                    default:
                        return toast.error('Se produjo un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.');
                }
            }
            const {data: resData} = await newUser({
                email: formValues?.email,
                id: res?.result?.user?.uid
            })
            if(resData?.success){
                toast.success('Te has registrado correctamente :)')
                setUserAuth({
                    user: resData?.data,
                    auth: res?.result?.user
                })
            }
            navigate('/dashboard')
        } catch (error) {
            return toast.error('Se ha producido un error, por favor comunícate con el desarrollador');
        }
    }

    return (
        <PrivateRoute>
            <div className="py-10 px-4 md:px-20 bg-blue-100 h-screen w-screen">
                <div className="container py-6 px-6 bg-white rounded-md shadow-lg relative">
                    <p onClick={() => navigate('/login')}  className="absolute top-4 right-6 text-sm cursor-pointer text-blue-500">Iniciar sesión</p>
                    <h1 className="text-xl pb-6">Registro</h1>
                    <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm" htmlFor="email">Correo electrónico</label>
                            <input onChange={handleChange} value={formValues?.email} type="email" name="email" id="email" className="border border-gray-300 rounded-md p-2"/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm" htmlFor="password">Contraseña</label>
                            <input onChange={handleChange} value={formValues?.password} type="password" name="password" id="password" className="border border-gray-300 rounded-md p-2"/>
                        </div>
                        <button className="bg-blue-500 text-white py-2 rounded-md">Registrarme</button>
                    </form>
                </div>
            </div>
        </PrivateRoute>
    )
}

export default Register;