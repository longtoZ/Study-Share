const ADD_HISTORY_ENTRY_ENDPOINT = import.meta.env.VITE_ADD_HISTORY_ENTRY_ENDPOINT;
const DELETE_HISTORY_ENTRY_ENDPOINT = import.meta.env.VITE_DELETE_HISTORY_ENTRY_ENDPOINT;
const BULK_DELETE_HISTORY_ENTRIES_ENDPOINT = import.meta.env.VITE_BULK_DELETE_HISTORY_ENTRIES_ENDPOINT;
const LIST_HISTORY_ENTRIES_ENDPOINT = import.meta.env.VITE_LIST_HISTORY_ENTRIES_ENDPOINT;

const addEntry = async (entry: any) => {
    const response = await fetch(ADD_HISTORY_ENTRY_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
    });
    return await response.json();
};

const deleteEntry = async (entry: any) => {
    const response = await fetch(DELETE_HISTORY_ENTRY_ENDPOINT, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
    });
    return await response.json();
};

const bulkDeleteEntries = async (history_ids: string[]) => {
    const response = await fetch(BULK_DELETE_HISTORY_ENTRIES_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ history_ids }),
    });
    return await response.json();
};

const listEntries = async (user_id: string, filter: any, pageRange: { from: number; to: number }) => {
    const response = await fetch(LIST_HISTORY_ENTRIES_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, filter, pageRange }),
    });
    
    const data = await response.json();
    return data.entries;
};

export { addEntry, deleteEntry, bulkDeleteEntries, listEntries };