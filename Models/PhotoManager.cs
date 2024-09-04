using ReactStarterKit.DAL;
using ReactStarterKit.Interfaces;
using ReactStarterKit.ViewModels;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;

namespace ReactStarterKit.Models
{
    public class PhotoManager : IPhotoManager
    {
        public static int Random100000(int seed = 100000)
        {
            return GlobalRandom.Next(seed);
        }

        private static readonly Random GlobalRandom = new Random();
        private static int RandomAlbumID = 0;
        private readonly PersonalContext _context;

        public PhotoManager(PersonalContext context)
        {
            _context = context;
        }

        public Stream GetPhoto(int photoid, PhotoSize size)
        {
            Photo photo;
            if (photoid == 0)
            {
                photo = GetDefaultPhotoAllSizes();
            }
            else
            {
                photo = _context.Photos.Single(o => o.PhotoID == photoid);
            }

            byte[] result = null;
            switch (size)
            {
                case PhotoSize.Large:
                    result = photo.BytesFull;
                    break;
                case PhotoSize.Medium:
                    result = photo.BytesPoster;
                    break;
                case PhotoSize.Original:
                    result = photo.BytesOriginal;
                    break;
                case PhotoSize.Small:
                    result = photo.BytesThumb;
                    break;
            }
            try
            {
                return new MemoryStream(result);
            }
            catch
            {
                return null;
            }
        }

        public void DeletePhoto(int photoId)
        {
            var photo = _context.Photos.Single(p => p.PhotoID == photoId);
            _context.Photos.Remove(photo);
            _context.SaveChanges();
        }

        public void UpdatePhoto(string caption, int photoId)
        {
            var photo = _context.Photos.Single(p => p.PhotoID == photoId);
            photo.Caption = caption;
            _context.Photos.Update(photo);
            _context.SaveChanges();
        }

        public Stream GetFirstPhoto(int albumId, PhotoSize size)
        {
            byte[] result = null;
            var photos = GetPhotosByAlbumId(albumId);

            // Check if the album has photos
            if (photos == null || photos.Count == 0)
            {
                return GetDefaultPhotoStream(PhotoSize.Small);
            }

            // Get the appropriate photo based on the requested size
            switch (size)
            {
                case PhotoSize.Large:
                    result = photos[0].BytesFull;
                    break;
                case PhotoSize.Medium:
                    result = photos[0].BytesPoster;
                    break;
                case PhotoSize.Original:
                    result = photos[0].BytesOriginal;
                    break;
                case PhotoSize.Small:
                    result = photos[0].BytesThumb;
                    break;
                default:
                    // Handle unexpected size values if necessary
                    return null;
            }

            if (result == null)
            {
                return null;
            }

            return new MemoryStream(result);
        }


        private Photo GetDefaultPhotoAllSizes()
        {
            var photo = new Photo
            {
                AlbumID = 0,
                Caption = "",
                PhotoID = 0,
                BytesFull = File.ReadAllBytes("wwwroot/images/default-image-large.png"),
                BytesOriginal = File.ReadAllBytes("wwwroot/images/default-image-medium.png"),
                BytesPoster = File.ReadAllBytes("wwwroot/images/default-image.png"),
                BytesThumb = File.ReadAllBytes("wwwroot/images/default-image-small.png")
            };

            return photo;
        }

        private byte[] GetDefaultPhoto(PhotoSize size)
        {
            // Path to the default image, adjust this to your actual default image path
            string defaultImagePath = size switch
            {
                PhotoSize.Large => "wwwroot/images/default-image-large.png",
                PhotoSize.Medium => "wwwroot/images/default-image-medium.png",
                PhotoSize.Original => "wwwroot/images/default-image.png",
                PhotoSize.Small => "wwwroot/images/default-image-small.png",
                _ => "wwwroot/images/default-image-small.png" // Fallback to a generic default image
            };

            // Load the default image as a byte array
            byte[] defaultImageBytes = File.ReadAllBytes(defaultImagePath);

            // Return the image as a stream
            return defaultImageBytes;
        }


