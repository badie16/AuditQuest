import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DialogueState {
  isOpen: boolean
  title: string
  content: string
  npcId: string
  portrait: string
  missionId?: string
  itemId?: string
}

const initialState: DialogueState = {
  isOpen: false,
  title: '',
  content: '',
  npcId: '',
  portrait: '',
}

export const dialogueSlice = createSlice({
  name: 'dialogue',
  initialState,
  reducers: {
    openDialogue: (state, action: PayloadAction<{ 
      title: string; 
      content: string; 
      npcId: string; 
      portrait: string;
      missionId?: string;
      itemId?: string;
    }>) => {
      state.isOpen = true
      state.title = action.payload.title
      state.content = action.payload.content
      state.npcId = action.payload.npcId
      state.portrait = action.payload.portrait
      state.missionId = action.payload.missionId
      state.itemId = action.payload.itemId
    },
    closeDialogue: (state) => {
      state.isOpen = false
    },
  },
})

export const { openDialogue, closeDialogue } = dialogueSlice.actions

export default dialogueSlice.reducer
