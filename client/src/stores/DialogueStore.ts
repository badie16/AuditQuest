import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DialogueState {
  isOpen: boolean
  title: string
  content: string
  npcId: string
  portrait: string
  options: Array<{ id: string; question: string; answer: string; unlockChapterOrder?: number }>
  missionId?: string
  itemId?: string
}

const initialState: DialogueState = {
  isOpen: false,
  title: '',
  content: '',
  npcId: '',
  portrait: '',
  options: [],
}

export const dialogueSlice = createSlice({
  name: 'dialogue',
  initialState,
  reducers: {
    openDialogue: (
      state,
      action: PayloadAction<{
        title: string
        content: string
        npcId: string
        portrait: string
        options?: Array<{
          id: string
          question: string
          answer: string
          unlockChapterOrder?: number
        }>
        missionId?: string
        itemId?: string
      }>
    ) => {
      state.isOpen = true
      state.title = action.payload.title
      state.content = action.payload.content
      state.npcId = action.payload.npcId
      state.portrait = action.payload.portrait
      state.options = action.payload.options || []
      state.missionId = action.payload.missionId
      state.itemId = action.payload.itemId
    },
    closeDialogue: (state) => {
      state.isOpen = false
      state.options = []
    },
  },
})

export const { openDialogue, closeDialogue } = dialogueSlice.actions

export default dialogueSlice.reducer
