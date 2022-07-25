import React from 'react'
import styles from './Landing.module.css'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const Landing = () => {
    return (
        <>
            <Head>
                <title>Chatopia | Home</title>
                <meta name="description" content="Generated by Chatopia" />
            </Head>
            <div className={`${styles.landing}`}>
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
                    className={`${styles.framer_motion}`}
                >
                    <div className={`${styles.logo_container}`}>
                        <Image src={'/assets/img/icons/chatopia.png'} layout='fill'></Image>
                    </div>
                    <div className={`${styles.menu}`}>
                        <Link href='/chat'>
                            Chat
                        </Link>
                        <Link href='/user/edit'>
                            Profile
                        </Link>
                    </div>

                </motion.div>

            </div>
        </>
    )
}

export default Landing