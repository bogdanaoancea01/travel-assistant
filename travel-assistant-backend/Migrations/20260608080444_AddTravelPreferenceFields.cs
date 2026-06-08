using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travel_assistant_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTravelPreferenceFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "climate_preference",
                table: "user_preferences",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dietary_needs",
                table: "user_preferences",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "transport",
                table: "user_preferences",
                type: "character varying(60)",
                maxLength: 60,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "trip_motivation",
                table: "user_preferences",
                type: "character varying(60)",
                maxLength: 60,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "climate_preference",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "dietary_needs",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "transport",
                table: "user_preferences");

            migrationBuilder.DropColumn(
                name: "trip_motivation",
                table: "user_preferences");
        }
    }
}
