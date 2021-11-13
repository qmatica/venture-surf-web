import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'common/types'
import { useTable } from 'react-table'
import { actions as actionsApp } from 'common/actions'
import { UserIcon } from 'common/icons'
import { Preloader } from 'common/components/Preloader'
import { v4 as uuidv4 } from 'uuid'
import { actions as actionsNotifications } from 'features/Notifications/actions'
import ReactTooltip from 'react-tooltip'
import { Redirect } from 'react-router-dom'
import { Accordion } from './components/Accordion'
import styles from './styles.module.sass'

export const Admin = () => {
  const dispatch = useDispatch()
  const isAdminMode = useSelector((state: RootState) => state.admin.isAdminMode)
  const users = useSelector((state: RootState) => state.admin.users)
  const isLoading = useSelector((state: RootState) => state.admin.isLoading)

  useEffect(() => {
    dispatch(actionsApp.setIsFullScreen(true))
    return () => {
      dispatch(actionsApp.setIsFullScreen(false))
    }
  }, [])

  const copyInBuffer = (title: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      console.log(`${title} copied: `, value)

      dispatch(actionsNotifications.addAnyMsg({
        msg: `${title}: ${value} copied!`,
        uid: uuidv4()
      }))
    }).catch((err) => {
      dispatch(actionsNotifications.addErrorMsg(JSON.stringify(err)))
    })
  }

  if (!isAdminMode) return <Redirect to="/surf" />

  const columns = React.useMemo(
    () => [
      {
        Header: 'photoURL',
        accessor: 'photoURL',
        Cell: ({ row }: any) => (
          <div className={styles.photoContainer}>
            {row.values.photoURL
              ? <img src={row.values.photoURL} alt={row.values.uid} />
              : <UserIcon />}
          </div>
        )
      },
      {
        Header: 'uid',
        id: 'uid',
        accessor: 'uid',
        Cell: ({ row }: any) => (
          <div
            className={styles.uid}
            onClick={() => copyInBuffer('uid', row.values.uid)}
            data-tip="copy"
            data-place="bottom"
            data-effect="solid"
            data-offset="{'top': 25}"
          >
            {row.values.uid}
          </div>
        )
      },
      {
        Header: 'first_name',
        id: 'first_name',
        accessor: 'props.first_name',
        Cell: ({ row }: any) => (
          <div>{row.values.first_name}</div>
        )
      },
      {
        Header: 'last_name',
        id: 'last_name',
        accessor: 'props.last_name',
        Cell: ({ row }: any) => (
          <div>{row.values.last_name}</div>
        )
      },
      {
        Header: 'displayName',
        accessor: 'displayName'
      },
      {
        Header: 'phoneNumber',
        accessor: 'phoneNumber'
      },
      {
        Header: 'email',
        accessor: 'email'
      },
      {
        Header: 'mutuals',
        id: 'mutuals',
        accessor: 'props.mutuals',
        Cell: ({ row }: any) => (
          <div className={styles.contactsContainer}>
            {row.values.mutuals && Object.entries(row.values.mutuals).map(([key, value]: any) => (
              <div
                className={styles.contact}
                onClick={() => copyInBuffer('uid', key)}
                data-tip="copy uid"
                data-place="bottom"
                data-effect="solid"
              >
                <div className={styles.minPhotoContainer}>
                  {value.photoURL ? <img src={value.photoURL} alt={key} /> : <UserIcon />}
                </div>
                <div>{value.displayName}</div>
              </div>
            ))}
          </div>
        )
      },
      {
        Header: 'likes',
        id: 'likes',
        accessor: 'props.likes',
        Cell: ({ row }: any) => (
          <div className={styles.contactsContainer}>
            {row.values.likes && Object.entries(row.values.likes).map(([key, value]: any) => (
              <div
                className={styles.contact}
                onClick={() => copyInBuffer('uid', key)}
                data-tip="copy uid"
                data-place="bottom"
                data-effect="solid"
              >
                <div className={styles.minPhotoContainer}>
                  {value.photoURL ? <img src={value.photoURL} alt={key} /> : <UserIcon />}
                </div>
                <div>{value.displayName}</div>
              </div>
            ))}
          </div>
        )
      },
      {
        Header: 'liked',
        id: 'liked',
        accessor: 'props.liked',
        Cell: ({ row }: any) => (
          <div className={styles.contactsContainer}>
            {row.values.liked && Object.entries(row.values.liked).map(([key, value]: any) => (
              <div
                className={styles.contact}
                onClick={() => copyInBuffer('uid', key)}
                data-tip="copy uid"
                data-place="bottom"
                data-effect="solid"
              >
                <div className={styles.minPhotoContainer}>
                  {value.photoURL ? <img src={value.photoURL} alt={key} /> : <UserIcon />}
                </div>
                <div>{value.displayName}</div>
              </div>
            ))}
          </div>
        )
      },
      {
        Header: 'activeRole',
        id: 'activeRole',
        accessor: 'props.activeRole',
        Cell: ({ row }: any) => (
          <div>{row.values.activeRole}</div>
        )
      },
      {
        Header: 'roles',
        id: 'roles',
        accessor: 'props.roles',
        Cell: ({ row }: any) => (
          <div>{row.values.roles?.join(', ')}</div>
        )
      },
      {
        Header: 'investors',
        id: 'investors',
        accessor: 'props.investors',
        Cell: ({ row }: any) => (
          <div className={styles.interactionsContainer}>
            {row.values.investors && Object.entries(row.values.investors).map(([key, value]: any) => (
              <div className={styles.interactionContainer}>
                <div>{key}</div>
                <div className={styles.status}>{value.status}</div>
              </div>
            ))}
          </div>
        )
      },
      {
        Header: 'investments',
        id: 'investments',
        accessor: 'props.investments',
        Cell: ({ row }: any) => (
          <div className={styles.interactionsContainer}>
            {row.values.investments && Object.entries(row.values.investments).map(([key, value]: any) => (
              <div className={styles.interactionContainer}>
                <div>{key}</div>
                <div className={styles.status}>{value.status}</div>
              </div>
            ))}
          </div>
        )
      },
      {
        Header: 'slots',
        id: 'slots',
        accessor: 'props.slots',
        Cell: ({ row }: any) => (
          <div className={styles.slotsContainer}>
            {row.values.slots && Object.entries(row.values.slots).map(([key, value]: any) => (
              <div className={styles.slotContainer}>
                <div>{key}</div>
                <div className={styles.status}>{value.status}</div>
              </div>
            ))}
          </div>
        )
      },
      {
        Header: 'tags',
        id: 'tags',
        accessor: 'props.tags',
        Cell: ({ row }: any) => (
          <div className={styles.tagsContainer}>
            {row.values.tags?.join(', ')}
          </div>
        )
      },
      {
        Header: 'disabled',
        accessor: 'disabled',
        Cell: ({ row }: any) => (
          <div>{row.values.disabled ? 'true' : 'false'}</div>
        )
      },
      {
        Header: 'lastSignInTime',
        id: 'lastSignInTime',
        accessor: 'metadata.lastSignInTime',
        Cell: ({ row }: any) => (
          <div>{row.values.lastSignInTime}</div>
        )
      },
      {
        Header: 'creationTime',
        id: 'creationTime',
        accessor: 'metadata.creationTime',
        Cell: ({ row }: any) => (
          <div>{row.values.creationTime}</div>
        )
      },
      {
        Header: 'admin',
        id: 'admin',
        accessor: 'customClaims.admin',
        Cell: ({ row }: any) => (
          <div>{row.values.admin ? 'true' : 'false'}</div>
        )
      },
      {
        Header: 'accessLevel',
        id: 'accessLevel',
        accessor: 'customClaims.accessLevel',
        Cell: ({ row }: any) => (
          <div>{row.values.accessLevel}</div>
        )
      },
      {
        Header: 'tokensValidAfterTime',
        accessor: 'tokensValidAfterTime'
      },
      {
        Header: 'devices',
        id: 'devices',
        accessor: 'props.devices',
        Cell: ({ row }: any) => (
          <div className={styles.devicesContainer}>
            {row.values.devices && Object.entries(row.values.devices).map(([key, value]: any) => (
              <Accordion
                title={value.os}
                values={[
                  {
                    title: 'Id',
                    value: key
                  },
                  {
                    title: 'Bundle',
                    value: value.bundle
                  },
                  {
                    title: 'Last login',
                    value: value.lastlogin_at
                  },
                  {
                    title: 'Login counter',
                    value: value.login_counter
                  },
                  {
                    title: 'Voip token',
                    value: value.voip_token
                  },
                  {
                    title: 'Install counter',
                    value: value.install_counter
                  },
                  {
                    title: 'Name',
                    value: value.name
                  },
                  {
                    title: 'Fcm token',
                    value: value.fcm_token
                  }
                ]}
              />
            ))}
          </div>
        )
      },
      {
        Header: 'disable_instant_calls',
        id: 'disable_instant_calls',
        accessor: 'props.settings.disable_instant_calls',
        Cell: ({ row }: any) => (
          <div>{row.values.disable_instant_calls ? 'true' : 'false'}</div>
        )
      },
      {
        Header: 'allow_new_matches',
        id: 'allow_new_matches',
        accessor: 'props.settings.allow_new_matches',
        Cell: ({ row }: any) => (
          <div>{row.values.allow_new_matches ? 'true' : 'false'}</div>
        )
      }
    ],
    []
  )

  const tableInstance = useTable({ columns, data: users })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInstance

  if (isLoading) {
    return <Preloader />
  }

  return (
    <div className={styles.container}>
      <ReactTooltip />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            const className = row.original.props.withError ? styles.errorRow : styles.default
            prepareRow(row)
            return (
              <tr className={className} {...row.getRowProps()}>
                {row.cells.map((cell) =>
                  (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
