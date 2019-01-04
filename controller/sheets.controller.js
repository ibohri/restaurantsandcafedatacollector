const { google } = require("googleapis");
const googlesheets = require("../config/googlesheets.config");
const spreadSheetId = '1GiTmp-MldoL-qzCZBVYVORndCeasesSqfzR7p-2B98w';

async function addLocationsData(values) {
    const oauth2Client = googlesheets.getAuthClient();
    const sheets = google.sheets({ version: 'v4', oauth2Client });
    const res = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadSheetId,
        auth: oauth2Client,
        range: "Establishment Data",
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            range: "Establishment Data",
            majorDimension: "ROWS",
            values: values
        }
    });
    return res.data.values;
}

async function addPostCodeCollectionData(values) {
    const oauth2Client = googlesheets.getAuthClient();
    const sheets = google.sheets({ version: 'v4', oauth2Client });
    const res = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadSheetId,
        auth: oauth2Client,
        range: "Post Code Collected",
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            range: "Post Code Collected",
            majorDimension: "ROWS",
            values: values
        }
    });
    return res.data.values;
}

module.exports = {
    addLocationsData,
    addPostCodeCollectionData
};
