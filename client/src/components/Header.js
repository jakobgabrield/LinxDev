import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import SettingsIcon from '@material-ui/icons/Settings';
import Search from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
}));

export default function Header({logout, user, logoutUser}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

    return (
        <div className="header">
            <IconButton>
                <Search fontSize="medium" />
            </IconButton>
            <div className="header-icon-container">
                <Badge className="header-icon" badgeContent={1} color="error">
                    <IconButton>
                        <NotificationsIcon/>
                    </IconButton>    
                </Badge>
                <IconButton className="header-icon">
                        <SettingsIcon />
                </IconButton>
                <IconButton onClick={handleClick} className="header-icon">
                    <Avatar>{user.first_name[0] + user.last_name[0]}</Avatar>
                </IconButton>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                    }}
                >
                    <Typography style={{cursor: 'pointer'}} onClick={() => {
                        logout();
                        logoutUser(0);
                        }} className={classes.typography}>Logout</Typography>
                </Popover>
            </div>
        </div>
    )
}
