# Fabric GraphQL Client – React Demo

This project is a **React-based client application** that demonstrates how to interact with **Microsoft Fabric’s GraphQL API** to perform CRUD operations against a Warehouse table.

It was built as a technical proof-of-concept to show how a modern frontend can securely call Fabric GraphQL endpoints and work with structured data.

---

## 🔧 Tech Stack

- **Frontend:** React (Vite)
- **API Layer:** Microsoft Fabric – API for GraphQL
- **Data Source:** Fabric Warehouse (`dbo.Items` table)
- **Auth (Demo Mode):** Entra ID access token (manually pasted)

---

## 📦 Features Implemented

The application connects to a Fabric GraphQL endpoint and supports the following operations:

| Operation | GraphQL Type | Description |
|-----------|--------------|-------------|
| Add Item | Mutation | Inserts a new record into the Items table |
| Update Quantity | Mutation | Updates quantity for a given item |
| Delete Item | Query (Fabric classification) | Deletes a record by ID |
| Get Items | Query | Retrieves paged records from the Items table |

---

## 🗄️ Backend Data Model

**Warehouse Table:**

```
dbo.Items
- id (UNIQUEIDENTIFIER)
- name (VARCHAR(32))
- type (VARCHAR(20))
- quantity (INT)
```

All data operations are executed via **stored procedures** exposed through the Fabric GraphQL API.

---

## 🚀 How to Run Locally

### 1. Clone the repository

```
git clone https://github.com/hemantsaab/fabric-graphql-client
cd fabric-graphql-client
```

### 2. Install dependencies

```
npm install
```

### 3. Start the development server

```
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

---

## 🔐 Authentication (Demo Setup)

This app expects a **Bearer token** from Microsoft Entra ID to call the Fabric GraphQL endpoint.

For testing, you can obtain a token using **Azure CLI**:

```
az login
az account get-access-token --resource https://api.fabric.microsoft.com
```

Copy the `accessToken` value and paste it into the app’s **Auth** section.

> Note: This manual token approach is for demonstration only. In production, MSAL (Microsoft Authentication Library) should be used.

---

## 📡 Fabric GraphQL Integration

The app calls a Fabric GraphQL endpoint that exposes stored procedures such as:

- `executesp_AddItem`
- `executesp_UpdateQuantity`
- `executesp_DeleteItem`
- `executesp_GetItems`

Each call is made using parameterized GraphQL queries/mutations and a reusable fetch wrapper.

---

## 🧠 Purpose of This Project

This project demonstrates:

- How GraphQL can simplify frontend-to-data-platform interactions
- How Microsoft Fabric’s GraphQL API can be used as an application-facing data layer
- A clean separation between UI, API contract, and underlying data platform

It is intended as a learning/demo project and architectural reference.

---

## 📌 Notes

- `node_modules` and build artifacts are excluded from source control
- No credentials or tokens are stored in the repository
- This project uses a development-only authentication approach

## 🧩 Database Setup (Warehouse)

See the `sql/` folder for scripts:

- `01_table_Items.sql` – creates `dbo.Items`
- `02_sp_AddItem.sql` – inserts item (returns inserted row)
- `03_sp_UpdateQuantity.sql` – updates quantity (returns updated row + flag)
- `04_sp_DeleteItem.sql` – deletes item (returns deleted flag)
- `05_sp_GetItems.sql` – paged read of items