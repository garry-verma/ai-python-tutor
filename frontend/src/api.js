const API_URL = process.env.REACT_APP_API_URL;

async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;  
    }
}

export async function fetchLesson(id) {
    return fetchData(`${API_URL}/get_lesson/${id}`);
}

export async function submitHomework(homeworkId, solution) {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`  // Include the token in the header
        },
        body: JSON.stringify({ homework_id: homeworkId, solution })
    };

    return fetchData(`${API_URL}/submit_homework`, options);
}


export async function fetchProgress() {
    return fetchData(`${API_URL}/get_progress`);
}

export async function askTutor(question) {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    };
    return fetchData(`${API_URL}/ask_tutor`, options);
}
