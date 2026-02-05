import { useMemo, useState } from "react";

const FABRIC_GQL_ENDPOINT =
  "https://c2126262a0434325ab6e6809cbcebab1.zc2.graphql.fabric.microsoft.com/v1/workspaces/c2126262-a043-4325-ab6e-6809cbcebab1/graphqlapis/b8c26037-e535-45a1-b267-654d30a57b9b/graphql";

const ADD_ITEM_MUTATION = `
mutation AddItem($name: String!, $type: String!, $quantity: Int!) {
  executesp_AddItem(name: $name, type: $type, quantity: $quantity) {
    id
    name
    type
    quantity
  }
}`;

const UPDATE_QTY_MUTATION = `
mutation UpdateQuantity($id: UUID!, $quantity: Int!) {
  executesp_UpdateQuantity(id: $id, quantity: $quantity) {
    id
    updated
    name
    type
    quantity
  }
}`;

const DELETE_ITEM_QUERY = `
query DeleteItem($id: UUID!) {
  executesp_DeleteItem(id: $id) {
    id
    deleted
  }
}`;

const GET_ITEMS_QUERY = `
query GetItems($skip: Int!, $take: Int!) {
  executesp_GetItems(skip: $skip, take: $take) {
    id
    name
    type
    quantity
  }
}`;

async function callFabricGraphQL({ token, query, variables }) {
  const resp = await fetch(FABRIC_GQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await resp.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response (${resp.status}): ${text.slice(0, 300)}`);
  }

  if (!resp.ok) {
    const msg =
      json?.error?.message ||
      json?.message ||
      `HTTP ${resp.status} ${resp.statusText}`;
    throw new Error(msg);
  }

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(" | "));
  }

  return json.data;
}

function Card({ title, children }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        background: "white",
      }}
    >
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>{label}</div>
      <input
        name={label.replace(/\s+/g, "_")}   // unique field name
        autoComplete="new-password"        // stops Chrome autofill
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #ccc",
        }}
      />
    </label>
  );
}

export default function App() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Add
  const [addName, setAddName] = useState("");
  const [addType, setAddType] = useState("");
  const [addQty, setAddQty] = useState("");

  // Update
  const [updId, setUpdId] = useState("");
  const [updQty, setUpdQty] = useState("");

  // Delete
  const [delId, setDelId] = useState("");

  // Get All
  const [items, setItems] = useState([]);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState("100");

  const tokenLooksOk = useMemo(() => token.trim().length > 50, [token]);

  async function runOp(kind) {
    setError("");
    setResult(null);

    if (!tokenLooksOk) {
      setError("Paste a valid Bearer token first (it should be long).");
      return;
    }

    try {
      if (kind === "add") {
        const n = addName.trim();
        const t = addType.trim();
        const q = addQty.trim();

        if (!n) { setError("Name is required (cannot be blank)."); return; }
        if (!t) { setError("Type is required (cannot be blank)."); return; }
        if (!q) { setError("Quantity is required (cannot be blank)."); return; }
  
        const variables = {
          name: n,
          type: t,
          quantity: Number(q),
        };

        const data = await callFabricGraphQL({
          token: token.trim(),
          query: ADD_ITEM_MUTATION,
          variables,
        });

        setResult({ op: "AddItem", data });
      }

      if (kind === "update") {
        const u = updId.trim();
        const q = updQty.trim();

        if (!u) { setError("Id is required (cannot be blank)."); return; }
        if (!q) { setError("Quantity is required (cannot be blank)."); return; }
  
        const variables = {
          id: u,
          quantity: Number(q),
        };

        const data = await callFabricGraphQL({
          token: token.trim(),
          query: UPDATE_QTY_MUTATION,
          variables,
        });

        setResult({ op: "UpdateQuantity", data });
      }

      if (kind === "delete") {
        const d = delId.trim();
        if (!d) { setError("Id is required (cannot be blank)."); return; }

        const variables = { id: d };

        const data = await callFabricGraphQL({
          token: token.trim(),
          query: DELETE_ITEM_QUERY,
          variables,
        });

        setResult({ op: "DeleteItem", data });
      }

      if (kind === "getItems") {
        const variables = {
          skip: Number(skip),
          take: Number(take),
        };

        const data = await callFabricGraphQL({
          token: token.trim(),
          query: GET_ITEMS_QUERY,
          variables,
        });

        const rows = data.executesp_GetItems ?? [];
        setItems(rows);
        setResult({ op: "GetItems", data });
      }
    } catch (e) {
      setError(e?.message || String(e));
    }
  }

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 24,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginTop: 0 }}>Fabric GraphQL Client (Items CRUD)</h1>

      <Card title="1) Auth (paste Bearer token)">
        <p style={{ marginTop: 0 }}>
          Paste an <b>Entra ID access token</b> (Bearer token) here.
        </p>
        <label style={{ display: "block" }}>
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>
            Bearer token
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="e.g., eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs..."
            rows={4}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ccc",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12,
            }}
          />
        </label>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
          Status: {tokenLooksOk ? "✅ token present" : "⚠️ paste a token"}
        </div>
      </Card>

      <Card title="2) Add Item (Mutation: executesp_AddItem)">
        <Field label="name" value={addName} onChange={setAddName} placeholder="e.g., Widget" />
        <Field label="type" value={addType} onChange={setAddType} placeholder="e.g., Hardware" />
        <Field label="quantity" value={addQty} onChange={setAddQty} type="number" />
        <button
          onClick={() => runOp("add")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #333",
            background: "#111",
            color: "white",
          }}
        >
          Run AddItem
        </button>
      </Card>

      <Card title="3) Update Quantity (Mutation: executesp_UpdateQuantity)">
        <Field
          label="id (UUID)"
          value={updId}
          onChange={setUpdId}
          placeholder="e.g., 9f8a1c4e-3b2a-4b0b-9e4c-1a2b3c4d5e6f"
        />
        <Field label="quantity" value={updQty} onChange={setUpdQty} type="number" />
        <button
          onClick={() => runOp("update")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #333",
            background: "#111",
            color: "white",
          }}
        >
          Run UpdateQuantity
        </button>
      </Card>

      <Card title="4) Delete Item (Query: executesp_DeleteItem)">
        <Field
          label="id (UUID)"
          value={delId}
          onChange={setDelId}
          placeholder="e.g., 9f8a1c4e-3b2a-4b0b-9e4c-1a2b3c4d5e6f"
        />
        <button
          onClick={() => runOp("delete")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #333",
            background: "#111",
            color: "white",
          }}
        >
          Run DeleteItem
        </button>
      </Card>

      <Card title="5) Get Items (Query: executesp_GetItems)">
        <Field label="skip" value={String(skip)} onChange={(v) => setSkip(Number(v || 0))} type="number" />
        <Field label="take" value={take} onChange={setTake} type="number" />

        <button
          onClick={() => runOp("getItems")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #333",
            background: "#111",
            color: "white",
          }}
        >
          Run GetItems
        </button>

        {items.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>
              Rows: {items.length}
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>id</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>name</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>type</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>quantity</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id}>
                    <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8, fontFamily: "ui-monospace" }}>{r.id}</td>
                    <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.name}</td>
                    <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.type}</td>
                    <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>




      {error && (
        <div
          style={{
            background: "#ffe7e7",
            border: "1px solid #ffb3b3",
            padding: 12,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <b>Error:</b> {error}
        </div>
      )}

      {result && (
        <div
          style={{
            background: "#f3f6ff",
            border: "1px solid #c9d6ff",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <b>Result ({result.op}):</b>
          <pre style={{ margin: 0, marginTop: 8, overflowX: "auto" }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
