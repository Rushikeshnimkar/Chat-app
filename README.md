# ChatApp

ChatApp is chatting application built with React.js, offering a seamless messaging experience. It features a contact list on the left and a dynamic chat window on the right. Leveraging InstantDB for real-time message storage and retrieval, ChatApp ensures instant communication. Additionally, it utilizes IndexedDB for local data storage, providing offline capabilities. Enhanced performance is achieved through Gemini Nano integration.

## Features

- **Real-Time Messaging**: Instant message sending and receiving using InstantDB.
- **Contact Management**: Easy navigation with a contact list sidebar.
- **Chat History**: Access and view chat history by selecting a contact.
- **Translation Service**: Translate messages between different languages seamlessly.

## Technologies Used

- **Frontend**:
  - [React.js](https://reactjs.org/)
  - [InstantDB](https://www.instantdb.com/) for real-time data handling
  - [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via `idb` library for offline storage
  - [Gemini Nano](https://www.geminitech.com/nano) for performance optimization
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [React Router](https://reactrouter.com/) for navigation


## Installation

### Prerequisites

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **npm** or **Yarn**: Comes with Node.js

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/chatapp.git
   cd chatapp
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add:

   ```env
   VITE_INSTANT_APP_ID=your_instantdb_app_id
   ```

   *Replace `your_instantdb_app_id` with your actual InstantDB App ID.*

4. **Start the Development Server**

   Using npm:

   ```bash
   npm run dev
   ```

   Or using Yarn:

   ```bash
   yarn dev
   ```

   The application will be available at ` http://localhost:5173`.

## Usage

1. **Sign Up**
   - Navigate to the signup page
   - Enter your email to receive a magic code
   - Verify your email by entering the received magic code
   - Upon successful verification, you'll be redirected to the chat page

2. **Update Profile**
   - Click on the profile icon in the top right corner
   - Navigate to the profile settings page
   - Update your username and phone number
   - Save changes to update your profile information

3. **Add Contact**
   - Click the "+" button in the contacts section
   - Enter the email address of the contact you want to add
   - Click "Add Contact" to save the new contact
   - The contact will appear in your contacts list once added

4. **Chatting**
   - Select a contact from your contacts list
   - View the chat history with the selected contact
   - Type your message in the input field at the bottom
   - Use the translation feature to translate messages if needed

## Enabling Translation Feature on Chrome

Before using the translation feature in ChatApp, you need to enable it in Chrome:

1. **Prerequisites**:
   - Use Chrome version 131.0.6778.2 or above (Chrome Canary or Dev channel recommended)
   - Supported on Windows, Mac, and Linux desktop platforms

2. **Enable the Translation API**:
   - Navigate to `chrome://flags/#translation-api`
   - Select "Enabled"
   - For multiple language pairs, select "Enabled without language pack limit"
   - Relaunch Chrome

3. **Install Language Components**:
   - Visit `chrome://components`
   - Look for TranslateKit components
   - Wait for language models and translation components to download

4. **Supported Language Pairs**:
   - English ⇔ Spanish
   - English ⇔ Japanese
   - More languages planned for future updates


