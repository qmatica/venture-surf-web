import { RootState } from 'common/types'
import { createSelector } from 'reselect'

const videoChatSelector = (state: RootState) => state.videoChat
const devicesSelector = (state: RootState) => state.videoChat.devices
const selectedDevicesSelector = (state: RootState) => state.videoChat.selectedDevices
const isGroupSelector = (state: RootState) => state.videoChat.isGroup

export const getVideoChat = createSelector(videoChatSelector, (videoChat) => videoChat)

export const getDevices = createSelector(devicesSelector, (devices) => devices)
export const getSelectedDevices = createSelector(selectedDevicesSelector, (selectedDevices) => selectedDevices)
export const getIsGroup = createSelector(isGroupSelector, (isGroup) => isGroup)
