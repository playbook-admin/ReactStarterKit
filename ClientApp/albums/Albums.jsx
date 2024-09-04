import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import AlbumFrame from './AlbumFrame';
import * as apiClient from "../helpers/ApiHelpers";
import { useLoading, useSessionUser } from '../GlobalStateContext';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const history = useHistory();
  const { isAuthorized, token } = useSessionUser();
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    history.push('/albums');
  }, []);

  useEffect(() => {
    getAlbumsWithPhotoCount('api/albums');
  }, [isAuthorized]);

  const noEmptyAlbumsExists = (albums) => {
    return albums.every(album => album.photoCount > 0);
  };

  const getAlbumsWithPhotoCount = async (url) => {
    setLoading(true);
    try {
      const response = await apiClient.getHelper(url, token);
      setAlbums([...response]);

      // Check if no empty albums exist after setting the state
      if (isAuthorized && noEmptyAlbumsExists(response)) {
        const album = { albumID: 0, photoCount: 0, caption: '', isPublic: true };
        setAlbums(prevAlbums => [...prevAlbums, album]);
      }
    } catch (error) {
        alert('Could not contact server ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (albumId) => {
    setLoading(true);
    await apiClient.deleteHelper(`/api/albums/delete/${albumId}`, token);
    const updatedAlbums = albums.filter(album => album.albumID !== albumId)
    setAlbums(updatedAlbums);
    if (isAuthorized && noEmptyAlbumsExists(updatedAlbums)) {
      const album = { albumID: 0, photoCount: 0, caption: '', isPublic: true };
      setAlbums(prevAlbums => [...prevAlbums, album]);
    }
    setLoading(false);
  };

  const handleUpdate = async (albumId, newCaption) => {
    setLoading(true);
    await apiClient.putHelper(`/api/albums/Update/${albumId}`, newCaption, token);
    setAlbums(albums.map(album => album.albumID === albumId ? { ...album, caption: newCaption } : album));
    setLoading(false);
  };

  const handleAdd = async (caption) => {
    setLoading(true);
    const newAlbum = await apiClient.postHelper(`/api/albums/add`, caption, token);
    setAlbums([...albums.filter(album => album.albumID !== 0), newAlbum]);
    setLoading(false);
  };

  const rows = [];
  for (let i = 0; i < albums.length; i += 2) {
    rows.push(
      <tr key={albums[i].albumID}>
        <AlbumFrame
          AlbumID={albums[i].albumID}
          PhotoCount={albums[i].photoCount}
          Caption={albums[i].caption}
          IsPublic={albums[i].isPublic}
          ItemCount={i}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          handleAdd={handleAdd}
        />
        {albums[i + 1] && (
          <AlbumFrame
            AlbumID={albums[i + 1].albumID}
            PhotoCount={albums[i + 1].photoCount}
            Caption={albums[i + 1].caption}
            IsPublic={albums[i + 1].isPublic}
            ItemCount={i + 1}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            handleAdd={handleAdd}
          />
        )}
      </tr>
    );
  }

  return (
    <div className="container">
      <Row>
        <Col className="row-height">
          <Col md={3} className="hidden-md hidden-sm hidden-xs col-md-height col-md-top custom-vertical-left-border custom-vertical-right-border grey-background">
            <Row>
              <Col md={12}>
                <h4>Photo album</h4>
              </Col>
            </Row>
          </Col>
          <Col md={9} className="col-md-height">
            <Row>
              <FontAwesomeIcon
                icon={faSpinner}
                size="2x"
                spin
                style={{ opacity: loading ? '1' : '0' }}
              />
              <table className="album-frame" style={{ fontSize: '10px', fontFamily: 'verdana, arial, helvetica, sans-serif' }}>
                <tbody>
                  {rows}
                </tbody>
              </table>
            </Row>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Albums;
