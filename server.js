require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors());

// ======================================================
// DATA BASE SETUP
// ======================================================

let db = {
    admin: { pseudo: 'Admin', password: 'mdp123' },
    photosCollections: [
        { id: 1, name: 'Portrait', tag: 'portrait' },
        { id: 2, name: 'Street', tag: 'street' },
        { id: 3, name: 'Move', tag: 'move' },
        { id: 4, name: 'The Eye', tag: 'the-eye' }
    ],
    videosCollections: [],
    photos: [
        {
            id: 1,
            src:
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            collections: ['overview', 'portrait']
        },
        {
            id: 2,
            src:
                'https://images.unsplash.com/photo-1538384823779-80c3e445d1a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=635&q=80',
            collections: ['overview', 'street']
        },
        {
            id: 3,
            src:
                'https://images.unsplash.com/photo-1487452066049-a710f7296400?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80',
            collections: ['overview', 'street']
        },
        {
            id: 4,
            src:
                'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
            collections: ['overview', 'portrait', 'the-eye']
        },
        {
            id: 5,
            src:
                'https://images.unsplash.com/photo-1502514276381-1ea51dfe201c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=701&q=80',
            collections: ['overview', 'street']
        },
        {
            id: 6,
            src:
                'https://images.unsplash.com/photo-1474524955719-b9f87c50ce47?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80',
            collections: ['overview', 'move']
        },
        {
            id: 7,
            src:
                'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
            collections: ['overview', 'portrait']
        },
        {
            id: 8,
            src:
                'https://images.unsplash.com/photo-1506863530036-1efeddceb993?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=941&q=80',
            collections: ['overview', 'portrait', 'the-eye']
        },
        {
            id: 9,
            src:
                'https://images.unsplash.com/photo-1511546395756-590dffdcdbd1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            collections: ['overview', 'portrait', 'the-eye']
        },
        {
            id: 10,
            src:
                'https://images.unsplash.com/photo-1539651044670-315229da9d2f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            collections: ['overview', 'street']
        },
        {
            id: 11,
            src:
                'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1140&q=80',
            collections: ['overview', 'move']
        },
        {
            id: 12,
            src:
                'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1140&q=80',
            collections: ['overview', 'move']
        },
        {
            id: 13,
            src:
                'https://images.unsplash.com/photo-1587502537745-84b86da1204f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            collections: ['overview', 'move']
        },
        {
            id: 14,
            src:
                'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
            collections: ['overview', 'portrait']
        },
        {
            id: 15,
            src:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
            collections: ['overview', 'portrait']
        },
        {
            id: 16,
            src:
                'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'street']
        },
        {
            id: 17,
            src:
                'https://images.unsplash.com/photo-1468136020796-0eec5226a897?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'street']
        },
        {
            id: 18,
            src:
                'https://images.unsplash.com/photo-1577854807863-e13e704c97c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'portrait', 'the-eye']
        },
        {
            id: 19,
            src:
                'https://images.unsplash.com/photo-1565700430899-1c56a5cf64e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'street']
        },
        {
            id: 20,
            src:
                'https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'move']
        },
        {
            id: 21,
            src:
                'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'portrait', 'street']
        },
        {
            id: 22,
            src:
                'https://images.unsplash.com/photo-1492447216082-4726bf04d1d1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'portrait', 'move']
        },
        {
            id: 23,
            src:
                'https://images.unsplash.com/photo-1532784590681-d2eda7bc5db0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'portrait', 'the-eye']
        },
        {
            id: 24,
            src:
                'https://images.unsplash.com/photo-1531168738274-aa9955d5033f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'street']
        },
        {
            id: 25,
            src:
                'https://images.unsplash.com/photo-1444464666168-49d633b86797?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'move']
        },
        {
            id: 26,
            src:
                'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'move']
        },
        {
            id: 27,
            src:
                'https://images.unsplash.com/photo-1504567961542-e24d9439a724?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'move']
        },
        {
            id: 28,
            src:
                'https://images.unsplash.com/photo-1526080652727-5b77f74eacd2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            collections: ['overview', 'portrait']
        }
    ],
    videos: [
        {
            id: 1,
            src:
                'https://www.facebook.com/1399492470372214/videos/1613895195598606',
            collections: ['overview']
        },
        {
            id: 2,
            src:
                'https://www.facebook.com/1399492470372214/videos/1544046285916831',
            collections: ['overview']
        },
        {
            id: 3,
            src:
                'https://www.facebook.com/1399492470372214/videos/1537536676567792',
            collections: ['overview']
        },
        {
            id: 4,
            src:
                'https://www.facebook.com/1399492470372214/videos/1507652326222894',
            collections: ['overview']
        },
        {
            id: 5,
            src:
                'https://www.facebook.com/1399492470372214/videos/1613895195598606',
            collections: ['overview']
        },
        {
            id: 6,
            src:
                'https://www.facebook.com/1399492470372214/videos/1544046285916831',
            collections: ['overview']
        },
        {
            id: 7,
            src:
                'https://www.facebook.com/1399492470372214/videos/1537536676567792',
            collections: ['overview']
        },
        {
            id: 8,
            src:
                'https://www.facebook.com/1399492470372214/videos/1507652326222894',
            collections: ['overview']
        }
    ]
};

