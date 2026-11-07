# CodeLearn — mini LMS (FER202 final assignment)

> **Sinh viên:** _(điền Họ tên của bạn)_ — **MSSV:** _(điền mã số sinh viên)_
> **Môn:** FER202 — Front-End Web Development with React

ReactJS (Create React App) · React Router 6 · Redux Toolkit · Axios · React-Bootstrap · json-server 0.17.4

## Run

```bash
npm install              # React 18 is pinned: CRA now installs React 19 by default (peer conflicts)
npm run dev              # json-server :9999 + React :3000 together (concurrently)
```

Or in two terminals: `npm run server` and `npm start`. Restart `npm start` after editing `.env`.

## Demo accounts (db.json)

| Role    | Email               | Password |
|---------|---------------------|----------|
| admin   | admin@codelearn.vn  | admin123 |
| student | an@codelearn.vn     | 123456   |
| locked  | cuong@codelearn.vn  | 123456   |

json-server is not a real auth server: passwords are plain text in db.json — for learning only.
