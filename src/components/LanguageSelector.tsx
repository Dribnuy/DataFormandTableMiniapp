import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  type SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { languages } from '../i18n/config';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 120,
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.6)',
    },
  },
  '& .MuiSelect-icon': {
    color: 'white',
  },
}));

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <StyledFormControl size="small">
      <Select
        value={currentLanguage.code}
        onChange={handleLanguageChange}
        displayEmpty
        renderValue={(value) => {
          const selectedLang = languages.find(lang => lang.code === value);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography component="span" sx={{ fontSize: '1.1rem' }}>
                {selectedLang?.flag}
              </Typography>
              <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {selectedLang?.name}
              </Typography>
            </Box>
          );
        }}
      >
        {languages.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography component="span" sx={{ fontSize: '1.1rem' }}>
                {language.flag}
              </Typography>
              <Typography component="span" sx={{ fontSize: '0.875rem' }}>
                {language.name}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
}