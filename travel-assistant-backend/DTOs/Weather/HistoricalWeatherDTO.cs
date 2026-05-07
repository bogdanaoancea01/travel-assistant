using System.Transactions;

namespace travel_assistant_backend.DTOs.Weather
{
    public class HistoricalWeatherDTO
    {
        public double HighTempCelsius { get; set; }
        public double AverageTempCelsius { get; set; }
        public double LowTempCelsius { get; set; }
        public double TypicalRainChance { get; set; }
        public bool IsHistorical { get; } = true;

        public HistoricalWeatherDTO (double highTempCelsius, double averageTempCelsius, double lowTempCelsius, double typicalRainChance)
        {
            HighTempCelsius = highTempCelsius;
            AverageTempCelsius = averageTempCelsius;
            LowTempCelsius = lowTempCelsius;
            TypicalRainChance = typicalRainChance;
        }
    }
}
