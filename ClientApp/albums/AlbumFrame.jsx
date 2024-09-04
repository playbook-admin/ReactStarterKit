import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Animate } from "react-simple-animate";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import TextAreaInput from '../common/TextAreaInput';
import { useSessionUser } from '../GlobalStateContext';

const AlbumFrame = ({ AlbumID, Caption, PhotoCount, ItemCount, handleDelete, handleUpdate, handleAdd }) => {
  const [caption, setCaption] = useState(Caption);
  const { isAuthorized } = useSessionUser();

  const isAddNewAlbum = AlbumID === 0;
  const isUpdateOldAlbum = isAuthorized && !isAddNewAlbum;
  const isDisabledForAddAndUpdate = caption.trim() === '' ;
  const isDisabledForDelete = PhotoCount > 0;

  return (
    <td className="item">
      {isUpdateOldAlbum ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black' }}>
          <FontAwesomeIcon
            icon={faSave}
            onClick={() => !isDisabledForAddAndUpdate && handleUpdate(AlbumID, caption)}
            style={{
              fontSize: '2em',
              margin: '0 50px 0 100px',
              cursor: isDisabledForAddAndUpdate ? 'not-allowed' : 'pointer',
              opacity: isDisabledForAddAndUpdate ? 0.5 : 1 // Visual indication of being disabled
            }}
          />
          <FontAwesomeIcon
            icon={faTrash}
            onClick={() => !isDisabledForDelete && handleDelete(AlbumID)}
            style={{
              fontSize: '2em',
              margin: '0 150px 0 30px',
              cursor: isDisabledForDelete ? 'not-allowed' : 'pointer',
              opacity: isDisabledForDelete ? 0.5 : 1 // Visual indication of being disabled
            }}
          />
        </div>
      ) : null}
      {isAddNewAlbum ? (
        <div style={{ alignItems: 'center', color: 'black' }}>
          <FontAwesomeIcon
            icon={faSave}
            onClick={() => !isDisabledForAddAndUpdate && handleAdd(caption)}
            style={{
              fontSize: '2em',
              margin: '0 50px 0 100px',
              cursor: isDisabledForAddAndUpdate ? 'not-allowed' : 'pointer',
              opacity: isDisabledForAddAndUpdate ? 0.5 : 1 // Visual indication of being disabled
            }}
          />
        </div>
      ) : null}
      <table cellPadding="0" cellSpacing="0" className="album-frame">
        <tbody>
          <tr>
            <td className="topx----">
              <img alt="" src="/images/album-l1.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="top-x---">
              <img alt="" src="/images/album-mtl.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="top--x--" />
            <td className="top---x-">
              <img alt="" src="/images/album-mtr.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="top----x">
              <img alt="" src="/images/album-r1.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
          </tr>
          <tr>
            <td className="mtpx----">
              <img alt="" src="/images/album-l2.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td colSpan="3" rowSpan="3">
              <Animate delaySeconds={ItemCount / 4} play={{ start: { opacity: 0 }, end: { opacity: 1 }, durationSeconds: 1 }}>
                {isAddNewAlbum ? (
                  <img src="/images/default-image-small.png" className="photo_198" style={{ border: '4px solid white', maxHeight: '100%', maxWidth: '100%' }} alt={`Sample Photo from Album`} />
                ) : (
                  <Link to={`/photos/${AlbumID}/${caption}`}>
                    <img src={`/Handler/Index/AlbumID=${AlbumID}/Size=M`} className="photo_198" style={{ border: '4px solid white', maxHeight: '100%', maxWidth: '100%' }} alt={`Sample Photo from Album Number ${AlbumID}`} />
                  </Link>
                )}
              </Animate>
            </td>
            <td className="mtp----x">
              <img alt="" src="/images/album-r2.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
          </tr>
          <tr>
            <td className="midx----" />
            <td className="mid----x" />
          </tr>
          <tr>
            <td className="mbtx----">
              <img alt="" src="/images/album-l3.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="mbt----x">
              <img alt="" src="/images/album-r3.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
          </tr>
          <tr>
            <td className="botx----">
              <img alt="" src="/images/album-l4.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="bot-x---" style={{ textAlign: 'left' }}>
              <img alt="" src="/images/album-mbl.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="bot--x--" />
            <td className="bot---x-" style={{ textAlign: 'right' }}>
              <img alt="" src="/images/album-mbr.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />&nbsp;&nbsp;
            </td>
            <td className="bot----x">
              <img alt="" src="/images/album-r4.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
          </tr>
        </tbody>
      </table>
      {isUpdateOldAlbum ? (
        <h4>
          <div style={{ color: 'rgb(152, 0, 0)' }}><TextAreaInput text={caption} placeholder="Enter caption" onTextChanged={(value) => setCaption(value)} /></div>
        </h4>
      ) : (
        <h4>
          <Link to={`/photos/${AlbumID}/${Caption}`}>{Caption}</Link>
        </h4>
      )}
      {isAddNewAlbum ? (
        <h4>
          <div style={{ color: 'rgb(152, 0, 0)' }}><TextAreaInput text={caption} placeholder="Enter caption" onTextChanged={(value) => setCaption(value)} /></div>
        </h4>
      ) : null}
      <div>{PhotoCount} images</div>
    </td>
  );
}

AlbumFrame.propTypes = {
  AlbumID: PropTypes.number.isRequired,
  Caption: PropTypes.string.isRequired,
  PhotoCount: PropTypes.number.isRequired,
  ItemCount: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
};

export default AlbumFrame;
