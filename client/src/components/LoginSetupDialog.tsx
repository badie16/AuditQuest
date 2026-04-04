import React, { useState } from 'react'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import Adam from '../images/login/Adam_login.png'
import Ash from '../images/login/Ash_login.png'
import Lucy from '../images/login/Lucy_login.png'
import Nancy from '../images/login/Nancy_login.png'
import { useAppSelector, useAppDispatch } from '../hooks'
import { setLoggedIn } from '../stores/UserStore'
import { getAvatarString, getColorByString } from '../util'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

const Wrapper = styled.form`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(10, 12, 18, 0.82);
`

const Panel = styled.div`
  width: min(700px, calc(100vw - 32px));
  height: min(500px, calc(100vh - 32px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(180deg, #20304f, #121b2d);
  border: 4px solid #1b1b1b;
  box-shadow: 10px 10px 0 #000;
  padding: 18px;
  color: #f7f0df;

  @media (max-width: 780px) {
    height: auto;
    max-height: calc(100vh - 24px);
    overflow: auto;
  }
`

const Title = styled.h2`
  margin: 0 0 12px;
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  line-height: 1.5;
  color: #fff4d6;
`

const RoomHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  h3 {
    margin: 0;
    font-family: 'Press Start 2P', cursive;
    font-size: 11px;
    line-height: 1.5;
    color: #fff4d6;
  }

  p {
    margin: 4px 0 0;
    font-size: 12px;
    color: #c6d0e3;
  }
`

const RoomSummary = styled.div`
  margin: 14px 0;
  padding: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 3px solid #1b1b1b;
  box-shadow: 4px 4px 0 #000;
  color: #f7f0df;
  line-height: 1.5;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 12px;
`

const AvatarBlock = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;

  .avatar-label {
    margin: 0 0 10px;
    font-family: 'Press Start 2P', cursive;
    font-size: 8px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #c6d0e3;
  }

  --swiper-navigation-size: 24px;

  .swiper {
    width: 100%;
    height: clamp(150px, 26vh, 220px);
    overflow: hidden;
    border: 4px solid #1b1b1b;
    box-shadow: 5px 5px 0 #000;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #f2e8cf, #d9c7a1);
  }

  .swiper-slide img {
    width: 98px;
    height: 142px;
    object-fit: contain;
    image-rendering: pixelated;
  }
`

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
`

const MainContent = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 14px;

  > * {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 780px) {
    flex-direction: column;
  }
`

const Warning = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const FooterActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  .support-note {
    font-size: 12px;
    line-height: 1.5;
    color: #c6d0e3;
  }
`

const PixelButton = styled(Button)`
  && {
    font-family: 'Press Start 2P', cursive;
    font-size: 9px;
    line-height: 1.6;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border: 4px solid #1b1b1b;
    border-radius: 0;
    box-shadow: 4px 4px 0 #000;
    padding: 12px 16px;
  }

  &&.MuiButton-containedSecondary {
    background: #42eacb;
    color: #0f1722;
  }

  &&.MuiButton-outlinedSecondary {
    background: #fff8ea;
    color: #1b1b1b;
  }

  &&:hover {
    transform: translate(1px, 1px);
    box-shadow: 3px 3px 0 #000;
  }
`

const ConnectButton = styled(PixelButton)`
  align-self: flex-start;
`

const PixelAlert = styled(Alert)`
  && {
    border: 3px solid #1b1b1b;
    box-shadow: 4px 4px 0 #000;
    background: #fff8ea;
    color: #1b1b1b;
    font-family: 'Courier New', monospace;
  }

  && .MuiAlertTitle-root {
    font-family: 'Press Start 2P', cursive;
    font-size: 8px;
    line-height: 1.6;
  }
