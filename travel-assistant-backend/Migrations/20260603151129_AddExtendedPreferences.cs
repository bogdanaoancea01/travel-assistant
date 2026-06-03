using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travel_assistant_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddExtendedPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "budget_range",
                table: "user_preferences",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "travel_companions",
                table: "user_preferences",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "travel_styles",
                table: "user_preferences",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "trip_duration_max",
                table: "user_preferences",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "trip_duration_min",
                table: "user_preferences",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "trip_pace",
                table: "user_preferences",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "budget_range",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "travel_companions",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "travel_styles",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "trip_duration_max",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "trip_duration_min",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "trip_pace",
                table: "user_preferences");
        }
    }
}
