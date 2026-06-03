using travel_assistant_backend.DTOs.UserPreference;
using travel_assistant_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace travel_assistant_backend.Services.Preferences
{
    public class PreferencesService : IPreferencesService
    {
        private readonly AppDbContext _context;

        public PreferencesService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserPreferencesDTO?> GetPreferencesAsync(int userId)
        {
            var prefs = await _context.UserPreferences
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (prefs == null) return null;

            return MapToDTO(prefs);
        }

        public async Task<UserPreferencesDTO> UpsertPreferencesAsync(int userId, UserPreferencesDTO dto)
        {
            var prefs = await _context.UserPreferences
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (prefs == null)
            {
                prefs = new UserPreferences { UserId = userId };
                _context.UserPreferences.Add(prefs);
            }

            prefs.Bio = dto.Bio;
            prefs.HomeCity = dto.HomeCity;
            prefs.PreferredCurrency = dto.PreferredCurrency;
            prefs.PreferredAirportName = dto.PreferredAirportName;
            prefs.AccommodationStyle = dto.AccommodationStyle;
            prefs.MealPreference = dto.MealPreference;

            await _context.SaveChangesAsync();

            return MapToDTO(prefs);
        }

        public async Task DeletePreferencesAsync(int userId)
        {
            var prefs = await _context.UserPreferences
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (prefs == null) return;

            _context.UserPreferences.Remove(prefs);
            await _context.SaveChangesAsync();
        }

        public async Task<UserPreferencesDTO?> DeleteFieldAsync(int userId, string fieldName)
        {
            var prefs = await _context.UserPreferences
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (prefs == null) return null;

            switch (fieldName.ToLowerInvariant())
            {
                case "bio": prefs.Bio = null; break;
                case "homecity": prefs.HomeCity = null; break;
                case "preferredcurrency": prefs.PreferredCurrency = null; break;
                case "preferredairportname": prefs.PreferredAirportName = null; break;
                case "accommodationstyle": prefs.AccommodationStyle = null; break;
                case "mealpreference": prefs.MealPreference = null; break;
                default: return null;
            }

            await _context.SaveChangesAsync();
            return MapToDTO(prefs);
        }

        private static UserPreferencesDTO MapToDTO(UserPreferences prefs) => new()
        {
            Bio = prefs.Bio,
            HomeCity = prefs.HomeCity,
            PreferredCurrency = prefs.PreferredCurrency,
            PreferredAirportName = prefs.PreferredAirportName,
            AccommodationStyle = prefs.AccommodationStyle,
            MealPreference = prefs.MealPreference,
        };
    }
}
