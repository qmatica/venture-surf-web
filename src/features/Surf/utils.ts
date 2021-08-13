import { UserType } from 'features/User/types'

type UpdateUsersType = {
  users: UserType[]
  updatedUserId: string
  activeActions?: string[]
  loader?: string
}

export const updateUsers = ({
  users, updatedUserId, activeActions, loader
}: UpdateUsersType) => {
  const updatedUsers = [...users]
  const updatedIndexUser = users.findIndex((user) => user.uid === updatedUserId)

  let updatedLoaders = updatedUsers[updatedIndexUser].loaders

  if (loader) {
    const loaderIndex = updatedUsers[updatedIndexUser].loaders.findIndex((uLoader) => uLoader === loader)
    updatedLoaders = loaderIndex >= 0 ? updatedLoaders.slice(loaderIndex, 1) : [...updatedLoaders, loader]
  }

  updatedUsers[updatedIndexUser] = {
    ...updatedUsers[updatedIndexUser],
    activeActions: activeActions || updatedUsers[updatedIndexUser].activeActions,
    loaders: updatedLoaders
  }

  return updatedUsers
}
