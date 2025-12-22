import { useState, useEffect  } from "react";
import UserForm from "./UserForm"
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast';
import axios from "axios";

function User() {

    const BASE_URL = import.meta.env.VITE_BASE_API_URL + "/users";

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersData = (await axios.get(BASE_URL)).data;
                setUsers(usersData);
            } 
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, [BASE_URL]);

    const defaultFormValues = {
        id: 0,
        firstName: '',
        lastName: '',
    };

    const methods = useForm({
        defaultFormValues: defaultFormValues
    })

    const handleUserEdit = (user) => {
        console.log(user);
    }

    const handleUserDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`${BASE_URL}/${id}`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            console.error(error.response?.data || error);
        }
    };

    const handleFormReset = () => {
        methods.reset(defaultFormValues);
    }

    const handleFormSubmit = async (user) => {
        setLoading(true);
        try {
            if (user.id <= 0) {
                const newUser = await axios.post(BASE_URL, { firstName: user.firstName, lastName: user.lastName });
                const created = newUser.data;
                setUsers((prev) => [...prev, created]);
            }
            else {
                await axios.post(`${BASE_URL}/${user.id}`, user);
                setUsers((previousUsers) => previousUsers.map(u => u.id === user.id ? user : u))
            }
    
            methods.reset(defaultFormValues);
            toast.success("Saved successfully!");
        } 
        catch (error) {
            console.log(error.response?.status);
            console.log(error.response?.data);
            toast.error("Error has occured");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8"> 
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        User Management
                    </h1>
                    {loading && <p> Loading...</p>}
                </div>

                <UserForm methods={methods} onFormSubmit={handleFormSubmit} onFormReset={handleFormReset} />
                <UserList usersList={users} onUserEdit={handleUserEdit} onUserDelete={handleUserDelete}/>
            </div>
        </div>
    )
}

export default User