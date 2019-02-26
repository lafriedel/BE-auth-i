import React from 'react';

const LoginRegister = props => {
    return (
        <div>
            <form>
                <input type="text" name="username" value={props.user.username} placeholder="username" />
                <input type="password" name="password" value={props.user.username} placeholder="password" />
                <button>Log In</button>
            </form>
        </div>
    )
}

export default LoginRegister;