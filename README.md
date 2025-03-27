# Financial Management

## Overview

Financial Management is a Bill Scanner & Expense Tracker that offers monitoring your spending by scanning receipts and automatically categorizing expenses. 

## Technologies

### Front-end:
     React Native.
### ORC Integration: 
    ORC API from Klippa.
### Storage: 
    Firebase, AsyncStorage.
### Analytics: 
    React Native Chart Kit, React Native Reanimated Table

## Installation

Clone the repository:

    git clone https://github.com/phuocnguyen2201/financial-management

Install the npm:

    npm install

The app using ORC powered by Klippa:

    https://dochorizon.klippa.com/public/signup

The app using 2 models, you should active both of them:

    Document Capturing - Financial Model for extract all the information in the receipt.
    Document Capturing - Prompt Builder for categorize the items in the receipt.

Create slug for each of model:

    Financial Model - invoice.
    
    Prompt Builder - invoice-category.

For example:
![Financial model's slug](/assets/financial-model-slug.PNG)

Create API for every services by following the path Project setting > Credentials. Choose the Documont Capturing Financial and Prompt Builder.

Create firebase realtime database.

Create .env file and add.

    EXPO_PUBLIC_OCR_API_URL=https://dochorizon.klippa.com/api/services/document_capturing/v1
    EXPO_PUBLIC_OCR_API_KEY=[Your OCR api key here]

    EXPO_PUBLIC_DATABSE_URL=[Your firebase url here]
    EXPO_PUBLIC_DATABASE_API_KEY=[Your firebase key here]


Start the server:

    npx expo start


## Folder structure
```
project-root/
├── assets/                         # Contains all images.
│   └── 
├── src/                            # Contains all source code
│   ├── screens
│   |   ├── Extract.js              # Extract screen contains new extracted data 
│   │   ├── Report.js               # Report screen contains analytics data.
│   │   └── Scan.js                 # Scan screen contains the main function for scanning bills, receipts.
│   ├── services                    # Contains all services.
│   │   ├── connection.js           # Connection to the ocr services.
│   │   ├── firebase_config.js      # Configuration for firebase.
│   │   └── utility.js              # All the support functions.
│   ├── styles
│   │   └──Global-Style.js          # For styling.
├── App.js                          # Navigation screen.
├── README.md                       # Documentation for the project
```
