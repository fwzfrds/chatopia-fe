import React from 'react'
import styles from './Input.module.css'

const Input = ({
  type,
  id,
  name,
  onChange,
  placeholder,
  value,
  autofocus,
  label,
  style,
  styleContainer,
  className,
  defaultValue,
  children
}) => {

  return (

    <div className={`${styles.input_container}`}
      style={styleContainer}
    >
      <label htmlFor={id}>
        {label}
      </label>
      {autofocus ?
        <input
          type={type}
          id={id}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          style={style}
          className={className}
          defaultValue={defaultValue}
          autoFocus
        />
        :
        <input
          type={type}
          id={id}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          style={style}
          className={className}
          defaultValue={defaultValue}
        />
      }
      {children}
    </div>
  )
}

export default Input