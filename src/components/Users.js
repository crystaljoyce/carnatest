import React, {useEffect} from 'react';
import {Redirect, Link} from 'react-router-dom';

const Users = ({user, setSingleUser, getUsers, usersList}) => {

    useEffect( () => {
        getUsers();
    }, []);

    if (user.isAdmin) {
        return (<>
         
            <div >

                {usersList.map(_user => {
                    const {id, username, isAdmin} = _user;

                    return (<div key={id}>
                        <div > 
                        <br />
                        <Link to={`/users/${id}`}><h3 onClick={() => setSingleUser(_user)}>{username}</h3></Link>
                        <div>User ID: {id}</div>
                        <div>Admin permissions: {isAdmin ? 'Yes' : 'No'}</div>
                        </div>
                    </div>)
                })}
            </div>
           
            <Link to='/users/add'><button>Add A New User</button></Link>
            
        </>)
    } else {
        return <Redirect to='/' />
    }
}

export default Users;