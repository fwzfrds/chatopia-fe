import React from 'react'

const Button = ({ style, onClick, text, className, form, type, key, htmlFor, children }) => {

  return (
    <button
      style={style}
      onClick={onClick}
      className={className}
      form={form}
      type={type}
      key={key}
      htmlFor={htmlFor}
    >
      {text}
      {children}
    </button>
  )
}

export default Button