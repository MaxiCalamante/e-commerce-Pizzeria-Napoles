const users = [
    { id: 'user-1', first_name: 'Maximo', last_name: 'Calamante', email: 'maxi@example.com' },
    { id: 'user-2', first_name: 'Juan', last_name: 'Perez', email: 'juan@example.com' }
];

const pets = [
    { id: 'pet-1', name: 'Luna', specie: 'dog', adopted: false },
    { id: 'pet-2', name: 'Michi', specie: 'cat', adopted: false }
];

const adoptions = [];

class AdoptionError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const getAllAdoptions = async () => adoptions;

const getAdoptionById = async (adoptionId) => {
    return adoptions.find((adoption) => adoption.id === adoptionId) || null;
};

const createAdoption = async (userId, petId, data = {}) => {
    const user = users.find((item) => item.id === userId);
    if (!user) {
        throw new AdoptionError(404, 'Usuario no encontrado');
    }

    const pet = pets.find((item) => item.id === petId);
    if (!pet) {
        throw new AdoptionError(404, 'Mascota no encontrada');
    }

    if (pet.adopted || adoptions.some((adoption) => adoption.pet.id === petId)) {
        throw new AdoptionError(409, 'La mascota ya fue adoptada');
    }

    pet.adopted = true;

    const adoption = {
        id: `adoption-${Date.now()}`,
        owner: user,
        pet,
        notes: data.notes || null,
        adoptedAt: new Date().toISOString()
    };

    adoptions.push(adoption);
    return adoption;
};

module.exports = {
    AdoptionError,
    getAllAdoptions,
    getAdoptionById,
    createAdoption
};
