import { useState } from 'react'
import './App.css'

import { PAYSHEEET_ENDPOINT } from './endpoints'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { id: Date.now(), text: input, sender: 'user' }
      setMessages(prev => [...prev, userMessage])
      setInput('')
      
      try {
        const response = await fetch(PAYSHEEET_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        })
        
        if (response.ok) {
          const data = await response.json()
          const agentMessage = { id: Date.now() + 1, text: data.response, sender: 'agent' }
          setMessages(prev => [...prev, agentMessage])
        } else {
          console.error('Failed to get response from AI agent')
        }
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  return (
    <div className="app">
      <h1>AI Chat Agent</h1>
      <div className="chat-window">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default App