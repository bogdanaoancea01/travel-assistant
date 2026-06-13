using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travel_assistant_backend.Migrations
{
    /// <inheritdoc />
    public partial class NewPreferencesQuiz : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "accommodation_style",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "budget_range",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "dietary_needs",
                table: "user_preferences");

            migrationBuilder.RenameColumn(
                name: "meal_preference",
                table: "user_preferences",
                newName: "preferred_setting");

            migrationBuilder.AddColumn<string>(
                name: "planning_style",
                table: "user_preferences",
                type: "character varying(60)",
                maxLength: 60,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "preferred_regions",
                table: "user_preferences",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "travel_frequency",
                table: "user_preferences",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "planning_style",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "preferred_regions",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "travel_frequency",
                table: "user_preferences");

            migrationBuilder.RenameColumn(
                name: "preferred_setting",
                table: "user_preferences",
                newName: "meal_preference");

            migrationBuilder.AddColumn<string>(
                name: "accommodation_style",
                table: "user_preferences",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "budget_range",
                table: "user_preferences",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dietary_needs",
                table: "user_preferences",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);
        }
    }
}
