# Gemini Frontend Clone Assignment

A modern, responsive Gemini-style conversational AI chat app built with **Next.js 15 (App Router)**, Redux, shadcn/ui, and Tailwind CSS.

---

## 🚀 Live Demo

[**View Live on Vercel**](https://gemini-frontend-clone-assignment-seven.vercel.app/)

##  Github Repository

[**GitHub Repo**](https://github.com/AnsariYasirArfat/gemini_frontend_clone_assignment)

---

## 📋 Project Overview

This project is a frontend clone of Google Gemini’s conversational AI interface, featuring:

- OTP-based authentication (with country code selection)
- Chatroom management (create, delete, list)
- Real-time chat UI with simulated AI responses
- Image upload in chat
- Infinite scroll and pagination for messages and chatrooms
- Debounced search for chatrooms
- Responsive design, dark mode, and accessibility
- State persistence with localStorage

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **State Management:** Redux
- **Form Validation:** React Hook Form + Zod
- **Styling:** Tailwind CSS, shadcn/ui
- **Image Upload:** Base64/local preview
- **Deployment:** Vercel

---

## 🏁 Setup & Run Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AnsariYasirArfat/gemini_frontend_clone_assignment

   cd gemini-frontend-clone
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   ```
   [http://localhost:3000](http://localhost:3000)
   ```

---

## 🗂️ Folder & Component Structure

```
/app
├─ layout.tsx # Main layout (sidebar, header, etc.)
├─ page.tsx # Dashboard/home page
├─ (auth)/login/ # Login page (OTP flow)
├─ chats/[id]/ # Chatroom page (dynamic route)
├─ search/ # Search page for chatrooms
/components
├─ Auth/ # CountrySelector.
├─ Dashboard/ # Sidebar, Header, ChatRoomList, NewChatModal, etc.
├─ ChatRoom/ # MessageList, ChatInput, TypingIndicator, Skeletons
├─ Search/ # SearchBar, SearchChatRoomList, SearchListSkeleton
├─ common/ # Loader, ModeToggle, ConfirmModal, etc.
├─ ui/ # shadcn/ui components
/hooks
├─ useDebounce.ts
├─ useLocalStorage.ts
├─ useInfiniteScroll.ts
├─ useDebounce.ts
├─ useRehydrateAuth.ts
├─ useRehydrateChatRooms.ts
/store
├─ reducers/ # Redux slices for auth, chatrooms
/constants
├─ localStorage.ts # LocalStorage keys
/services
├─ getCountryDialingCodes.ts

```

---

## ⚙️ Key Features & Implementation Details

### **Authentication (OTP Flow)**

- **Country code selection:** Fetched from restcountries API.
- **OTP simulation:** Uses `setTimeout` to mimic sending/validating OTP.
- **Form validation:** React Hook Form + Zod for phone and OTP fields.
- **Persistence:** Auth state is saved in localStorage and rehydrated on app load.

### **Chatroom Management**

- **Create/Delete chatrooms:** Via modal and confirmation dialog (shadcn/ui).
- **Toast notifications:** For actions like chatroom creation/deletion.

### **Chatroom Interface**

- **Chat UI:** User and AI messages, timestamps, typing indicator.
- **AI response throttling:** Simulated delay (randomized 1.2–2s) before AI replies, using `setTimeout`.
- **Prevent spamming:** User cannot send another message while AI is "thinking".
- **Auto-scroll:** Always scrolls to the latest message after send/receive.
- **Reverse infinite scroll:** Loads older messages as you scroll up, using `useInfiniteScroll` and `react-infinite-scroll-component`.
- **Pagination:** Messages are paginated (20 per page) on the client.
- **Image upload:** Supports image preview (base64) in chat.
- **Copy-to-clipboard:** Icon button to copy content.

### **Search & Filtering**

- **Debounced search:** Search bar with debounce (custom hook) for chatroom titles.
- **Infinite scroll:** Chatroom list, Chatroom's messages and search results use infinite scroll with skeleton loaders.

### **UX & Accessibility**

- **Responsive design:** Sidebar collapses to a drawer on mobile; layout adapts to all screen sizes.
- **Dark mode:** Toggle in sidebar.
- **Loading skeletons:** For chatrooms, messages, and chat input (using shadcn/ui Skeleton).
- **Keyboard accessibility:** All main actions are keyboard-accessible.
- **Error/Not Found pages:** Custom error and 404 pages for a polished experience.

---

## 🧩 How Core Features Are Implemented

### **Throttling (AI "Thinking" Delay)**

- When a user sends a message, the input is disabled and a "Gemini is thinking..." indicator is shown.
- After a randomized delay (`setTimeout`), the AI response is added and input is re-enabled.

### **Pagination & Infinite Scroll**

- Both chatroom and message lists use a custom `useInfiniteScroll` hook.
- Messages are loaded in reverse (oldest at top, newest at bottom) with infinite scroll up.
- Chatrooms and search results use infinite scroll down.

### **Form Validation**

- All forms use React Hook Form with Zod schemas for robust, type-safe validation.
- Errors are shown inline under each field.

---

## 📸 Screenshots

![Login Page Screenshot](/public/screenshots/login.png)
![OTP Page Screenshot](/public/screenshots/otp.png)
![Main page Screenshot](/public/screenshots/image1.png)
![Chatroom Screenshot](/public/screenshots/image2.png)
![Dark Mode Screenshot](/public/screenshots/image3.png)
![Search Page Screenshot](/public/screenshots/image4.png)

---

