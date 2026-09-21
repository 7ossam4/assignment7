# Assignment 8 - Sticky Notes API

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and set your `MONGO_URI`.
3. `npm start` (or `npm run dev` with nodemon).

## Notes on the "logged-in user" id
No JWT/session auth is implemented (not requested in the assignment).
Instead, the logged-in user's id is passed as `?id=<userId>` on every
request that needs it (as the assignment specifies), except:
- `PATCH /users/:id`, `PATCH /notes/:noteId`, `PUT /notes/replace/:noteId`,
  `DELETE /notes/:noteId`, `GET /notes/:id` — the **resource id** is a
  route param (as shown in the assignment's URL), while the **logged-in
  user id** (for ownership checks) is still `?id=` in the query string.

## Folder structure
```
config/       -> DB connection
models/       -> Mongoose schemas (User, Note)
controllers/  -> business logic
routes/       -> Express routers
server.js     -> app entry point
bonus.js      -> LeetCode 14 - Longest Common Prefix
```

## Exporting & sharing your Postman collection
1. In Postman, group all requests for this assignment inside one **Collection**
   (e.g. "Assignment8 - Sticky Notes"), with clear, meaningful request names
   ("Signup", "Login", "Update User", "Create Note", ...).
2. Click the collection's **"..."** menu → **Export** → choose
   **Collection v2.1** → Export, and save the generated `.json` file.
3. To get a shareable **link** instead of a file:
   - Click the collection → **Share** → **Via API/Link** (or the "Share" icon
     at the top) → **Get public link**. Postman will give you a URL you can
     paste directly into your assignment email.
   - Alternatively, right-click the collection → **Share Collection** →
     choose "Get public link".
4. Paste that link (or attach the exported `.json` file) in the email along
   with your assignment/repo link, as required by the instructions.

If your workspace is a **Team/Personal workspace with link sharing
disabled**, export the `.json` file (step 2) and attach it to the email
instead — that always works even without a public link.
"# assignment7"  
