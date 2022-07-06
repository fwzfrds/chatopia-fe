import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GroupChat = () => {

    const [roomMessage, setRoomMessage] = useState('')
    const [roomMessages, setRoomMessages] = useState([])
    const [toGroup, setToGroup] = useState('')
    const [socket, setSocket] = useState(null)
    const [isSendRoomMess, setIsSendRoomMess] = useState(false)
    const [localData, setLocalData] = useState('')

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
        // if (isMounted.current) {
        // const { id, name } = localData
        const idRoom = '9960d10d-27a7-463f-8f56-34933cbe6667'

        const resultSocket = io.connect('http://localhost:4000', {
            query: {
                // name,
                idRoom
            }
        })

        setSocket(resultSocket)
        resultSocket.on('roomMessageBE', (data) => {
            setRoomMessages((current) => [...current, data])
            notify()
        })
        // }
    }, [localData])

    console.log(roomMessages)

    return (
        <div>
            <h1>Group Chat</h1>
            <ul>
                {roomMessages.map((item, idx) => (
                    <li key={idx}>{item.message} - {new Date(item.date).getHours()}:{new Date(item.date).getMinutes()}</li>
                ))}
            </ul>
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

export default GroupChat