import React from 'react';

const LoginRegister = props => {
    return (
        <div>
            <form onSubmit={e => props.logIn(e)}>
                <input type="text" name="username" onChange={e => props.userFormChange(e)} value={props.user.username} placeholder="username" />
                <input type="password" name="password" onChange={e => props.userFormChange(e)} value={props.user.password} placeholder="password" />
                <button>Log In</button>
            </form>
        </div>
    )
}

export default LoginRegister;