import React, { useEffect, useState, createContext } from 'react'
import ChatList from '../../components/module/chatList'
import styles from './Chat.module.css'
import swal from 'sweetalert'
import { useRouter } from 'next/router'
import axios from 'axios'
import UserAva from '../../components/base/userAva/Image'
import io from 'socket.io-client'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'
import ScrollToBottom from 'react-scroll-to-bottom'
import { motion } from 'framer-motion'

export const chatContext = createContext({})

const ChatPage = () => {

  const router = useRouter()
  const [authToken, setAuthToken] = useState('')
  const [userData, setUserData] = useState('')
  const [isChatActive, setisChatActive] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [receiver, setReceiver] = useState('')
  const [socket, setSocket] = useState(null)

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
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('ChatopiaUser')
      if (!isAuth) {
        swal({
          title: "Warning!",
          text: `Please login to access this page`,
          icon: "error",
        })
        router.push('/auth/user/signin?redirect=true')
      } else {
        const { token } = JSON.parse(isAuth)
        setAuthToken(token)
      }
    }
  }, [])

  useEffect(() => {
    const fetchChatHistory = async () => {
      setMessages('')

      try {
        const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/message/get/${receiver.email}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })
        // console.log(result.data.data)
        const messages = result.data.data
        setMessages(messages)
      } catch (error) {
        console.log(error)
      }
    }

    if (receiver && authToken) {
      // console.log(receiver.email)
      // console.log(authToken)
      fetchChatHistory()
    }
  }, [receiver])

  const fetchUser = async () => {
    try {
      const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      const data = result.data.data
      setUserData(data)
    } catch (error) {
      console.log(error)
      swal({
        title: "Warning!",
        text: `${error.response.data.message}`,
        icon: "error",
      })
      if (error.response.data.message === 'token expired, please login!') {
        localStorage.removeItem('ChatopiaUser')
        router.push('/auth/user/signin?redirect=true')
      }
    }
  }

  const connectSocket = () => {
    const { name, email } = userData

    const resultSocket = io.connect(`${process.env.NEXT_PUBLIC_API_URL}`, {
      query: {
        name,
        email
      }
    })

    setSocket(resultSocket)
    resultSocket.on('messageBE', (data) => {
      setMessages((current) => [...current, data])
      notify()
    })

    resultSocket.on('delMessageBE', (data) => {
      const msgIdx = data.msgIdx
      removeNode(msgIdx)
    })
  }

  const removeNode = (msgIdx) => {
    const thisEl = document.getElementById(`id_${msgIdx}`)
    
    if(thisEl) {
      document.getElementById(`id_${msgIdx}`).remove()
    }
  }

  useEffect(() => {
    if (authToken) {
      fetchUser()
    }
  }, [authToken])

  useEffect(() => {
    if (userData) {
      connectSocket()
    }
  }, [userData])

  const handleChatActive = (receiver) => {
    setisChatActive('')
    setisChatActive('active')
    setReceiver(receiver)
  }

  const handleMessage = (e) => {
    setMessage({ ...message, [e.target.name]: e.target.value })
  }

  const handleChangePhoto = (e) => {
    const file = e.target.files[0]
    const urlPreview = URL.createObjectURL(file)
    setMessage({ ...message, [e.target.name]: e.target.files[0] })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.message || message.image) {
      try {

        socket.emit('message', { message: message, to: receiver.email }, (messageData) => {
          setMessages((current) => [...current, messageData]);
        })
        setMessage({ ...message, message: '' })
        setTimeout(() => {
          setMessage('')
        }, 500);

      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('ChatopiaUser')
    setAuthToken('')
    router.push('/auth/user/signin')
    swal({
      title: "Logout",
      text: `Logout Success`,
      icon: "success",
    })
  }

  const handleDeleteMessage = (e, messageData) => {

    let thisClicked = e.currentTarget;

    swal({
      title: "Are you sure?",
      text: `This message cannot be restored`,
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(async (isOkay) => {
      if (isOkay) {
        console.log('deleteing email')
        await swal({
          title: "Succes",
          text: `Delete message success`,
          icon: "success",
        })
        thisClicked.closest('li').remove();
        socket.emit('delMessage', messageData)
      } else {
        swal({
          title: "Delete",
          text: `Delete message canceled`,
          icon: "error",
        })
      }
    })
  }

  return (
    <>
      <Head>
        <title>Chatopia | Chat Page</title>
        <meta name="description" content="Generated by Chatopia" />
      </Head>
      <div className={`${styles.chat_page}`}>
        <motion.div
          initial={{
            scale: 0.5,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: {
              delay: 0.2
            }
          }}
          exit={{
            width: 0,
            transition: { duration: 100 }
          }}
        >
          <div className={`${styles.chat_page_container}`}>
            <chatContext.Provider value={{ isChatActive, handleLogout, handleChatActive, authToken }}>
              <ChatList
                userData={userData ? userData : ''}
              />
            </chatContext.Provider>
            <div className={`${styles.chat_area}`}>
              {isChatActive === 'active' ?
                <>
                  <div className={`${styles.chat_receiver}`}>
                    <UserAva
                      source={receiver.photo ? receiver.photo : '/assets/img/dummy-img.jpg'}
                      style={{
                        width: 55,
                        height: 55,
                        position: 'relative'
                      }}
                    />
                    <div className={`${styles.receiver_info}`}>
                      <p>{receiver ? receiver.name : 'Loading...'}</p>
                      <p>Online</p>
                    </div>
                    <div className={`${styles.svg_container}`}>
                      <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="5" height="5" rx="2.5" fill="#7E98DF" />
                        <rect x="15" width="5" height="5" rx="2.5" fill="#7E98DF" />
                        <rect y="14" width="5" height="5" rx="2.5" fill="#7E98DF" />
                        <rect x="15" y="14" width="5" height="5" rx="2.5" fill="#7E98DF" />
                      </svg>
                    </div>
                  </div>
                  <div className={`${styles.chat_place}`}>
                    <div className={`${styles.chats}`}>
                      <ul>
                        <ScrollToBottom className={`${styles.scroll_bottom}`}>
                          {messages ? messages.map((message, idx) => (
                            <li key={idx} id={`id_${idx}`}>
                              <div className={message.id_sender === userData.email 
                                ? `${styles.yours}` : `${styles.others}`}>
                                <p>{message.message}</p>
                                <p>{new Date(message.created_at).getHours()}:{new Date(message.created_at).getMinutes()}</p>
                                <div className={`${styles.chat_actions}`}
                                  onClick={(e) => handleDeleteMessage(e, { ...message, msgIdx: idx })}>
                                  <h6>...</h6>
                                </div>
                              </div>
                            </li>
                          ))
                            :
                            <p
                              style={{
                                textAlign: 'center',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >Chat is Empty, Let's start a conversation</p>
                          }
                        </ScrollToBottom>
                        {/* <li>
                      <div className={`${styles.others}`}>
                        <p>hai waz</p>
                        <p>10:10</p>
                      </div>
                    </li> */}
                      </ul>
                    </div>
                    <div className={`${styles.chat_typer}`}>
                      <div className={`${styles.typer}`}>
                        <form onSubmit={handleSendMessage} autoComplete="off">
                          <input type="text" name='message' placeholder='type your message here...'
                            onChange={handleMessage} value={message.message} autoFocus
                          />
                          <input type="file" name='image' id='image' hidden
                            onChange={handleChangePhoto}
                          />
                          <button
                            type='submit'
                            // form='message-form'
                            style={{
                              display: 'none'
                            }}
                          ></button>
                        </form>
                        <div className={`${styles.attachment}`}>
                          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="10" width="3" height="23" rx="1.5" fill="#7E98DF" />
                            <rect x="23" y="10" width="3" height="23" rx="1.5" transform="rotate(90 23 10)" fill="#7E98DF" />
                          </svg>
                          <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.9908 0C5.7635 0 0.720703 5.04 0.720703 11.25C0.720703 17.46 5.7635 22.5 11.9908 22.5C18.2295 22.5 23.2836 17.46 23.2836 11.25C23.2836 5.04 18.2295 0 11.9908 0ZM8.05363 6.75C8.98999 6.75 9.74584 7.50375 9.74584 8.4375C9.74584 9.37125 8.98999 10.125 8.05363 10.125C7.11727 10.125 6.36142 9.37125 6.36142 8.4375C6.36142 7.50375 7.11727 6.75 8.05363 6.75ZM12.0021 18C11.2945 18 10.616 17.8587 9.9857 17.599C7.42091 16.5422 9.22814 13.5 12.0021 13.5C14.7761 13.5 16.5833 16.5422 14.0186 17.599C13.3883 17.8587 12.7097 18 12.0021 18ZM15.9506 10.125C15.0143 10.125 14.2584 9.37125 14.2584 8.4375C14.2584 7.50375 15.0143 6.75 15.9506 6.75C16.887 6.75 17.6428 7.50375 17.6428 8.4375C17.6428 9.37125 16.887 10.125 15.9506 10.125Z" fill="#7E98DF" />
                          </svg>
                          <label htmlFor="image">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="1" y="1" width="17" height="17" rx="2" fill="#7E98DF" stroke="#7E98DF" strokeWidth="2" />
                              <circle cx="9.5" cy="9.5" r="4.5" fill="#FAFAFA" stroke="#7E98DF" strokeWidth="2" />
                            </svg>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>

                :
                <h3>Please select a chat to start messaging</h3>
              }
            </div>
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
        </motion.div>
      </div>
    </>
  )
}

export default ChatPage