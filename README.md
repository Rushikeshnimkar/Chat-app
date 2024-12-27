# ChatApp

ChatApp is chatting application built with React, TypeScript, and InstantDB, offering a seamless messaging experience. It features a contact list on the left and a dynamic chat window on the right. Leveraging InstantDB for real-time message storage and retrieval, ChatApp ensures instant communication. Additionally, it utilizes IndexedDB for local data storage, providing offline capabilities. Enhanced performance is achieved through Gemini Nano integration.

## Features

- **Real-Time Messaging**: Instant message sending and receiving using InstantDB.
- **Contact Management**: Easy navigation with a contact list sidebar.
- **Chat History**: Access and view chat history by selecting a contact.
- **Language translation**: Translate messages between different languages seamlessly.

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

### Hook Implementation

1. **Custom Hooks**
   - `useDarkMode`: Manages theme preferences across the application
   - `useTranslation`: Handles language translation functionality
   - `useAuth`: Manages authentication state and user sessions
   - `useChat`: Centralizes chat-related operations and state

2. **Context Usage**
   - DarkModeContext: Global theme management
   - AuthContext: User authentication state
   - ChatContext: Real-time messaging state
   - Each context implemented with proper provider pattern

3. **useReducer Implementation**
   - Chat state management (messages, translations)
   - Profile updates and user settings
   - Contact list management
   - Provides predictable state updates and better debugging

## Translation Feature Setup

Before using the translation feature in ChatApp, follow these setup instructions:

### Chrome Browser Requirements
1. **Browser Version**
   - Chrome version 131.0.6778.2 or above
   - Chrome Canary or Dev channel recommended
   - Supported on Windows, Mac, and Linux desktop platforms

2. **Enable Translation API**
   - Go to `chrome://flags/#translation-api`
   - Set to "Enabled"
   - For multiple languages: select "Enabled without language pack limit"
   - Restart Chrome

3. **Language Components**
   - Navigate to `chrome://components`
   - Locate TranslateKit components
   - Download required language models


For detailed setup instructions and updates, visit [Translation API Documentation](https://docs.google.com/document/d/1bzpeKk4k26KfjtR-_d9OuXLMpJdRMiLZAOVNMuFIejk/edit?tab=t.0)


