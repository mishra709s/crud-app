import { useEffect, useState } from 'react'
import './App.css'

interface FormData {
  name: string
  email: string
}

function App() {
  const [users, setUsers] = useState<FormData[]>(() => {
    const savedUsers = localStorage.getItem('users')
    return savedUsers ? JSON.parse(savedUsers) : []
  })

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
  })

  // Edit states
  const [isEditing, setIsEditing] = useState(false)
  const [currentUserIndex, setCurrentUserIndex] = useState<number | null>(null)

  // Search
  const [searchQuery, setSearchQuery] = useState('')

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name && !formData.email) return

    if (isEditing) {
      // create a shallow copy of the users data
      const updatedUsers = [...users]
      // Replace the user at the current index with the updated formData.
      if (currentUserIndex !== null) {
        updatedUsers[currentUserIndex] = formData
      }
      setUsers(updatedUsers)
      // Exit edit mode and clear the tracking index, so the form goes back to “Add” mode.
      setIsEditing(false)
      setCurrentUserIndex(0)
    } else {
      // If not editing, that means it’s a new user being added.
      setUsers([...users, formData])
    }
    setFormData({ name: '', email: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleEdit = (index: number) => {
    setFormData(users[index])
    setCurrentUserIndex(index)
    setIsEditing(true)
  }

  const handleDelete = (index: number) => {
    const updatedUsers = [...users]
    updatedUsers.splice(index, 1)
    setUsers(updatedUsers)
  }

  // Filtered Users
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  //  Store user data in local storage
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  return (
    <section className="container">
      <div>CRUD Application with Search Functionality</div>
      {/* Create a search field with ph - Search by name... */}
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        name="search"
        className=""
        placeholder="Search by name..."
      />
      {/* Create a form having 2 inputs: name and email and a button*/}
      <form action="" onSubmit={handleFormSubmit} className="">
        <input
          type="text"
          name="name"
          id="nameField"
          value={formData.name}
          placeholder="Enter your name"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          id="emailField"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleChange}
        />
        <button className="">{isEditing ? 'Update' : 'Add'}</button>
      </form>
      {/* Render the added user details just below the form */}

      {filteredUsers.length === 0 ? (
        <p>No Users Found</p>
      ) : (
        <div>
          {filteredUsers.map((user, index) => (
            <div key={index} className="userDetailsCard">
              <h4>{user.name}</h4>
              <span>{user.email}</span>
              <div className="buttonContainer">
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default App
