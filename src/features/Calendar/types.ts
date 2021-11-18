export type timeSlotsType = {
  [key in 'add' & 'del' & 'disable' & 'enable']: string[]
}
