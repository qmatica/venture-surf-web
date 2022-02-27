import { RootState } from 'common/types'
import { createSelector } from 'reselect'
import { Participant } from 'twilio-video/tsdef/Participant'
import { RemoteParticipant } from 'twilio-video/tsdef/RemoteParticipant'

const videoChatParticipantsSelector = (state: RootState) => state.videoChat.room?.participants

export const getVideoChatParticipants = createSelector(videoChatParticipantsSelector,
  (participants) => (participants || {}) as Map<Participant.SID, RemoteParticipant>)
