using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactStarterKit.Interfaces;
using ReactStarterKit.Models;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Linq;

namespace ReactStarterKit.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DetailsController : ControllerBase
    {
	    private const string RandomPhotoID = "RandomPhotoID";
        private readonly IPhotoManager _photoManager;
        public DetailsController(IPhotoManager photoManager)
        {
            _photoManager = photoManager;
        }

        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Get all photos in random album", Description = "Get all photos in random album")]
        public IActionResult GetPhotos(int id)  //id=albumId
        {
            if (id == 0)
            {
                var photoList = new List<Photo>();
                var randomPhotoID = HttpContext.Session.GetValue<string>(RandomPhotoID);
                if (randomPhotoID != null && int.TryParse(randomPhotoID, out int randomPhotoId))
                {
                    var tmpAlbumId = _photoManager.GetPhoto(randomPhotoId).AlbumID;
                    return Ok(_photoManager.GetPhotosByAlbumId(tmpAlbumId).Select(o => new { o.PhotoID, o.AlbumID, o.Caption }));
                }
                else
                {
                    var tmpPhotoID = _photoManager.GetRandomPhotoId(_photoManager.GetRandomAlbumId());
                    photoList.Add(_photoManager.GetPhoto(tmpPhotoID));
                }
                return Ok(photoList.Select(o => new { o.PhotoID, o.AlbumID, o.Caption }));
            }
            return Ok(_photoManager.GetPhotosByAlbumId(id).Select(o => new { o.PhotoID, o.AlbumID, o.Caption }));
        }

        [HttpGet("random")]
        [SwaggerOperation(Summary = "Get a random photo", Description = "Get a random photo")]
        public IActionResult GetRandomPhotoID()
        {
            var randomPhotoID = HttpContext.Session.GetValue<string>(RandomPhotoID);
            if (randomPhotoID != null && int.TryParse(randomPhotoID, out int idd))
            {
                return Ok(idd);
            }
            else
            {
                return Ok(0);
            }
        }
    }
}