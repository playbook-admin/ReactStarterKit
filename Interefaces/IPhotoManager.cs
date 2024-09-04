using ReactStarterKit.Models;
using ReactStarterKit.ViewModels;
using System.Collections.Generic;
using System.IO;

namespace ReactStarterKit.Interfaces
{
    public interface IPhotoManager
    {
        void AddPhoto(int albumId, string caption, byte[] bytesOriginal);
        void DeletePhoto(int photoId);
        void UpdatePhoto(string caption, int photoId);
        Album GetAlbum(int albumId);
        AlbumViewModel AddAlbum(string caption);
        int DeleteAlbum(int albumId);
        int UpdateAlbum(string caption, int albumId);
        string GetAlbumCaptionByPhotoId(int photoId);
        int GetAlbumIDFromPhotoID(int photoId);
        List<AlbumViewModel> GetAlbumsWithPhotoCount();
        Stream GetFirstPhoto(int albumId, PhotoSize size);
        Photo GetPhoto(int photoId);
        Stream GetPhoto(int photoid, PhotoSize size);
        List<Photo> GetPhotosByAlbumId(int albumId);
        int GetRandomAlbumId();
        int GetRandomPhotoId(int albumId);
    }
}