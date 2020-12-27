import axios from 'axios'

let baseURL = `/api/notes`
let token = null

//this function is called from app.js when someone logs in with token returned from backend
const setToken = (newToken) => {
  token = `bearer ${newToken}` 
}


const getAll = () => {
  let request = axios.get(baseURL)
  // let nonExisting = {
  //   id: 10000,
  //   content: 'This note is not saved to server',
  //   date: '2019-05-30T17:30:31.098Z',
  //   important: true,
  // }
  // return request.then(response => response.data.concat(nonExisting))
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers : { Authorization : token } 
  }
  const response = await axios.post(baseURL, newObject, config)
  return response.data;
}

const update = (id, newObject) => {
  let request = axios.put(`${baseURL}/${id}`, newObject)
  return request.then(response => response.data)
}

export default {getAll, create, update, setToken}