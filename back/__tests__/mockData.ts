export const mockUsers = [
    {
        username: 'Ikuzen',
        password: 'password',
        email: "blabla@bla.bla",
        birthdate: new Date(1)
    },
    {
        username: 'Rikkel',
        password: 'password',
        email: "blabla@bla.bla",
        birthdate: new Date(1)
    }
];
export const mockTournaments = [
    {
        name: 'tournoi', size: 16,
        game: "game",
        startDate: Date.now(),
        organizer:
        {
            username: "Rikkel",
            organizer_id: "azriohgosiheogihoeszih"
        }
    },
    {
        name: 'tournoi2', size: 32,
        game: "game1",
        startDate: Date.now(),
        organizer:
        {
            username: "Ikuzen",
            organizer_id: "hdhsdysergyshtshsrthtsrhs"
        }
    },
    {
        name: 'tournoi3', size: 1,
        game: "game2",
        startDate: Date.now(),
        organizer:
        {
            username: "Rikkel",
            organizer_id: "hdhsdysergyshtshsrthtsrhs"
        },
        participants: [{
            username: "Rikkel",
            participant_id: "hdhsdysergyshtshsrthtsrhs"
        }
        ]
    },

];

