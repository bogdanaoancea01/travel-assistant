using Microsoft.EntityFrameworkCore;

namespace travel_assistant_backend.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<PopularDestination> PopularDestinations { get; set; } = null!;
        public DbSet<Chat> Chats { get; set; } = null!;
        public DbSet<UserMessage> UserMessages { get; set; } = null!;
        public DbSet<AssistantResponse> AssistantResponses { get; set; } = null!;
        public DbSet<UserPreferences> UserPreferences { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
            });

            // User → Chat (one-to-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Chats)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User → UserPreferences (one-to-one)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Preferences)
                .WithOne(p => p.User)
                .HasForeignKey<UserPreferences>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Chat → UserMessages (one-to-many)
            modelBuilder.Entity<Chat>()
                .HasMany(c => c.UserMessages)
                .WithOne(m => m.Chat)
                .HasForeignKey(m => m.ChatId)
                .OnDelete(DeleteBehavior.Cascade);

            // Chat → AssistantResponses (one-to-many)
            modelBuilder.Entity<Chat>()
                .HasMany(c => c.AssistantResponses)
                .WithOne(r => r.Chat)
                .HasForeignKey(r => r.ChatId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
