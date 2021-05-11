import React, {useState} from 'react';
import {Redirect, useHistory} from 'react-router-dom';

const AddUser = ({user, getUsers}) => {
    const [addUser, setAddUser] = useState({id: null, username: '', password: '', isAdmin: false, firstName: '', lastName: '', email: ''});
    const {username, password, isAdmin, firstName, lastName, email} = addUser;
    const [addUserMessage, setAddUserMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setAddUserMessage('Passwords do not match. Please try again.');
        } else {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addUser)
            })
            const data = await response.json();
            setAddUserMessage(data ? 'New user has been added.' : '');
            setConfirmPassword('');
            getUsers();
            history.push('/users');
        }
    }

    const handleOnChange = async (event) => {
        if (event.target.name === 'isAdmin') {
            setAddUser({...addUser, [event.target.name]: !isAdmin})
        } else  {
            setAddUser({...addUser, [event.target.name]: event.target.value});
        }
    }

    if (user.isAdmin) {
        return (<div>
            <div>{addUserMessage}</div>
            <br />
            <h2>Add A New User</h2>
            <br />
            <form onSubmit={handleSubmit}>
                <div>
                    <div>Username</div>
                    <input type='text' name='username' minLength='3' maxLength='20' value={username} required onChange={handleOnChange}></input>
                </div>
                <div>
                    <div>Password</div>
                    <input type='password' name='password' value={password} minLength='7' maxLength='20' required onChange={handleOnChange}></input>
                </div>
                <div>
                    <div>Confirm Password</div>
                    <input type='password' name='confirmPassword' value={confirmPassword} minLength='7' maxLength='20' required onChange={event => setConfirmPassword(event.target.value)}></input>
                </div>
                <div>
                    <div>isAdmin? <input type='checkbox' name='isAdmin' checked={isAdmin} value={isAdmin} onChange={handleOnChange}></input></div>
                </div>
                <div>
                    <div>First Name</div>
                    <input type='text' name='firstName' value={firstName} required onChange={handleOnChange} ></input>
                </div>
                <div>
                    <div>Last Name</div>
                    <input type='text' name='lastName' value={lastName} required onChange={handleOnChange} ></input>
                </div>
                <div>
                    <div>Email</div>
                    <input type='email' name='email' value={email} required onChange={handleOnChange} ></input>
                </div>
                <button type='submit'>Add User</button>
            </form>
        </div>)
    } else {
        return <Redirect to='/' />
    }
}

export default AddUser;