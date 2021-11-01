import axios from 'axios'
import { getFirebase } from 'react-redux-firebase'
import { AuthUserType, StatisticVideoType } from 'common/types'
import { proj } from 'config/firebase'
import { DeviceType } from 'features/Profile/types'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}

const instance = axios.create({
  baseURL: `https://us-central1-${proj}.cloudfunctions.net/`,
  headers
})

instance.interceptors.request.use(
  async (config) => {
    const authUser = getFirebase().auth().currentUser?.toJSON() as AuthUserType | undefined
    if (authUser) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${authUser.stsTokenManager.accessToken}`
    }
    return config
  }, (error) => {
    console.log(error)
  }
)

instance.interceptors.response.use((res) => res, (error) =>
  Promise.reject(error.response?.data || error.response || error))

export const profileAPI = {
  getMyProfile() {
    return instance.get('api/user').then((res) => res.data)
  },
  afterLogin(device: DeviceType) {
    return instance.post('api/afterLogin', { device }).then((res) => res.data)
  },
  updateMyProfile(value: { [key: string]: any }) {
    return instance.post('api/user', value).then((res) => res.status)
  },
  updateActiveRole(activeRole: 'investor' | 'founder', value?: { [key: string]: any }) {
    return instance.post(`api/role/${activeRole}`, value).then((res) => res.status)
  },
  uploadVideo(title: string) {
    return instance.put('/api/video', { title }).then((res) => res.data as { ref: string, upload_url: string })
  },
  renameVideo(title: string, new_title: string) {
    return instance.patch('/api/video', { title, new_title }).then((res) => res.status)
  },
  deleteVideo(title: string) {
    return instance.post('/api/video/delete', { title }).then((res) => res.status)
  },
  updateProfilePhoto(file: File) {
    const data = new FormData()
    data.append('fileName', file)

    return instance.post('/api/user/photo', null, {
      mode: 'no-cors',
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        type: 'formData'
      },
      body: data
    } as any).then((res) => res.data)
  },
  uploadDoc(title: string, file: File) {
    return instance.post(`/api/doc?title=${title}`, { file }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((res) => res.status)
  },
  getChatToken() {
    return instance.get('/api/chat/token').then((res) => res.data)
  }
}

export const usersAPI = {
  getUser(uid: string) {
    return instance.get(`api/user/${uid}`).then((res) => res.data)
  },
  deleteUser(uid: string) {
    return instance.delete(`/api/user/${uid}`).then((res) => res.data)
  },
  like(uid: string) {
    return instance.post(`api/like/${uid}`).then((res) => res.status)
  },
  withdrawLike(uid: string) {
    return instance.delete(`api/like/${uid}`).then((res) => res.status)
  },
  ignore(uid: string) {
    return instance.patch(`api/like/${uid}`).then((res) => res.status)
  },
  getMatches() {
    return instance.get('api/matches').then((res) => res.data)
  },
  getCurrentVideo(uid: string, videoId: string) {
    return instance.get(`/api/videos/${uid}/${videoId}`).then((res) => res.data)
  },
  getRecommended() {
    return instance.get('/api/recommend/me').then((res) => res.data)
  },
  callNow(uid: string, device_id: string) {
    return instance.put(`api/call/${uid}/invite`, { variants: ['now'], device_id }).then((res) => res.data)
  },
  callDecline(uid: string) {
    return instance.post(`/api/call/${uid}/all/decline`).then((res) => res.status)
  },
  createChat(uid: string) {
    return instance.post(`api/chat/${uid}`).then((res) => res.data)
  },
  sendStatisticVideo(uid: string, playbackID: string, data: StatisticVideoType) {
    return instance.post(`api/videos/${uid}/${playbackID}`, data).then((res) => res.data)
  },
  createPublicToken() {
    return instance.get('api/publicToken').then((res) => res.data)
  },
  getPublicProfile(uid: string, token: string) {
    const notAuthorizedInstance = axios.create({
      baseURL: `https://us-central1-${proj}.cloudfunctions.net/`,
      headers
    })
    return notAuthorizedInstance.get(`publicProfile?uid=${uid}&token=${token}`).then((res) => res.data)
  }
}
