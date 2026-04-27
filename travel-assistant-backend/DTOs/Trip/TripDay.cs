using System.Diagnostics;

namespace travel_assistant_backend.DTOs.Trip
{
    public class TripDay
    {
        public int DayNumber { get; set; }
        public string Theme { get; set; }
        public List<Activity> Activities { get; set; }
    }
}
