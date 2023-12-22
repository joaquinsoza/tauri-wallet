import React from "react"

interface ButtonPrimaryProps {
  children: React.ReactNode
  onClick: () => void
}

export const ButtonPrimary = (
  {
    children,
    onClick
  }: ButtonPrimaryProps) => {

  return (
    <button
      className="bg-[#C623FF] rounded-md p-4"
      onClick={onClick}
    >
      {children}
    </button>
  )
}