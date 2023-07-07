'use client'

import {Box, Button, List, ListItem, TextField, Typography} from '@mui/material';

// Dummy messages
const messages = [
    {id: 1, text: 'Hello!', sender: 'user1'},
    {id: 2, text: 'Hi!', sender: 'user2'},
    // Add more messages as needed
];

const Chat = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '50vh',
                p: 2,
                border: '1px solid grey',
                borderRadius: 2
            }}
        >
            <Box sx={{mb: 2}}>
                <Typography variant="h5">
                    Chat Header
                </Typography>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    mb: 2,
                    bgcolor: 'background.default',
                    p: 2,
                    border: '1px solid grey',
                    borderRadius: 2
                }}
            >
                <List>
                    {messages.map(message => (
                        <ListItem key={message.id}>
                            <Typography variant="body1">
                                <strong>{message.sender}:</strong> {message.text}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box
                component="form"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid grey',
                    borderRadius: 2,
                    p: 2,
                    bgcolor: 'background.default'
                }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Type a message..."
                    fullWidth
                    sx={{mr: 2}}
                />
                <Button variant="contained" color="primary">
                    Send
                </Button>
            </Box>
        </Box>
    );
}

export {Chat};