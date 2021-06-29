import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Link from '../assets/link.svg';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import api from '../axios';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function Sidebar({setSelectedFolder, user}) {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    getFolders();
  }, [folders])

  const getFolders = async () => {
    // const result = await api.get(`/folders/${user.u_id}`);
    const result = await axios.get(`/folders/${user.u_id}`);
    setFolders(result.data);
  }

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [folderName, setFolderName] = useState("");
  const [folderDescription, setFolderDescription] = useState("");

  const handleClick = () => {
    setFolderName("");
    setFolderDescription("");
    setOpen(!open);
  };

  const handleAdd = () => {
    //Handle Backend Stuff
    if (folderName.trim() !== "" && folderDescription.trim() !== "") {
      api.post(`/`, {name: folderName, description: folderDescription, u_id: user.u_id});
      setFolders([...folders, {name: folderName, description: folderDescription, u_id: user.u_id}]);
    }

    //Clear fields
    setFolderName("");
    setFolderDescription("");
    setOpen(!open);
  };

  const handleDelete = async (id) => {
    let result = window.confirm("Are you sure you want to delete this folder? All associated links will be permanently lost.");
      if (result) {
        await api.delete(`/folders/${id}`);
        getFolders();
        setSelectedFolder(null);
      }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-userCard">
          <Avatar className="sidebar-header-avatar">{user.first_name[0] + user.last_name[0]}</Avatar>
          <div className="sidebar-userCard-text">
            <text className="sidebar-userCard-text-name">{user.first_name + " " + user.last_name}</text>
            <text className="sidebar-userCard-text-userType">User</text>
          </div>
      </div>
      <div className="sidebar-main-container">
        <List
            style={{maxHeight: '100%', overflow: 'auto'}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                Your Folders
                </ListSubheader>
            }
            className={classes.root}
            >
            {folders.map(folder => {
                return (
                    <ListItem key={folder.f_id} button onClick={() => {
                      setSelectedFolder(folder);
                    }}>
                        <ListItemText primary={folder.name} />
                          <CreateIcon style={{marginLeft: "2px"}} />
                          <DeleteIcon style={{marginLeft: "2px"}} onClick={() => handleDelete(folder.f_id)}/>
                    </ListItem>)
            })}
        </List>
        <ListItem onClick={handleClick} className="add-folder-btn" button>
            <AddIcon style={{color: "gray"}} /><ListItemText style={{color: "gray"}} primary="Add Folder" />
        </ListItem>
      </div>
      <div>
      <Dialog onClose={() => null} aria-labelledby="customized-dialog-title" open={open}>
        <div className="dialog">
            <text>New Folder</text>
            <TextField
              id="outlined-multiline-static"
                label="Name"
                rows={1}
                variant="outlined"
                value={folderName}
                onChange={e => setFolderName(e.target.value)}
            />
            <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={10}
                variant="outlined"
                value={folderDescription}
                onChange={e => setFolderDescription(e.target.value)}
            />
            <div className="dialog-buttons">
                <Button onClick={handleAdd}>Add</Button>
                <Button onClick={handleClick}>Cancel</Button>
            </div>
        </div>
      </Dialog>
    </div>
    </div>
  );
}