declare module '*.sass'
declare module '*.css'
declare module '*.jpg'
declare module '*.gif'
declare module '*.wav'
declare module '*.mp3'
declare module '*.json'
declare class ClipboardItem {
  constructor(data: { [mimeType: string]: Blob })
}
