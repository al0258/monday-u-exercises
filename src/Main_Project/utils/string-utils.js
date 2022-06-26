export function capitalizeText(text) {
    //This function literally just capitalizing the first letter of the task
    return text
        .split(' ')
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join(' ');
}


export function generateUniqueID() { 
    //This function creates a unique ID for every new task
    return Math.random().toString(36).substr(2, 9);
}