const users = [] // empty array of users

const addUser = ({ id, name, room }) => {
    // remove white spaces from the name and make it all lower case
    name = name.trim().toLowerCase() 
    room = room.trim().toLowerCase()

    // if we alreay have a user in the room with the same username
    const existingUser = users.find((user) => user.room === room && user.name === name)

    if(existingUser)
        return { error: `Username ${name} is taken.` }

    const user = { id, name, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1)
        return users.splice(index, 1)[0]
}

const getUser = (id) => users.find((user) => user.id === id)

const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports = { addUser, removeUser, getUser, getUsersInRoom }