import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import type { Props } from "../types/type";

const SearchBar = ({ placeholder = "Search...", value, onChange }: Props) => {
  return (
    <Box
      sx={{
        border: 1,
        width: "700px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 3,
        marginTop: 2,
        paddingX: 1,
      }}
    >
      <TextField
        placeholder={placeholder}
        variant="outlined"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          flex: 1,
          "& fieldset": { border: "none" },
          "& .MuiOutlinedInput-root": {
            outline: "none",
            height: "50px",
          },
        }}
      />
      <SearchIcon sx={{ color: "gray", ml: 1 }} />
    </Box>
  );
};

export default SearchBar;
