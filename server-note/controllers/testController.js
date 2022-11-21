const Test = async (req, res) => {
    try {
        res.status(200).json("Votre server Note Horeb Groupe fonctionne correctement!");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { Test };