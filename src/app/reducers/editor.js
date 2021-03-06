import fetch from 'isomorphic-fetch'
import { explorerGetFileURL } from '../utils/routing'
import { setCurrentFile } from './projectConfig';

// Action types
const LOAD_EDITOR_CONTENT = 'LOAD_EDITOR_CONTENT'
const REQUEST_FILE_CONTENT = 'REQUEST_FILE_CONTENT'
const RECEIVE_FILE_CONTENT = 'RECEIVE_FILE_CONTENT'
const UPDATE_CONTENT = 'UPDATE_CONTENT'

const DEFAULT_CONTENT = "// type your code here..."
const LOADING_CONTENT = "// loading..."

// Reducer
export default function(state, action) {
  if (!state) {
    state = {
      content: DEFAULT_CONTENT,
      isFetching: false
    }
  }
  switch (action.type) {
    case LOAD_EDITOR_CONTENT:
      return { content: action.content }
    case REQUEST_FILE_CONTENT:
      return Object.assign({}, state, {
        isFetching: true,
        content: LOADING_CONTENT
      })
    case RECEIVE_FILE_CONTENT:
      return Object.assign({}, state, {
        isFetching: false,
        content: action.content
      })
    case UPDATE_CONTENT:
      return Object.assign({}, state, {
        content: action.content
      })
    default:
      return state
  }
}

// Action creators
export const loadEditorContent = (content) => {
  return { type: LOAD_EDITOR_CONTENT, content: content }
}

export const requestFileContent = () => {
  return { type: REQUEST_FILE_CONTENT }
}

export const receiveFileContent = (content) => {
  return {
    type: RECEIVE_FILE_CONTENT,
    content: content
  }
}

export const updateFileContent = (content, event) => {
  return {
    type: UPDATE_CONTENT,
    content: content
  }
}

export const fetchFileContent = (appName, path) => {
  return dispatch => {
    dispatch(requestFileContent())
    dispatch(setCurrentFile(path))
    return fetch(explorerGetFileURL(appName, path))
      .then(response => response.text())
      .then(text => dispatch(receiveFileContent(text)))
  }
}