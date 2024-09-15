const express = require('express');
const { google } = require('googleapis');
const app = express();
app.use(express.json());

const API_KEY = 'AIzaSyCjzUNVtojg9mcK8apWjLDIBj5SGJaSVKU';
const spreadsheetId = '1chZeMpf-pNRqBbUr5aJFJ7WuDnBSrDyMo4FkOMDEBBg';

// Function to store selected numbers in Google Sheet
async function storeInGoogleSheet(numbers) {
    const sheets = google.sheets({ version: 'v4', auth: API_KEY });
    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        resource: {
            values: [numbers]
        },
    });
}

app.post('/submit', async (req, res) => {
    const { selectedNumbers } = req.body;
    try {
        await storeInGoogleSheet(selectedNumbers);
        res.json({ message: 'Numbers stored successfully!' });
    } catch (error) {
        console.error('Error storing numbers:', error);
        res.status(500).json({ message: 'Error storing numbers' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
