import { auth } from "../firebase";

export const getIdTokenHeader = async () => {
    try {
        if (!auth.currentUser) {
            throw {
                message: "Not logged in"
            }
        } else {
            const token = await auth.currentUser.getIdToken();
            return {
                "Authorization": `Bearer ${token}`
            }
        }
    } catch (error) {
        console.error("Error in getting ID token", error);
        throw error;
    }
}
