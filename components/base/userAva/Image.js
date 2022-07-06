import React from 'react'
import styles from './Image.module.css'
import Image from 'next/image'

const UserAva = ({source, style, onMouseOver, onMouseLeave, className, children}) => {
  return (
    <div 
      style={style}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      className={className}
    >
        <Image 
            src={source} 
            alt=''
            layout='fill' 
            className={`${styles['image']}`}
            priority

            
        />
        {children}
    </div>
  )
}

export default UserAva