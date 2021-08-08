import axios from 'axios'
import { getFirebase } from 'react-redux-firebase'
import { AuthUserType, DeviceType } from 'common/types'
import { proj } from 'config/firebase'

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

instance.interceptors.response.use((res) => res, (error) => Promise.reject(error.response.data))

export const profileAPI = {
  afterLogin(device: DeviceType) {
    return instance.post('api/afterLogin').then((res) => res.data)
  },
  getProfile() {
    return instance.get('api/user').then((res) => res.data)
  },
  updateMyProfile(value: { [key: string]: any }) {
    return instance.post('api/user', value).then((res) => res.status)
  },
  getVideos() {
    return instance.get('/api/videos').then((res) => res.data)
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
  uploadDoc(title: string, file: File) {
    return instance.post(`/api/doc?title=${title}`, { file }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((res) => res.status)
  }
}

export const usersAPI = {
  getUser(userId: string) {
    return instance.get(`api/user/${userId}`).then((res) => res.data)
  },
  deleteUser(userId: string) {
    return instance.delete(`/api/user/${userId}`).then((res) => res.data)
  },
  likeUser(userId: string) {
    return instance.post(`api/like/${userId}`).then((res) => res.data)
  },
  getMatches() {
    return instance.get('api/matches').then((res) => res.data)
  },
  getCurrentVideo(uid: string, videoId: string) {
    return instance.get(`/api/videos/${uid}/${videoId}`).then((res) => res.data)
  },
  getRecommended() {
    return instance.get('/api/recommend/me').then((res) => res.data)
  }
}
