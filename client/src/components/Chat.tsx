import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CloseIcon from '@mui/icons-material/Close'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

import { getColorByString } from '../util'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MessageType, setFocused, setShowChat } from '../stores/ChatStore'
import { BackgroundMode } from '../../../types/BackgroundMode'

const Backdrop = styled.div`
  position: fixed;
  bottom: 40px;
  left: 0;
  height: 400px;
  width: 450px;
  max-height: 50%;
  max-width: 100%;
  z-index: 1000;
`

const Wrapper = styled.div<{ $isDay: boolean }>`
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;

  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: ${(props) => (props.$isDay ? '#fff' : '#2c2c2c')};
    border: 4px solid ${(props) => (props.$isDay ? '#2c3e50' : '#eee')};
    box-shadow: 8px 8px 0px #000;
  }
`

const FabWrapper = styled.div`
  margin-top: auto;
`

const PixelButton = styled.button<{ $isDay: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.$isDay ? '#3498db' : '#426dea')};
  color: white;
  border: 3px solid ${(props) => (props.$isDay ? '#2c3e50' : '#eee')};
  box-shadow: 3px 3px 0px #000;
  cursor: pointer;
  transition: all 0.1s ease;
  border-radius: 0;

  &:hover {
    background-color: ${(props) => (props.$isDay ? '#2980b9' : '#3557c0')};
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0px #000;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px #000;
  }

  svg {
    font-size: 20px;
  }
`

const ChatHeader = styled.div<{ $isDay: boolean }>`
  position: relative;
  height: 40px;
  background: ${(props) => (props.$isDay ? '#2c3e50' : '#1a1a1a')};
  border-bottom: 4px solid ${(props) => (props.$isDay ? '#2c3e50' : '#eee')};
  display: flex;
  padding: 10px 0px;
  align-items: center;
  justify-content: center;

  h3 {
    color: #42eacb;
    margin: 0;
    font-size: 14px;
    font-family: 'Press Start 2P', cursive;
    text-transform: uppercase;
  }

  .close {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    color: #eee;
  }
`

const ChatBox = styled(Box)<{ $isDay: boolean }>`
  height: 100%;
  width: 100%;
  overflow: auto;
  background: ${(props) => (props.$isDay ? '#f0f4f8' : '#2c2c2c')};
  padding: 5px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  &::-webkit-scrollbar-thumb {
    background: #42eacb;
  }
`

const InputWrapper = styled.form<{ $isDay: boolean }>`
  border-top: 4px solid ${(props) => (props.$isDay ? '#2c3e50' : '#eee')};
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${(props) => (props.$isDay ? '#fff' : '#1a1a1a')};
  padding: 5px;
  gap: 8px;
`

const InputTextField = styled(InputBase)`
  font-family: 'Press Start 2P', cursive !important;
  font-size: 10px !important;
  flex: 1;
  input {
    padding: 5px;
    color: inherit;
  }
`

const MessageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0px 2px;

  p {
    margin: 3px;
    text-shadow: 0.3px 0.3px black;
    font-size: 12px;
    font-weight: bold;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  span {
    color: white;
    font-weight: normal;
  }

  .notification {
    color: grey;
    font-weight: normal;
  }

  :hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 54px;
  right: 16px;
  z-index: 10;
`

const dateFormatter = new Intl.DateTimeFormat('en', {
  timeStyle: 'short',
  dateStyle: 'short',
})

const Message = ({ chatMessage, messageType }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <MessageWrapper
      onMouseEnter={() => {
        setTooltipOpen(true)
      }}
      onMouseLeave={() => {
        setTooltipOpen(false)
      }}
    >
      <Tooltip
        open={tooltipOpen}
        title={dateFormatter.format(chatMessage.createdAt)}
        placement="right"
        arrow
      >
        {messageType === MessageType.REGULAR_MESSAGE ? (
          <p
            style={{
              color: getColorByString(chatMessage.author),
            }}
          >
            {chatMessage.author}: <span>{chatMessage.content}</span>
          </p>
        ) : (
          <p className="notification">
            {chatMessage.author} {chatMessage.content}
          </p>
        )}
      </Tooltip>
    </MessageWrapper>
  )
}

export default function Chat() {
  const [inputValue, setInputValue] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const showChat = useAppSelector((state) => state.chat.showChat)
  const backgroundMode = useAppSelector((state) => state.user.backgroundMode)
  const isDay = backgroundMode === BackgroundMode.DAY
  const dispatch = useAppDispatch()
  const game = phaserGame.scene.keys.game as Game

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      // move focus back to the game
      inputRef.current?.blur()
      dispatch(setShowChat(false))
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // this is added because without this, 2 things happen at the same
    // time when Enter is pressed, (1) the inputRef gets focus (from
    // useEffect) and (2) the form gets submitted (right after the input
    // gets focused)
    if (!readyToSubmit) {
      setReadyToSubmit(true)
      return
    }
    // move focus back to the game
    inputRef.current?.blur()

    const val = inputValue.trim()
    setInputValue('')
    if (val) {
      game.network.addChatMessage(val)
      game.myPlayer.updateDialogBubble(val)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, showChat])

  return (
    <Backdrop>
      <Wrapper $isDay={isDay}>
        {showChat ? (
          <div className="chat-container">
            <ChatHeader $isDay={isDay}>
              <h3>Chat</h3>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setShowChat(false))}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </ChatHeader>
            <ChatBox $isDay={isDay}>
              {chatMessages.map(({ messageType, chatMessage }, index) => (
                <Message chatMessage={chatMessage} messageType={messageType} key={index} />
              ))}
              <div ref={messagesEndRef} />
              {showEmojiPicker && (
                <EmojiPickerWrapper>
                  <Picker
                    theme={isDay ? 'light' : 'dark'}
                    showSkinTones={false}
                    showPreview={false}
                    onSelect={(emoji) => {
                      setInputValue(inputValue + emoji.native)
                      setShowEmojiPicker(!showEmojiPicker)
                      dispatch(setFocused(true))
                    }}
                    exclude={['recent', 'flags']}
                  />
                </EmojiPickerWrapper>
              )}
            </ChatBox>
            <InputWrapper $isDay={isDay} onSubmit={handleSubmit}>
              <InputTextField
                inputRef={inputRef}
                autoFocus={focused}
                fullWidth
                placeholder="Type message..."
                value={inputValue}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onFocus={() => {
                  if (!focused) {
                    dispatch(setFocused(true))
                    setReadyToSubmit(true)
                  }
                }}
                onBlur={() => {
                  dispatch(setFocused(false))
                  setReadyToSubmit(false)
                }}
              />
              <IconButton aria-label="emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <InsertEmoticonIcon />
              </IconButton>
            </InputWrapper>
          </div>
        ) : (
          <FabWrapper>
            <Tooltip title="Open Chat" placement="right">
              <PixelButton
                $isDay={isDay}
                aria-label="showChat"
                onClick={() => {
                  dispatch(setShowChat(true))
                  dispatch(setFocused(true))
                }}
              >
                <ChatBubbleOutlineIcon />
              </PixelButton>
            </Tooltip>
          </FabWrapper>
        )}
      </Wrapper>
    </Backdrop>
  )
}
