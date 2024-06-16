import React, {useState, useEffect} from "react"

const TypingText = ({ children, speed = 50, settedIndex = 0 }) => {
  const [typingText, setTypingText] = useState('')
  const [index, setIndex] = useState(settedIndex)

  useEffect(() => {
    if(index === 0) {
      setTypingText('')
    }
    if (index < children.length) {
      const timer = setTimeout(() => {
        setTypingText((prev) => prev + children[index])
        setIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    }
  }, [index, children, speed])

  return (
    <h1 className="text-gray-300 font-light">
      {typingText}
      <span className="text-transparent select-none">|</span>
    </h1>
  )
}

export default TypingText