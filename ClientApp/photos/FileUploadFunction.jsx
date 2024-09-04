import React, { useState, useReducer } from "react";
import * as apiClient from "../helpers/ApiHelpers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useGlobalState, useGlobalDispatch, useSessionUser } from '../GlobalStateContext';
import './DragAndDrop.css';

// Action types for the reducer
const actionTypes = {
  SET_DROP_DEPTH: 'SET_DROP_DEPTH',
  SET_IN_DROP_ZONE: 'SET_IN_DROP_ZONE',
  ADD_FILE_TO_LIST: 'ADD_FILE_TO_LIST'
};

// Initial state for the reducer
const initialState = {
  dropDepth: 0,
  inDropZone: false,
  fileList: []
};

// Reducer function to manage the drag-and-drop state
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_DROP_DEPTH:
      return { ...state, dropDepth: action.dropDepth };
    case actionTypes.SET_IN_DROP_ZONE:
      return { ...state, inDropZone: action.inDropZone };
    case actionTypes.ADD_FILE_TO_LIST:
      return { ...state, fileList: [...state.fileList, ...action.files] };
    default:
      return state;
  }
};

const FileUploadFunction = ({ albumId, caption, onPhotoAdded }) => {
  const [image, setImage] = useState({ preview: "", raw: null });
  const globalState = useGlobalState();
  const globalDispatch = useGlobalDispatch();
  const { token } = useSessionUser();
  const [dropState, dispatch] = useReducer(reducer, initialState);

  // Handles file input change
  const updateImage = (files) => {
    if (files.length > 0) {
      setImage({
        preview: URL.createObjectURL(files[0]),
        raw: files[0]
      });
    }
  };

  // Handles file input change event
  const handleChange = (e) => {
    updateImage(e.target.files);
  };

  // Handles file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    globalDispatch({ type: 'SET_LOADING', payload: true });
    const formData = new FormData();
    formData.append("Image", image.raw);
    formData.append("AlbumId", albumId);
    formData.append("Caption", caption);

    try {
      const response = await apiClient.postImageHelper('api/photos/add/', formData, token);
      onPhotoAdded(response);
      setImage({ preview: "", raw: null });
    } catch (error) {
      alert('Error connecting to server: ' + error.message);
    } finally {
      globalDispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Handles file upload cancel
  const handleCancel = (e) => {
    e.preventDefault();
    setImage({ preview: "", raw: null });
  };

  // Drag-and-drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: actionTypes.SET_DROP_DEPTH, dropDepth: dropState.dropDepth + 1 });
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: actionTypes.SET_DROP_DEPTH, dropDepth: dropState.dropDepth - 1 });
    if (dropState.dropDepth === 0) {
      dispatch({ type: actionTypes.SET_IN_DROP_ZONE, inDropZone: false });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    dispatch({ type: actionTypes.SET_IN_DROP_ZONE, inDropZone: true });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      updateImage(files);
      const existingFileNames = new Set(dropState.fileList.map(f => f.name));
      const newFiles = files.filter(file => !existingFileNames.has(file.name));
      dispatch({ type: actionTypes.ADD_FILE_TO_LIST, files: newFiles });
      dispatch({ type: actionTypes.SET_DROP_DEPTH, dropDepth: 0 });
      dispatch({ type: actionTypes.SET_IN_DROP_ZONE, inDropZone: false });
    }
  };

  return (
    <div>
      <label htmlFor="upload-button">
        {image.preview ? (
          <img src={image.preview} alt="preview" />
        ) : (
          <div
            className={dropState.inDropZone ? 'drag-drop-zone inside-drag-area' : 'drag-drop-zone'}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <strong className="text-center">Drag the file here...</strong>
            <br />
            <strong className="text-center">or use file picker!</strong>
          </div>
        )}
      </label>
      <input
        type="file"
        id="upload-button"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      {image.preview && (
        <div>
          <br />
          <button onClick={handleCancel}>
            <FontAwesomeIcon icon={faTimes} size='2x' />
          </button>
          {caption && (
            <>
              <button onClick={handleUpload}>
                <FontAwesomeIcon icon={faSave} size='2x' />
              </button>
              <FontAwesomeIcon
                icon={faSpinner}
                size='2x'
                spin
                style={{ opacity: globalState.loading ? 1 : 0 }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadFunction;
