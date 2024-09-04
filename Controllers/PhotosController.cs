using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactStarterKit.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.IO;
using System.Linq;

namespace ReactStarterKit.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotosController : ControllerBase
    {
        private readonly IPhotoManager _photoManager;
        public PhotosController(IPhotoManager photoManager)
        {
            _photoManager = photoManager;
        }

        [HttpGet("album/{id}")]
        [SwaggerOperation(Summary = "Get all photos in album", Description = "Get all photos in album")]
        public ActionResult GetPhotos(int id) // id = albumId
        {
            var photos = _photoManager.GetPhotosByAlbumId(id).Select(o => new { o.PhotoID, o.AlbumID, o.Caption });
            return Ok(photos);
        }

        [HttpGet("caption/{id}")]
        [SwaggerOperation(Summary = "Get album caption by photo id", Description = "Get album caption by photo id")]
        public ActionResult GetAlbumCaption(int id) // id = photoId
        {
            var caption = _photoManager.GetAlbumCaptionByPhotoId(id);

            if (!string.IsNullOrEmpty(caption))
                return Ok(new { caption });

            return NotFound(new { message = "Album caption found." });
        }

        [HttpPost("add")]
        [Authorize]
        [SwaggerOperation(Summary = "Add photo", Description = "Add photo")]
        public IActionResult Add([FromForm] FormData formData)
        {
            try
            {
                using (var ms = new MemoryStream())
                {
                    formData.Image.CopyTo(ms);
                    var fileBytes = ms.ToArray();
                    _photoManager.AddPhoto(formData.AlbumId, formData.Caption, fileBytes);
                }

                return Ok(new { message = "Photo added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while processing your request.", details = ex.InnerException?.Message ?? ex.Message });
            }
        }


        [HttpPut("update/{id}")]
        [Authorize]
        [SwaggerOperation(Summary = "Update photo", Description = "Update photo")]
        public ActionResult Update(int id, [FromBody] string caption)
        {
            _photoManager.UpdatePhoto(caption, id);
            return Ok(new { message = "Photo updated successfully." });
        }

        [HttpDelete("delete/{id}")]
        [Authorize]
        [SwaggerOperation(Summary = "Delete photo", Description = "Delete photo")]
        public IActionResult Delete(int id)
        {
            _photoManager.DeletePhoto(id);
            return Ok(new { message = "Photo deleted successfully." });
        }
    }

    public class FormData
    {
        public int AlbumId { get; set; }
        public string Caption { get; set; }
        public IFormFile Image { get; set; }
    }
}