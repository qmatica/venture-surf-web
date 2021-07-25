export const actions = {
  openModal: (modalName: string) => ({ type: 'MODAL__OPEN', modalName } as const),
  closeModal: (modalName: string) => ({ type: 'MODAL__CLOSE', modalName } as const),
  toggleLoadingModal: (modalName: string, isLoading: boolean) => ({ type: 'MODAL__TOGGLE_LOADING', payload: { modalName, isLoading } } as const),
  reset: () => ({ type: 'MODAL__RESET' } as const)
}
