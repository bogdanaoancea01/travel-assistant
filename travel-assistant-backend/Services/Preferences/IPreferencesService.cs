using travel_assistant_backend.DTOs.UserPreference;

namespace travel_assistant_backend.Services.Preferences
{
    public interface IPreferencesService
    {
        Task<UserPreferencesDTO?> GetPreferencesAsync(int userId);
        Task<UserPreferencesDTO> UpsertPreferencesAsync(int userId, UserPreferencesDTO dto);
        Task<UserPreferencesDTO?> DeleteFieldAsync(int userId, string fieldName);
        Task DeletePreferencesAsync(int userId);
    }
}
