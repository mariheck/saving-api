const express = require('express');
const router = express.Router({ mergeParams: true });
const middleware = require('../middleware');
const Photo = require('../models/photo');
const Video = require('../models/video');
const PhotoCollection = require('../models/photocollection');
const VideoCollection = require('../models/videocollection');

// ======================================================
// FILES ROUTES
// ======================================================

// INDEX
router.get('/', (req, res) => {
    const { typeOfFile } = req.params;

    const File =
        typeOfFile === 'photos'
            ? Photo
            : typeOfFile === 'videos'
            ? Video
            : null;

    File.find({}, (err, files) => {
        if (err) {
            res.status(400).json(`Couldn't fetch files from the database.`);
        } else {
            res.json(files);
        }
    });
});

// CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
    const { typeOfFile } = req.params;

    const File =
        typeOfFile === 'photos'
            ? Photo
            : typeOfFile === 'videos'
            ? Video
            : null;

    const Collection =
        typeOfFile === 'photos'
            ? PhotoCollection
            : typeOfFile === 'videos'
            ? VideoCollection
            : null;

    const { fileUrl, fileCollections } = req.body;

    const newFile = new File({
        src: fileUrl,
        collections: []
    });

    Collection.find({ tag: { $in: fileCollections } }, (err, collections) => {
        if (err) {
            res.status(400).json("Couldn't find the requested collections.");
        } else {
            const fileCollectionId = collections.map(
                collection => collection._id
            );
            newFile.collections = [...fileCollectionId];

            File.create(newFile, (err, file) => {
                if (err) {
                    res.status(400).json(
                        "Coudln't save the file in the database."
                    );
                } else {
                    file.collections.forEach(fileCollectionId => {
                        Collection.findById(
                            fileCollectionId,
                            (error, collection) => {
                                if (error) {
                                    res.status(400).json(
                                        "Couldn't find the requested collection."
                                    );
                                } else {
                                    collection[typeOfFile].push(file._id);
                                    collection.save(error => {
                                        if (error)
                                            res.status(400).json(
                                                "Coudln't update the collection with new file id."
                                            );
                                    });
                                }
                            }
                        );
                    });

                    res.status(200).json('File saved in database.');
                }
            });
        }
    });
});

// SHOW
router.get('/:fileId', (req, res) => {
    const { typeOfFile, fileId } = req.params;

    const File =
        typeOfFile === 'photos'
            ? Photo
            : typeOfFile === 'videos'
            ? Video
            : null;

    File.findById(fileId, (err, file) => {
        if (err) {
            res.status(400).status(`Couldn't find the requested file.`);
        } else {
            res.json(file);
        }
    });
});

// UPDATE
router.put('/:fileId', middleware.isLoggedIn, (req, res) => {
    const { typeOfFile, fileId } = req.params;

    const File =
        typeOfFile === 'photos'
            ? Photo
            : typeOfFile === 'videos'
            ? Video
            : null;

    const Collection =
        typeOfFile === 'photos'
            ? PhotoCollection
            : typeOfFile === 'videos'
            ? VideoCollection
            : null;

    const { fileUrl, fileCollections } = req.body;

    const updatedFile = {
        src: fileUrl,
        collections: []
    };

    Collection.find({ tag: { $in: fileCollections } }, (err, collections) => {
        if (err) {
            res.status(400).json("Couldn't find the requested collections.");
        } else {
            const fileCollectionsId = collections.map(
                collection => collection._id
            );
            updatedFile.collections = [...fileCollectionsId];

            File.findByIdAndUpdate(fileId, updatedFile, (err, file) => {
                if (err) {
                    res.status(400).json(
                        "Coudln't save the file in the database."
                    );
                } else {
                    Collection.find({}, (error, allCollections) => {
                        if (error) {
                            res.status(400).status(
                                "Couldn't find the requested collections."
                            );
                        } else {
                            allCollections.forEach(collection => {
                                if (
                                    fileCollections.includes(collection.tag) &&
                                    !collection[typeOfFile].includes(file._id)
                                ) {
                                    collection[typeOfFile].push(file._id);
                                    collection.save(error => {
                                        if (error)
                                            res.status(400).json(
                                                "Coudln't update the collection with new file id."
                                            );
                                    });
                                } else if (
                                    !fileCollections.includes(collection.tag) &&
                                    collection[typeOfFile].includes(file._id)
                                ) {
                                    const newCollectionsFiles = collection[
                                        typeOfFile
                                    ].filter(
                                        collectionFile =>
                                            collectionFile.toString() !==
                                            file._id.toString()
                                    );

                                    collection[typeOfFile] = [
                                        ...newCollectionsFiles
                                    ];

                                    collection.save(error => {
                                        if (error)
                                            res.status(400).json(
                                                "Coudln't update the collection with new file id."
                                            );
                                    });
                                }
                            });
                        }
                    });

                    res.status(200).json('File saved in database.');
                }
            });
        }
    });
});

// DESTROY
router.delete('/:fileId', middleware.isLoggedIn, (req, res) => {
    const { typeOfFile, fileId } = req.params;

    const File =
        typeOfFile === 'photos'
            ? Photo
            : typeOfFile === 'videos'
            ? Video
            : null;

    const Collection =
        typeOfFile === 'photos'
            ? PhotoCollection
            : typeOfFile === 'videos'
            ? VideoCollection
            : null;

    File.findByIdAndRemove(fileId, (err, file) => {
        if (err) {
            res.status(400).json(`Coudln't remove the file from the database.`);
        } else {
            file.collections.forEach(fileCollection => {
                Collection.findById(fileCollection, (error, collection) => {
                    if (error) {
                        res.status(400).json("Couldn't find the collection.");
                    } else {
                        const newCollectionsFiles = collection[
                            typeOfFile
                        ].filter(
                            collectionFile =>
                                collectionFile.toString() !==
                                file._id.toString()
                        );

                        collection[typeOfFile] = [...newCollectionsFiles];
                        collection.save(err => {
                            if (err)
                                res.status(400).json(
                                    "Coudln't update the collection."
                                );
                        });
                    }
                });
            });

            res.status(200).json(`File removed from database.`);
        }
    });
});

module.exports = router;
