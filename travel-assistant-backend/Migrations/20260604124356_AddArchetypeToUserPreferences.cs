using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travel_assistant_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddArchetypeToUserPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "archetype_description",
                table: "user_preferences",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "archetype_name",
                table: "user_preferences",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "archetype_description",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "archetype_name",
                table: "user_preferences");
        }
    }
}
