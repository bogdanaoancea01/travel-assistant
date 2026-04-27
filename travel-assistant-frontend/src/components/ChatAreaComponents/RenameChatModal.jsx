import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  DialogActions, 
  Button 
} from '@mui/material';

export default function RenameChatModal({ open, handleClose, onRename, currentName }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const newName = formJson.chatName;
    if (newName.trim()) {
      onRename(newName);
    }
    handleClose();
  };

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        classes={{
          paper: 'rounded-3xl p-6 shadow-xl'
        }}
    >
      <DialogTitle>Rename Chat</DialogTitle>
      <DialogContent>
        <form id="rename-form" onSubmit={handleSubmit}>
          <TextField
            name="chatName"
            fullWidth
            variant="outlined"
            label={currentName}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: "black",
                },
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputLabel-root": {
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black",
              },
            }}
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "999px",
            px: 3,
            py: 1,
            textTransform: "none",
            "&:hover": { backgroundColor: "#27272a" }
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="rename-form"
          variant="contained"
          sx={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "999px",
            px: 3,
            py: 1,
            textTransform: "none",
            "&:hover": { backgroundColor: "#27272a" }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}