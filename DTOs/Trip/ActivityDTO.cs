namespace TravelAssistant.DTOs.Trip
{
    public class ActivityDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "attraction";
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}