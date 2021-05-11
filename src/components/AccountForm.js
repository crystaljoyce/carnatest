import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';

const AccountForm = ({type, setToken, setUser}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    const history = useHistory();
    const title = type === 'login' ? 'LOGIN' : 'REGISTER';
    const oppositeTitle = type === 'login' ? 'Not yet registered? Sign up here!' : 'Already registered? Login here!'
    const oppositeType = type === 'login' ? 'register' : 'login';

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (type === 'register' && password !== confirmPassword) {
            setLoginMessage('Passwords do not match. Please try again.')
        } else {
            const response = await fetch(`/api/users/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    firstName,
                    lastName,
                    email,
                })
            })
            const data = await response.json();
            setLoginMessage(data.message);

            const token = data.token ? data.token : '';
            localStorage.setItem('token', token);
            if (token) {
                setToken(token);

                const response = await fetch(`/api/users/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                const meData = await response.json();
                
                setUser(meData);
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                history.push('/');
            }
        }
    }

    return (<>

        <div>{loginMessage}</div>
        <br />
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <div>Username</div>
                <input type='text' value={username} minLength='3' maxLength='20' required onChange={event => setUsername(event.target.value)}></input>
            </div>
            <div>
                <div>Password</div>
                <input type='password' value={password} minLength='7' maxLength='20' required onChange={event => setPassword(event.target.value)}></input>
            </div>
            <div>
                {type === 'register' ?
                    <>
                        <div>
                            <div>Confirm Password</div>
                            <input type='password' value={confirmPassword} minLength='7' maxLength='20' required onChange={event => setConfirmPassword(event.target.value)}></input>
                        </div>
                        <div>
                            <div>First Name</div>
                            <input type='text' value={firstName} required onChange={event => setFirstName(event.target.value)} ></input>
                        </div>
                        <div>
                            <div>Last Name</div>
                            <input type='text' value={lastName} required onChange={event => setLastName(event.target.value)} ></input>
                        </div>
                        <div>
                            <div>Email</div>
                            <input type='email' value={email} required onChange={event => setEmail(event.target.value)} ></input>
                        </div>
                    </>
                : ''}
            </div>
            <button type='submit' >{title}</button>
        </form>
        <div id='opposite-account-form'><Link to={`/${oppositeType}`}>{oppositeTitle}</Link></div>
    
    </>)
}

export default AccountForm;
