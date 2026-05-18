namespace travel_assistant_backend.DTOs.Trip
{
    public class Activity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string Address { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string EstimatedDuration { get; set; }
        public bool IsWeatherDependent { get; set; }
    }
}
