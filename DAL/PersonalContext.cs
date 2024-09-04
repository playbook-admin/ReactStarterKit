using Microsoft.EntityFrameworkCore;
using ReactStarterKit.Models;

namespace ReactStarterKit.DAL
{
    public class PersonalContext : DbContext
    {
        public PersonalContext(DbContextOptions options)
            : base(options)
        {
        }

	    public DbSet<Photo> Photos { get; set; }

	    public DbSet<Album> Albums { get; set; }
	}
}