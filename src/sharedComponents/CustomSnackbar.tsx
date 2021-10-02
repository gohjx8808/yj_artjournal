import CloseIcon from '@mui/icons-material/Close';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import React, { forwardRef, useCallback } from 'react';
import SnackbarCard from '../styledComponents/snackbar/SnackbarCard';
import StyledSnackbarContent from '../styledComponents/snackbar/StyledSnackbarContent';

interface CustomSnackbarOwnProps{
  id: string | number
  message:string| React.ReactNode
}

const CustomSnackbar = forwardRef<
  HTMLDivElement,
  { id: string | number, message: string | React.ReactNode }
  >((props:CustomSnackbarOwnProps, ref) => {
    const { message, id } = props;
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
      <StyledSnackbarContent ref={ref}>
        <SnackbarCard>
          <CardActions>
            <Typography variant="subtitle1" color="white">{message}</Typography>
            <IconButton onClick={handleDismiss}>
              <CloseIcon htmlColor="white" />
            </IconButton>
          </CardActions>
        </SnackbarCard>
      </StyledSnackbarContent>
    );
  });

export default CustomSnackbar;
