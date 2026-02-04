namespace TravelAssistant.DTOs.Trip
{
    public class DayPlanDTO
    {
        public int Day { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<ActivityDTO> Activities { get; set; } = [];
    }
}