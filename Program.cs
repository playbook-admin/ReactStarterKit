using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ReactStarterKit.DAL;
using ReactStarterKit.Filters;
using ReactStarterKit.Interfaces;
using ReactStarterKit.Models;
using ReactStarterKit.Services;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Generate a new key at startup
string GenerateKey(int length = 32)
{
    var key = new byte[length];
    using (var rng = new RNGCryptoServiceProvider())
    {
        rng.GetBytes(key);
    }

    return Convert.ToBase64String(key);
}

var key = GenerateKey(); // Generate a new key each time the application starts

// Configure JWT authentication with the new key
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Convert.FromBase64String(key))
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("OnAuthenticationFailed: " + context.Exception + context.Exception.InnerException);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("OnTokenValidated: " + context.SecurityToken);
            return Task.CompletedTask;
        },
        OnMessageReceived = context =>
        {
            Console.WriteLine("OnMessageReceived: " + context.Token);
            return Task.CompletedTask;
        }
    };
});

// Add configuration support
var configuration = builder.Configuration;
builder.Logging.ClearProviders(); // Optionally clear default providers
builder.Logging.AddConsole(); // Add console logging
builder.Logging.AddDebug();   // Optionally add debug logging

// If in development, add User Secrets
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}
else
{
    builder.Configuration.AddEnvironmentVariables();
}

builder.Services.AddAuthorization();
builder.Services.AddSingleton<IKeyService>(new KeyService(key));

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(10);
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddControllersWithViews();

var path = Path.Combine(Environment.CurrentDirectory, "App_Data");
var dbPath = Path.Combine(path, "Personal.db");

builder.Services.AddDbContext<PersonalContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

builder.Services.AddScoped<IPhotoManager, PhotoManager>();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ReactStarterKit", Version = "v1" });
    c.DocumentFilter<CustomDocumentFilter>();  // Register the custom document filter

    // Add the JWT bearer token authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
var envIsDevelopment = app.Environment.IsDevelopment();
if (envIsDevelopment)
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseSession();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllerRoute(
    name: "handler",
    pattern: "Handler/{action}/{arg1}/{arg2}",
    defaults: new { controller = "Handler" });

app.MapControllerRoute(
    name: "api",
    pattern: "api/{controller}/{action}/{id?}");

// Fallback route
app.MapFallbackToController("Index", "Home");

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ReactStarterKit V1");
    c.RoutePrefix = "swagger";
});

app.Run();
