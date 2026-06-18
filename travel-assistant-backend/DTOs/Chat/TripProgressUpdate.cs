namespace travel_assistant_backend.DTOs.Chat
{
    /// <summary>
    /// A single "thinking" update streamed to the client while a trip is being
    /// generated. The values map to real stages of the loop, so the UI
    /// reflects actual backend work
    /// </summary>
    public class TripProgressUpdate
    {
        //"validating" | "weather" | "geocoding" |
        public string Stage { get; set; } = "";

        // Human-friendly text shown to the user
        public string Label { get; set; } = "";

    }
}