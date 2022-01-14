import { getAllDocuments, connectDatabase, insertDocument } from '../../../helpers/db-util';

async function handler(req, res) {
    const eventId = req.query.eventId;

    let client;

    try {
        client = await connectDatabase();
    }
    catch(error){
        return res.status(500).json({
            message: 'Connecting to database failed'
        })
    }   

    if (req.method === 'POST') {
        const { email, name, text } = req.body;
        if (
            !email ||
            !email.includes('@') ||
            !name ||
            name.trim() === '' ||
            !text ||
            text.trim() === '') {
            
            client.close();
            return res.status(422).json({ message: 'Invalid input.' })
        }

        const newComment = {
            eventId,
            text,
            email,
            name
        };

        let result;

        try {
            result = await insertDocument(client, 'comments' , newComment);
            newComment['_id'] = result.insertedId;
            res.status(201).json({
                comment: newComment,
                message: 'Added Comment'
            });
        }
        catch(error){
            res.status(500).json({
                message:'Inserting comment failed!'
            })
        }
    }
    else if (req.method === 'GET') {
        
        try {
            const comments = await getAllDocuments(client, 'comments' , { eventId }, { _id: -1})
            res.status(200).json({
                comments
            })
        }
        catch(error){
            res.status(500).json({
                message: 'Getting comments failed.'
            })
        }
    }
    client.close();
}

export default handler;