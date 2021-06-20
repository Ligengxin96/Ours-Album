export const getPosts = async (_, res) => { 
    try {
        res.status(200).json('This is my first full stack project');
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
