import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';

const SingleUser = ({token, user, singleUser, setSingleUser, getUsers}) => {
    const {id, username, isAdmin, firstName, lastName, email} = singleUser;
    
    const [showEditUser, setShowEditUser] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(`/api/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${token}`
            }, 
            body: JSON.stringify(singleUser)
        })
        const data = await response.json();

        setShowEditUser(!showEditUser);
        getUsers();
    }

    const handleOnChange = async (event) => {
        if (event.target.name === 'isAdmin') {
            setSingleUser({...singleUser, [event.target.name]: !isAdmin});
        } else {
            setSingleUser({...singleUser, [event.target.name]: event.target.value});
        }
    }

    if (user.isAdmin) {
        return (<div >
                {showEditUser ?
                <>
                <h3>Editing {username}</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div>Username</div>
                        <input required type='text' name='username' minLength='3' maxLength='20' value={username} onChange={handleOnChange}></input>
                    </div>
                    <div>
                        <div>isAdmin? <input type='checkbox' name='isAdmin' checked={!isAdmin ? false : true} value={isAdmin} onChange={handleOnChange}></input></div>
                    </div>
                    <div>
                        <div>First Name</div>
                        <input required type='text' name='firstName' value={firstName} onChange={handleOnChange}></input>
                    </div>
                    <div>
                        <div>Last Name</div>
                        <input required type='text' name='lastName' value={lastName} onChange={handleOnChange}></input>
                    </div>
                    <div>
                        <div>Email</div>
                        <input required type='email' name='email' value={email} onChange={handleOnChange}></input>
                    </div>
                    <button type='submit'>Save User</button>
                </form>
                </>
                :
                <>
                <h3>{username}</h3>
                <div>User ID: {id}</div>
                <div>isAdmin? {isAdmin ? 'Yes' : 'No'}</div>
                <div>Name: {firstName} {lastName}</div>
                <div>Email: {email}</div>
                <button onClick={() => setShowEditUser(!showEditUser)}>Edit User</button>
                </>
            }
        </div>)
    } else {
        return <Redirect to='/' />
    }
}

export default SingleUser;