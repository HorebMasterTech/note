const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getNotes = async (req, res) => {
    if (!req.user) return res.status(400).json({ error: "Authentification invalide." });
    try {
        userConneted = await prisma.users.findUnique({
            where: {id: String(req.user.id)},
            select: {
                id: true,
                nom: true,
                notes: {
                    select: {
                        id: true,
                        titre: true,
                        contenu: true,
                        couleur: true,
                        createdAt: true,
                        updatedAt: true,
                        auteurId: true
                    }
                }
            }
        });
        res.status(200).json({ data: userConneted.notes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const createNote = async (req, res) => {
    if (!req.user) return res.status(400).json({ error: "Authentification invalide." });
    try {
        const { titre, contenu } = req.body;
        if(!titre && !contenu) return res.status(500).json({ errors: "Aucune valeur." })

        const auteurEmail = req.user.email;

        const newNote = await prisma.note.create({
            data: {
                titre,
                contenu,
                couleur: "couleurDark",
                auteur: {connect: { email: auteurEmail }}
            }
        })
        res.status(200).json(newNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateCouleurNote = async (req, res) => {
    if (!req.user) return res.status(400).json({ error: "Authentification invalide." });
    try {
        const { couleurChoisit } = req.body;
        const noteCouleur = await prisma.note.update({
            where: {
                id: String(req.params.id)
            },
            data: {
                couleur: couleurChoisit
            }
        });
        res.status(200).json(noteCouleur);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateNote = async (req, res) => {
    if (!req.user) return res.status(400).json({ error: "Authentification invalide." });

    try{
        const { titreEdit, contenuEdit } = req.body;
        const noteEdit = await prisma.note.update({
            where: {
                id: String(req.params.id)
            },
            data: {
                titre: titreEdit,
                contenu: contenuEdit
            }
        });
        res.status(200).json(noteEdit);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

const deleteNote = async (req, res) => {
    if (!req.user) return res.status(400).json({ error: "Authentification invalide." });
    try{
        const note = await prisma.note.delete({
            where: {
                id: String(req.params.id)
            }
        })
        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getNotes, createNote, deleteNote, updateCouleurNote, updateNote };