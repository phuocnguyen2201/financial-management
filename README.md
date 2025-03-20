# Financial Management

## Overview

Financial Management is a Bill Scanner & Expense Tracker that offers monitoring your spending by scanning receipts and automatically categorizing expenses. 

## Installation

Clone the repository:

    git clone https://github.com/phuocnguyen2201/financial-management

Install the npm:

    npm install

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
