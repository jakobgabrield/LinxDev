import {useState, useEffect} from 'react';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import api from '../axios';
import axios from 'axios';

const Content = ({selectedFolder}) => {

    const [links, setLinks] = useState([]);

    const getLinks = async () => {
        const result = await axios.get(`/links/${selectedFolder.f_id}`);
        setLinks(result.data);
    }

    useEffect(() => {
      if (selectedFolder) {
        getLinks();
      }
    }, [links, selectedFolder])

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");

    const handleClick = () => {
        setName("");
        setUrl("");
        setDescription("");
        setOpen(!open);
      };
    
      const handleAdd = () => {
        //Handle Backed Stuff
        if (name.trim() !== "" && url.trim() !== "" && description !== "") {
          //Add link to database under current folder
            api.post(`/folders/${selectedFolder.f_id}`, {name, url, description});
            setLinks([...links, {name, url, description}]);
        } else {
            alert("Name, URL, and description are required fields.")
        }

        //Clear fields
        setName("");
        setUrl("");
        setDescription("");
        setOpen(!open);
      };

    return <div className="master-content">
        <text className="selected-folder-name">{selectedFolder && selectedFolder.name}</text>
        <div className="content">
            {links.map(link => {
                return (
                    <div key={link.l_id} className="link" onClick={() => {
                        window.open(link.url, '_blank')
                    }}>
                        <img src={`//image.thum.io/get/width/300/crop/600/${link.url}`}/>
                    </div>
                );
            })}
            {selectedFolder && <div className="add-link-btn" onClick={() => {
                setOpen(true);
            }}>
                <AddIcon />
            </div>}
        </div>
        <Dialog onClose={() => null} aria-labelledby="customized-dialog-title" open={open}>
        <div className="dialog">
            <text>New Link</text>
            <TextField
              id="outlined-multiline-static"
                label="Name"
                rows={1}
                variant="outlined"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <TextField
                id="outlined-multiline-static"
                label="URL"
                multiline
                rows={1}
                variant="outlined"
                value={url}
                onChange={e => setUrl(e.target.value)}
            />
            <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={10}
                variant="outlined"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <div className="dialog-buttons">
                <Button onClick={() => handleAdd()}>Add</Button>
                <Button onClick={() => handleClick()}>Cancel</Button>
            </div>
        </div>
      </Dialog>
    </div>
}

export default Content;