`

const PixelTextField = styled(TextField)`
  && .MuiInputLabel-root {
    font-family: 'Press Start 2P', cursive;
    font-size: 8px;
    color: #c6d0e3;
  }

  && .MuiInputLabel-root.Mui-focused {
    color: #42eacb;
  }

  && .MuiOutlinedInput-root {
    background: #fff8ea;
    border-radius: 0;
  }

  && .MuiOutlinedInput-notchedOutline {
    border: 3px solid #1b1b1b;
  }

  && .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline,
  && .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #1b1b1b;
    border-width: 3px;
  }

  && .MuiInputBase-input {
    font-family: 'Courier New', monospace;
    color: #1b1b1b;
  }

  && .MuiFormHelperText-root {
    font-family: 'Courier New', monospace;
    color: #f7f0df;
  }
`

const PixelAvatar = styled(Avatar)`
  && {
    width: 56px;
    height: 56px;
    border: 4px solid #1b1b1b;
    box-shadow: 4px 4px 0 #000;
    image-rendering: pixelated;
  }
`

const avatars = [
  { name: 'adam', img: Adam },
  { name: 'ash', img: Ash },
  { name: 'lucy', img: Lucy },
  { name: 'nancy', img: Nancy },
]

for (let i = avatars.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[avatars[i], avatars[j]] = [avatars[j], avatars[i]]
}

export default function LoginSetupDialog() {
  const [name, setName] = useState<string>('')
  const [avatarIndex, setAvatarIndex] = useState<number>(0)
  const [nameFieldEmpty, setNameFieldEmpty] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const roomJoined = useAppSelector((state) => state.room.roomJoined)
  const roomName = useAppSelector((state) => state.room.roomName)
  const roomDescription = useAppSelector((state) => state.room.roomDescription)
  const game = phaserGame.scene.keys.game as Game

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (name === '') {
      setNameFieldEmpty(true)
      return
    }

    if (!roomJoined) {
      return
    }

    game.registerKeys()
    game.myPlayer.setPlayerName(name)
    game.myPlayer.setPlayerTexture(avatars[avatarIndex].name)
    game.network.readyToConnect()
    dispatch(setLoggedIn(true))
  }

  return (
    <Wrapper onSubmit={handleSubmit}>
      <Panel>
        <Title>Agent Login</Title>

        <RoomHeader>
          <PixelAvatar style={{ background: getColorByString(roomName) }}>
            {getAvatarString(roomName)}
          </PixelAvatar>
          <div>
            <h3>{roomName}</h3>
            <p>{roomJoined ? 'Room ready' : 'Waiting for room confirmation'}</p>
          </div>
        </RoomHeader>

        <RoomSummary>
          <ArrowRightIcon />
          <span>{roomDescription}</span>
        </RoomSummary>

        <MainContent>
          <AvatarBlock>
            <div className="avatar-label">Choose your avatar</div>
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={0}
              slidesPerView={1}
              onSlideChange={(swiper) => {
                setAvatarIndex(swiper.activeIndex)
              }}
            >
              {avatars.map((avatar) => (
                <SwiperSlide key={avatar.name}>
                  <img src={avatar.img} alt={avatar.name} />
                </SwiperSlide>
              ))}
            </Swiper>
          </AvatarBlock>

          <FormStack>
            <PixelTextField
              autoFocus
              fullWidth
              label="Name"
              variant="outlined"
              color="secondary"
              error={nameFieldEmpty}
              helperText={nameFieldEmpty && 'Name is required'}
              onInput={(e) => {
                setName((e.target as HTMLInputElement).value)
              }}
            />

            {!videoConnected && (
              <Warning>
                <PixelAlert variant="outlined" severity="warning">
                  <AlertTitle>Equipment check</AlertTitle>
                  No webcam or microphone detected. Connect one for the full briefing experience.
                </PixelAlert>
                <ConnectButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    game.network.webRTC?.getUserMedia()
                  }}
                >
                  Connect Webcam
                </ConnectButton>
              </Warning>
            )}

            {videoConnected && (
              <Warning>
                <PixelAlert variant="outlined">Webcam connected and ready.</PixelAlert>
              </Warning>
            )}

            <FooterActions>
              <PixelButton variant="contained" color="secondary" size="large" type="submit" disabled={!roomJoined}>
                Login
              </PixelButton>              
            </FooterActions>
          </FormStack>
        </MainContent>
      </Panel>
    </Wrapper>
  )
}
