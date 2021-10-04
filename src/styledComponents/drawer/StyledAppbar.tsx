import AppBar, { AppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import { drawerWidth } from '../../utils/constants';

interface StyledAppbarProps extends AppBarProps {
  open?: boolean;
}

const StyledAppbar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<StyledAppbarProps>(({ theme, open }) => ({
  [theme.breakpoints.up('sm')]: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
}));

export default StyledAppbar;