//====================================================
// NODEMAILER SETTING
//====================================================

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.ACCOUNT,
        pass: process.env.PASS
    }
});

// ======================================================
// ROUTES
// ======================================================

// =================
// ADMIN
// =================

app.post('/login', (req, res) => {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) {
        return res.status(400).json('Identifiants incorrects.');
    }

    if (pseudo === db.admin.pseudo && password === db.admin.password) {
        return res.json({ accessGranted: true, pseudo: db.admin.pseudo });
    } else {
        return res.status(400).json('Identifiants incorrects.');
    }
});

// =================
// NODEMAILER
// =================

app.post('/contact', (req, res) => {
    const { name, email, phone, message } = req.body;

    const mailContent = `
    <p>
    ${name} </br> 
    ${email} </br> 
    ${phone} </br> 
    ${message}</p>`;

    const mailOptions = {
        from: process.env.ACCOUNT,
        to: process.env.ACCOUNT,
        subject: 'Saving - Nouveau Message',
        html: mailContent
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.json(info);
        }
    });
});

// =================
// COLLECTIONS
// =================

// INDEX
app.get('/photos/collections', (req, res) => {
    // Send back all photos collections from the db
    res.json(db.photosCollections);
});

app.get('/videos/collections', (req, res) => {
    // Send back all videos collections from the db
    res.json(db.videosCollections);
});

// NEW
// CREATE

// SHOW
app.get('/photos/collections/:collectionId', (req, res) => {
    // Send back all photos from the requested collection
    const { collectionId } = req.params;
    const collectionPhotos = db.photos.filter(photo =>
        photo.collections.includes(collectionId)
    );

    res.json(collectionPhotos);
});

app.get('/videos/collections/:collection', (req, res) => {
    // Send back all videos from the requested collection
    const { collectionId } = req.params;
    const collectionVideos = db.videos.filter(video =>
        video.collections.includes(collectionId)
    );
    res.json(collectionVideos);
});

// EDIT
// UPDATE
// DESTROY

// =================
// PHOTOS
// =================

// INDEX
app.get('/photos', (req, res) => {
    // Send back all photos from the db
    res.json(db.photos);
});

// NEW

// CREATE
app.post('/photos', (req, res) => {
    const { fileUrl, fileCollections } = req.body;
    const newPhoto = {
        id: db.photos[db.photos.length - 1].id + 1,
        src: fileUrl,
        collections: fileCollections
    };
    db.photos.push(newPhoto);
    res.json(db.photos);
});

// SHOW
app.get('/photos/:photoId', (req, res) => {
    // Send back a specific photo
    const { photoId } = req.params;
    const requestedPhoto = db.photos.find(
        photo => photo.id.toString() === photoId
    );
    res.json(requestedPhoto);
});

// EDIT

// UPDATE
app.put('/photos/:photoId', (req, res) => {
    const { photoId } = req.params;
    const { fileUrl, fileCollections } = req.body;

    const photoToUpdate = db.photos.find(
        photo => photo.id.toString() === photoId
    );

    const photoToUpdateIndex = db.photos.indexOf(photoToUpdate);

    const updatedPhoto = {
        id: photoToUpdate.id,
        src: fileUrl,
        collections: fileCollections
    };

    db.photos[photoToUpdateIndex] = updatedPhoto;

    res.json(db.photos);
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

// =================
// VIDEOS
// =================

// INDEX
app.get('/videos', (req, res) => {
    // Send back all videos from the db
    res.json(db.videos);
});

// NEW

// CREATE
app.post('/videos', (req, res) => {
    const { fileUrl, fileCollections } = req.body;
    const newVideo = {
        id: db.videos[db.videos.length - 1].id + 1,
        src: fileUrl,
        collections: fileCollections
    };
    db.videos.push(newVideo);
    res.json(db.videos);
});

// SHOW
app.get('/videos/:videoId', (req, res) => {
    // Send back a specific video
    const { videoId } = req.params;
    const requestedVideo = db.videos.find(
        video => video.id.toString() === videoId
    );
    res.json(requestedVideo);
});

// EDIT

// UPDATE
app.put('/videos/:videoId', (req, res) => {
    const { videoId } = req.params;
    const { fileUrl, fileCollections } = req.body;

    const videoToUpdate = db.videos.find(
        video => video.id.toString() === videoId
    );

    const videoToUpdateIndex = db.videos.indexOf(videoToUpdate);

    const updatedVideo = {
        id: videoToUpdate.id,
        src: fileUrl,
        collections: fileCollections
    };

    db.videos[videoToUpdateIndex] = updatedVideo;

    res.json(db.videos);
});

// DESTR0Y
app.delete('/videos/:videoId', (req, res) => {
    // Delete requested video then send back all videos from the db
    const { videoId } = req.params;
    const newVideos = db.videos.filter(
        video => video.id.toString() !== videoId
    );
    db = { ...db, videos: newVideos };
    res.json(db.videos);
});

// ======================================================
// APP RUNNING
// ======================================================

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}.`);
});
