import React from 'react';
import axios from 'axios';

class Dashboard extends React.Component {
    state = {
        users: []
    }

    componentDidMount() {
        axios.get("http://localhost:8000/api/users")
            .then(res => {
                console.log(res)
                this.setState({
                    users: res.data
                })
            }).catch(err => {
                console.log(err)
            })
    }
    render() {
        return (
            <div>
                <p>Welcome to the Dashboard, {this.props.username}.</p>
                {this.state.users.map(user => {
                    return <div key={user.id}>{user.username}</div>
                })}
            </div>
        )
    }

}

export default Dashboard;