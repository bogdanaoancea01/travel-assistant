namespace TravelAssistant.DTOs.Trip
{
    public class DestinationDTO
    {
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}