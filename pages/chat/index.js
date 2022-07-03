import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'


const Chat = () => {

    const [message, setMessage] = useState('')
    const [to, setTo] = useState('')
    const [messages, setMessages] = useState([])
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const resultSocket = io.connect('http://localhost:4000', {
            query: {
                name: 'Fawwaz Firdaus',
                id: 'fwz-123-456'
            }
        })

        setSocket(resultSocket)
        resultSocket.on('messageBE', (data) => {
            setMessages((current) => [...current, data])
        })
    }, [])

    const handleSendMessage = () => {
        socket.emit('message', { message: message, to: to })
        setMessage('')
    }

    return (
        <div>
            <h1>Chat App</h1>
            <ul>
                {messages.map((item) => (
                    <li>{item.message} - {new Date(item.date).getHours()}:{new Date(item.date).getMinutes()}</li>
                ))}
            </ul>
            <input type="text" value={message} name="message" id="message" onChange={(e) => setMessage(e.target.value)} placeholder='Ketikan pesan' />
            <input type="text" value={to} name="message" id="message" onChange={(e) => setTo(e.target.value)} placeholder='Masukkan tujuan' />
            <button onClick={handleSendMessage}>send message</button>
        </div>
    )
}

export default Chat