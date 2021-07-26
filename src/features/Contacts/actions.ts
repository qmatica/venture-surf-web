export const actions = {
  setSearch: (search: string) => ({ type: 'CONTACTS__SET_SEARCH', search } as const)
}
