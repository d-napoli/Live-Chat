import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import './Chat.css'
import InfoBar from '../Infobar/Infobar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'

// variable that is going to store the socket.io data, its initialized outside the component
let socket

const Chat = ({ location }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const ENDPOINT = 'http://localhost:5000/'

    useEffect(() => {
        const { name, room } = queryString.parse(location.search)

        setName(name)
        setRoom(room)

        const connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", 
            "timeout" : 10000,                  
            "transports" : ["websocket"]
        };

        socket = io(ENDPOINT, connectionOptions)

        // emitting a new event for socket.io called 'join', when this event is called informs two values,
        // the name of the user and the room that joined
        socket.emit('join', { name, room }, (error) => {
            if(error)
                alert(error)
        })

        // function to disconnect the socket.io
        // we need this to unmount the app
        return () => {
            socket.emit('disconnect')
            socket.off()
        }

        // informing the two parameters that are needed to trigger the socket.io method
        // wich means that it only loads again if one of those two conditionals bellow are changed
    }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
    }, [messages])

    const sendMessage = (event) => {
        event.preventDefault()

        if(message)
            socket.emit('sendMessage', message, () => setMessage(''))
    }

    console.log(message, messages)

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input  message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default Chat