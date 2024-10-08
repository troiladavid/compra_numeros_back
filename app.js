const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const OAuth2 = google.auth.OAuth2;

const app = express();
const port = process.env.PORT || 3000;

// CORS Middleware to allow requests from specific origin
app.use(cors({
    origin: 'https://troiladavid.github.io'  // Allow your GitHub Pages origin
}));

// Middleware to parse JSON data from POST requests
app.use(bodyParser.json());

// Google Sheets setup
const CLIENT_ID = '586285063616-e12779qje758bkv5jca8n8nfa3ar362i.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';  // Usually something like "http://localhost:3000/oauth2callback"
const REFRESH_TOKEN = 'https://oauth2.googleapis.com/token';

const oauth2Client = new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

const SPREADSHEET_ID = '1chZeMpf-pNRqBbUr5aJFJ7WuDnBSrDyMo4FkOMDEBBg';
// Route to handle form submissions
app.post('/submit', async (req, res) => {
    const { selectedNumbers } = req.body;

    if (!selectedNumbers || selectedNumbers.length === 0) {
        return res.status(400).json({ error: 'No numbers selected' });
    }

    try {
        // Append the selected numbers to the Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:A',  // Append to column A in "Sheet1"
            valueInputOption: 'RAW',
            resource: {
                values: selectedNumbers.map(number => [number]),  // Each number in a new row
            },
        });

        res.status(200).json({ message: 'Numbers stored successfully!' });
    } catch (error) {
        console.error('Error appending data to Google Sheets:', error);
        res.status(500).json({ error: 'Failed to store numbers' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
