import React, { useEffect, useState, useContext } from 'react'
import UserAva from '../../base/userAva/Image'
import styles from './ChatList.module.css'
import Input from '../../base/input/input'
import { chatContext } from '../../../pages/chat/chat'
import axios from 'axios'

const ChatList = ({ userData }) => {

    const [chatMenuActive, setChatMenuActive] = useState('important')
    const { isChatActive, handleChatActive, authToken } = useContext(chatContext)
    const [friendList, setFriendList] = useState('')

    const receiver = 'muhammadfawwaz463@gmail.com'

    useEffect(() => {
        const fetchFriends = async () => {
            if (authToken) {
                try {
                    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/user-contact`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    })
                    // console.log(result.data.data)
                    setFriendList(result.data.data)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        fetchFriends()
    }, [authToken])

    // useEffect(() => {
    //     if (userData) {
    //         console.log(userData)
    //         console.log(isChatActive)
    //     }
    // }, [userData])

    // console.log(friendList)

    return (
        <div className={`${styles.chat_nav}`}>
            {/* <h3>Chat list</h3> */}
            <div className={`${styles.user}`}>
                <UserAva
                    source={userData.photo ? userData.photo : '/assets/img/dummy-img.jpg'}
                    style={{
                        width: 55,
                        height: 55,
                        position: 'relative'
                    }}
                />
                <h4>{userData.name ? userData.name : 'Loading...'}</h4>
                <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="22" height="3.3" rx="1.65" fill="#7E98DF" />
                    <rect y="7.69995" width="13.2" height="3.3" rx="1.65" fill="#7E98DF" />
                    <rect y="15.4" width="22" height="3.3" rx="1.65" fill="#7E98DF" />
                </svg>
            </div>
            <div className={`${styles.search_message}`}>
                <Input
                    placeholder={'Type your message...'}
                />
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" width="3" height="23" rx="1.5" fill="#7E98DF" />
                    <rect x="23" y="10" width="3" height="23" rx="1.5" transform="rotate(90 23 10)" fill="#7E98DF" />
                </svg>
            </div>
            <div className={`${styles.chat_container}`}>
                <div className={`${styles.chat_menu}`}>
                    <p
                        className={chatMenuActive === 'all' ? `${styles.active}` : {}}
                        onClick={() => setChatMenuActive('all')}
                    >
                        all
                    </p>
                    <p
                        className={chatMenuActive === 'important' ? `${styles.active}` : {}}
                        onClick={() => setChatMenuActive('important')}
                    >
                        important
                    </p>
                    <p
                        className={chatMenuActive === 'unread' ? `${styles.active}` : {}}
                        onClick={() => setChatMenuActive('unread')}
                    >
                        unread
                    </p>

                </div>
                <div className={`${styles.chat_list}`}>
                    {friendList ? friendList.map((friend, idx) => {
                        return (
                            <div key={idx} className={`${styles.chat}`}
                                onClick={() => handleChatActive(friend)}
                            >
                                <UserAva
                                    source={friend.photo ? friend.photo : '/assets/img/dummy-img.jpg'}
                                    style={{
                                        width: 55,
                                        height: 55,
                                        position: 'relative'
                                    }}
                                />
                                <div className={`${styles.chat_data}`}>
                                    <h4>{friend.name}</h4>
                                    <p>What's up bro?</p>
                                </div>
                                <div className={`${styles.chat_info}`}>
                                    <p>15:20</p>
                                    <h5>2</h5>
                                </div>
                            </div>
                        )
                    })
                        :
                        'Empty'
                    }


                </div>
                <p className={`${styles.copyright}`}>&copy; <span>Chatopia 2022. all right reserved</span></p>
            </div>
        </div>
    )
}

export default ChatList