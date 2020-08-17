const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ======================================================
// DATA BASE SETUP
// ======================================================

let db = {
    photos: [
        {
            id: 1,
            imageSrc:
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            collections: ['overview', 'portrait']
        },
        {
            id: 2,
            imageSrc:
                'https://images.unsplash.com/photo-1538384823779-80c3e445d1a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=635&q=80',
            collections: ['overview', 'street']
        },
        {
            id: 3,
            imageSrc:
                'https://images.unsplash.com/photo-1487452066049-a710f7296400?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80',
            collections: ['overview', 'street']
        },
        {
            id: 4,
            imageSrc:
                'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
            collections: ['overview', 'portrait', 'the-eye']
        },
        {
            id: 5,
            imageSrc:
                'https://images.unsplash.com/photo-1502514276381-1ea51dfe201c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=701&q=80',
            collections: ['overview', 'street']
        },
        {
            id: 6,
            imageSrc:
                'https://images.unsplash.com/photo-1474524955719-b9f87c50ce47?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80',
            collections: ['overview', 'move']
        },
        {
            id: 7,
            imageSrc:
                'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
            collections: ['overview', 'portrait']
        },
        {
            id: 8,
            imageSrc:
                'https://images.unsplash.com/photo-1506863530036-1efeddceb993?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=941&q=80',
            collections: ['overview', 'portrait', 'the-eye']
        },
        {
            id: 9,
            imageSrc:
                'https://images.unsplash.com/photo-1511546395756-590dffdcdbd1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            collections: ['overview', 'portrait', 'the-eye']
        },
        {
            id: 10,
            imageSrc:
                'https://images.unsplash.com/photo-1539651044670-315229da9d2f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            collections: ['overview', 'street']
        },
        {
            id: 11,
            imageSrc:
                'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1140&q=80',
            collections: ['overview', 'move']
        },
        {
            id: 12,
            imageSrc:
                'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1140&q=80',
            collections: ['overview', 'move']
        },
        {
            id: 13,
            imageSrc:
                'https://images.unsplash.com/photo-1587502537745-84b86da1204f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            collections: ['overview', 'move']
        },
        {
            id: 14,
            imageSrc:
                'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            collections: ['overview', 'portrait']
        }
    ]
};

// ======================================================
// ROUTES
// ======================================================

// INDEX
app.get('/photos', (req, res) => {
    // Send back all photos from the db
    res.json(db.photos);
});

app.get('/photos/:collection', (req, res) => {
    // Send back all photos from the requested collection
    const { collection } = req.params;
    const collectionPhotos = db.photos.filter(photo =>
        photo.collections.includes(collection)
    );
    res.json(collectionPhotos);
});

// DESTROY
app.delete('/photos/:photoId', (req, res) => {
    // Delete requested image then send back all photos from the db
    const { photoId } = req.params;
    const newPhotos = db.photos.filter(
        photo => photo.id.toString() !== photoId
    );
    db = { ...db, photos: newPhotos };
    res.json(db.photos);
});

// ======================================================
// APP RUNNING
// ======================================================

app.listen(3000, () => {
    console.log('App is running on port 3000.');
});