        private Stream GetDefaultPhotoStream(PhotoSize size)
        {
            return new MemoryStream(GetDefaultPhoto(size));
        }


        public Photo GetPhoto(int photoId)
        {
            if (photoId == 0) return GetDefaultPhotoAllSizes();
            return _context.Photos.Single(o => o.PhotoID == photoId);
        }

        public void AddPhoto(int albumId, string caption, byte[] bytesOriginal)
        {
            var photo = new Photo
            {
                AlbumID = albumId,
                Caption = caption,
                BytesOriginal = bytesOriginal,
                BytesFull = ResizeImageFile(bytesOriginal, 600),
                BytesPoster = ResizeImageFile(bytesOriginal, 198),
                BytesThumb = ResizeImageFile(bytesOriginal, 100),
                PhotoID = 0
            };

            _context.Photos.Add(photo);
            _context.SaveChanges();
        }

        public Album GetAlbum(int albumId)
        {
            return _context.Albums.Single(o => o.AlbumID == albumId);
        }

        public int DeleteAlbum(int albumId)
        {
            var album = _context.Albums.Single(o => o.AlbumID == albumId);
            _context.Albums.Remove(album);
            return _context.SaveChanges();
        }

        public AlbumViewModel AddAlbum(string caption)
        {
            var album = new Album()
            {
                Caption = caption,
                IsPublic = true,
            };

            _context.Albums.Add(album);
            _context.SaveChanges();
            return GetAlbumsWithPhotoCount().Single(a => a.AlbumID == album.AlbumID);
        }

        public int UpdateAlbum(string caption, int albumId)
        {
            var album = _context.Albums.Single(o => o.AlbumID == albumId);
            album.Caption = caption;
            _context.Albums.Update(album);
            return _context.SaveChanges();
        }

        public List<Photo> GetPhotosByAlbumId(int albumId)
        {
            return _context.Photos.Where(o => o.AlbumID == albumId).ToList();
        }

        public List<AlbumViewModel> GetAlbumsWithPhotoCount()
        {
            var albums = _context.Albums
                .Select(album => new AlbumViewModel
                {
                    AlbumID = album.AlbumID,
                    Caption = album.Caption,
                    IsPublic = album.IsPublic,
                    PhotoCount = _context.Photos.Where(photo => photo.AlbumID == album.AlbumID).Count(),
                })
                .ToList();

            return albums;
        }

        public string GetAlbumCaptionByPhotoId(int photoId)
        {
            if (photoId == 0) return "";
            int albumId = GetPhoto(photoId).AlbumID;
            return GetAlbum(albumId).Caption;
        }

        public int GetAlbumIDFromPhotoID(int photoId)
        {
            return GetPhoto(photoId).AlbumID;
        }

        public int GetRandomAlbumId()
        {
            var albumsList = GetAlbumsWithPhotoCount().Where(a => a.PhotoCount > 0).ToList();
            if (albumsList.Count == 0) return 0;
            RandomAlbumID = albumsList[Random100000(albumsList.Count)].AlbumID;
            return RandomAlbumID;
        }

        public int GetRandomPhotoId(int albumId)
        {
            var photoList = GetPhotosByAlbumId(albumId);
            if (photoList.Count == 0) return 0;
            return photoList[Random100000(photoList.Count)].PhotoID;
        }

        private static byte[] ResizeImageFile(byte[] imageFile, int targetSize)
        {
            using (var image = Image.Load(imageFile))
            {
                var newSize = CalculateDimensions(image.Size, targetSize);
                image.Mutate(x => x
                    .Resize(newSize.Width, newSize.Height));

                using var m = new MemoryStream();
                image.Save(m, new JpegEncoder()); // Use the JpegEncoder here
                return m.ToArray();
            }
        }


        private static Size CalculateDimensions(Size originalSize, int targetSize)
        {
            // Adjust this method to properly calculate new dimensions
            var aspectRatio = (double)originalSize.Width / originalSize.Height;
            if (aspectRatio > 1)
            {
                return new Size(targetSize, (int)(targetSize / aspectRatio));
            }
            else
            {
                return new Size((int)(targetSize * aspectRatio), targetSize);
            }
        }
    }
}