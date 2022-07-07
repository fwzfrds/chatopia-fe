import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Chat = () => {

    const [message, setMessage] = useState('')
    const [roomMessage, setRoomMessage] = useState('')
    const [to, setTo] = useState('')
    const [toGroup, setToGroup] = useState('')
    const [messages, setMessages] = useState([])
    const [roomMessages, setRoomMessages] = useState([])
    const [socket, setSocket] = useState(null)
    const [localData, setLocalData] = useState('')
    const [isSendRoomMess, setIsSendRoomMess] = useState('')
    const isMounted = useRef(false)

    const notify = () => {
        toast.info('There is a new message', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    useEffect(() => {
        if (localStorage.getItem('ChatopiaUser')) {
            const isAuth = localStorage.getItem('ChatopiaUser')
            const userData = JSON.parse(isAuth)
            setLocalData(userData)
        }
    }, [])

    useEffect(() => {
        if (localData) {
            const { id, name } = localData

            const resultSocket = io.connect('http://localhost:4000', {
                query: {
                    name,
                    id
                }
            })

            setSocket(resultSocket)
            resultSocket.on('messageBE', (data) => {
                setMessages((current) => [...current, data])
                notify()
            })
        }
    }, [localData])

    const handleSendMessage = () => {
        const { id, name } = localData

        const resultSocket = io.connect('http://localhost:4000', {
            query: {
                name,
                id
            }
        })

        setSocket(resultSocket)
        socket.emit('message', { message: message, to: to })
        setMessage('')
    }

    const handleSendRoomMess = () => {
        // cons
        const { id } = localData

        const resultSocket = io.connect('http://localhost:4000', {
            query: {
                idRoom: toGroup,
                idSender: id
            }
        })

        setSocket(resultSocket)
        setIsSendRoomMess(true)
        // socket.emit('roomMessage', { message: roomMessage })

    }

    useEffect(() => {

        if (isSendRoomMess) {

            socket.emit('roomMessage', { message: roomMessage })
            setIsSendRoomMess('')
            
        }
    }, [isSendRoomMess])

    console.log(roomMessages)
    console.log(isSendRoomMess)

    return (
        <div>
            <h1>Chat App</h1>
            <div>
                <h3>Private Chat</h3>
                <ul>
                    {messages.map((item, idx) => (
                        <li key={idx}>{item.message} - {new Date(item.date).getHours()}:{new Date(item.date).getMinutes()}</li>
                    ))}
                </ul>
                <input type="text" value={message} name="message" id="message" onChange={(e) => setMessage(e.target.value)} placeholder='Ketikan pesan' />
                <input type="text" value={to} name="message" id="message" onChange={(e) => setTo(e.target.value)} placeholder='Masukkan tujuan' />
                <button onClick={handleSendMessage}>send message</button>
            </div>
            <div>
                <h3>Group Chat</h3>
                <ul>
                    {roomMessages.map((item, idx) => (
                        <li key={idx}>{item.message} - {new Date(item.date).getHours()}:{new Date(item.date).getMinutes()}</li>
                    ))}
                </ul>
                <input type="text" value={roomMessage} name="roomMessage" id="roomMessage" onChange={(e) => setRoomMessage(e.target.value)} placeholder='Ketikan pesan' />
                <input type="text" value={toGroup} name="roomMessage" id="roomMessage" onChange={(e) => setToGroup(e.target.value)} placeholder='Masukkan Group tujuan' />
                <button onClick={handleSendRoomMess}>send room message</button>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}

export default Chat