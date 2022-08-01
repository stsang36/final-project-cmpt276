import style from './style.module.css'
import { useGetAllUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from 'redux/slices/userSlice'
import { GoKebabVertical } from 'react-icons/go'
import Dropdown from 'common/components/Dropdown'
import Modal from 'common/components/Modal'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Button from 'common/components/Button'
import { toast } from 'react-toastify'
import { AiTwotoneAlert, AiFillDelete } from 'react-icons/ai'
import { FaUserTag, FaUserEdit } from 'react-icons/fa'

const roleOptions = [
  {
    value: 'transcriber',
    label: 'Transcriber',
  },
  {
    value: 'reviewer',
    label: 'Reviewer',
  },
  {
    value: 'client',
    label: 'Client',
  }
]

const UsersTable = () => {
  const { data } = useGetAllUsersQuery()
  const [ updateRole, updateResults ]= useUpdateUserRoleMutation()
  const [ deleteUser, deleteResults ] = useDeleteUserMutation()
  const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false)
  const [ isUpdateModalOpen, setIsUpdateModalOpen ] = useState(false)
  const [ focusedUser, setFocusedUser ] = useState(null)
  const [ select, setSelect ] = useState('')

  const handleUpdateRole = (event, user) => {
    setFocusedUser(user)
    setIsUpdateModalOpen(true)
  }

  const handleDeleteUser= (event, user) => {
    setFocusedUser(user)
    setIsDeleteModalOpen(true)
  }

  useEffect(() => {
    const { isSuccess, isError, error, reset } = deleteResults
    if(isSuccess){
      toast.success("user has been deleted")
      reset()
      return
    }
    if(isError){
      toast.error(`An error occured: ${error}`)
      reset()
      return
    }
  },[deleteResults])

  useEffect(() => {
    const { isSuccess, isError, error, reset } = updateResults
    if(isSuccess){
      toast.success("user has been updated")
      reset()
      return
    }
    if(isError){
      toast.error(`An error occured: ${error}`)
      reset()
      return
    }
  },[updateResults])

  return (
    <section className={style.section}>
      <AnimatePresence>
        {isDeleteModalOpen && (
          <Modal
            closeModal={()=>{
              setIsDeleteModalOpen(false)
              setFocusedUser(null)
            }}
            className={style.deleteModal}
          >
            <AiTwotoneAlert className={style.icon}/>
            <p className={style.deleteMsg}>Are you sure you want to delete user "{focusedUser.username}"?</p>
            <Button 
              text='Cancel'
              onClick={()=>{
                setIsDeleteModalOpen(false)
                setFocusedUser(null)
              }}
              className={style.cancelBtn}
            />
            <Button 
              text='Delete'
              onClick={()=>{
                deleteUser({id: focusedUser.id})
                setFocusedUser(null)
                setIsDeleteModalOpen(false)
              }}
              className={style.deleteBtn}
            />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isUpdateModalOpen && (
          <Modal
            closeModal={()=>{
              setIsUpdateModalOpen(false)
              setFocusedUser(null)
              setSelect(null)
            }}
            className={style.updateModal}
          >
            <FaUserTag className={style.icon}/>
            <label htmlFor='roles' className={style.selectContainer}>
              Updating "{focusedUser.username}", choose a role
              <select 
                className={style.select}
                id='roles' 
                onChange={(e)=>setSelect(e.target.value)}
                label={select}
                value={select}
              >
                <option value='' hidden>---select--role---</option>
                {roleOptions.filter(item => item.value !== focusedUser.role).map(item => (
                  <option value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <Button 
              text='Cancel'
              onClick={()=>{
                setIsUpdateModalOpen(false)
                setFocusedUser(null)
                setSelect(null)
              }}
              className={style.cancelBtn}
            />
            <Button 
              text='Update'
              disabled={!select}
              onClick={()=>{
                updateRole({id: focusedUser.id, role: select})
                setIsUpdateModalOpen(false)
                setFocusedUser(null)
                setSelect(null)
              }}
              className={style.updateBtn}
            />
          </Modal>
        )}
      </AnimatePresence>
      <table className={style.table}>
        <thead>
          <tr className={style.tableHeader}>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((user, index) => {
            const role = user.role[0].toUpperCase() + user.role.substring(1)
            return(
              <tr 
                className={style.tableRow}
                key={index}
              >
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{role}</td>
                <td className={style.kebab}>
                  <Dropdown>
                    <GoKebabVertical/>
                    <button
                      onClick={(e)=>handleUpdateRole(e, user)}
                      className={style.dropdownBtn}
                    >
                      <FaUserEdit className={style.icon}/>
                      Update Role
                    </button>
                    <button
                      onClick={(e)=>handleDeleteUser(e, user)}
                      className={style.dropdownBtn}
                    >
                      <AiFillDelete className={style.icon}/>
                      Delete
                    </button>
                  </Dropdown>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default UsersTable