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
            res.status(400).json('Error fetching files from the database.');
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

    Collection.find(
        { tag: { $in: fileCollections } },
        (findError, collections) => {
            if (findError) {
                res.status(400).json(
                    'Error finding the requested collections.'
                );
            } else if (collections) {
                const fileCollectionId = collections.map(
                    collection => collection._id
                );
                newFile.collections = [...fileCollectionId];

                File.create(newFile, (createError, file) => {
                    if (createError) {
                        res.status(400).json(
                            'Error saving the file in the database.'
                        );
                    } else {
                        file.collections.forEach(fileCollectionId => {
                            Collection.findById(
                                fileCollectionId,
                                (findByIdError, collection) => {
                                    if (findByIdError) {
                                        res.status(400).json(
                                            "Couldn't find the requested collection."
                                        );
                                    } else if (collection) {
                                        collection[typeOfFile].push(file._id);
                                        collection.save(error => {
                                            if (error)
                                                res.status(400).json(
                                                    "Coudln't update the collection with new file id."
                                                );
                                        });
                                    } else {
                                        res.status(400).json(
                                            "Requested collection doesn't exist."
                                        );
                                    }
                                }
                            );
                        });

                        res.status(200).json('File saved in database.');
                    }
                });
            } else {
                res.status(400).json("Requested collections don't exist.");
            }
        }
    );
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
            res.status(400).status('Error fetching the requested file.');
        } else if (file) {
            res.json(file);
        } else {
            res.status(400).status("Requested file doesn't exist.");
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

    Collection.find(
        { tag: { $in: fileCollections } },
        (findError, collections) => {
            if (findError) {
                res.status(400).json(
                    "Couldn't find the requested collections."
                );
            } else if (collections) {
                const fileCollectionsId = collections.map(
                    collection => collection._id
                );
                updatedFile.collections = [...fileCollectionsId];

                File.findByIdAndUpdate(
                    fileId,
                    updatedFile,
                    (updateError, file) => {
                        if (updateError) {
                            res.status(400).json(
                                "Coudln't save the file in the database."
                            );
                        } else {
                            if (file) {
                                Collection.find(
                                    {},
                                    (findAllError, allCollections) => {
                                        if (findAllError) {
                                            res.status(400).status(
                                                "Couldn't find the requested collections."
                                            );
                                        } else if (allCollections) {
                                            allCollections.forEach(
                                                collection => {
                                                    if (
                                                        fileCollections.includes(
                                                            collection.tag
                                                        ) &&
                                                        !collection[
                                                            typeOfFile
                                                        ].includes(file._id)
                                                    ) {
                                                        collection[
                                                            typeOfFile
                                                        ].push(file._id);
                                                        collection.save(
                                                            saveError => {
                                                                if (saveError)
                                                                    res.status(
                                                                        400
                                                                    ).json(
                                                                        "Coudln't update the collection with new file id."
                                                                    );
                                                            }
                                                        );
                                                    } else if (
                                                        !fileCollections.includes(
                                                            collection.tag
                                                        ) &&
                                                        collection[
                                                            typeOfFile
                                                        ].includes(file._id)
                                                    ) {
                                                        const newCollectionsFiles = collection[
                                                            typeOfFile
                                                        ].filter(
                                                            collectionFile =>
                                                                collectionFile.toString() !==
                                                                file._id.toString()
                                                        );

                                                        collection[
                                                            typeOfFile
                                                        ] = [
                                                            ...newCollectionsFiles
                                                        ];

                                                        collection.save(
                                                            saveError => {
                                                                if (saveError)
                                                                    res.status(
                                                                        400
                                                                    ).json(
                                                                        "Coudln't update the collection with new file id."
                                                                    );
                                                            }
                                                        );
                                                    }
                                                }
                                            );
                                        } else {
                                            res.status(400).json(
                                                'No collections to find.'
                                            );
                                        }
                                    }
                                );

                                res.status(200).json('File saved in database.');
                            } else {
                                res.status(400).json(
                                    "Requested file doesn't exist."
                                );
                            }
                        }
                    }
                );
            } else {
                res.status(400).json("Requested collections don't exist.");
            }
        }
    );
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

    File.findByIdAndRemove(fileId, (removeError, file) => {
        if (removeError) {
            res.status(400).json(`Coudln't remove the file from the database.`);
        } else if (file) {
            file.collections.forEach(fileCollection => {
                Collection.findById(fileCollection, (findError, collection) => {
                    if (findError) {
                        res.status(400).json("Couldn't find the collection.");
                    } else if (collection) {
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
                    } else {
                        res.status(400).json(
                            "Requested collection doesn't exist."
                        );
                    }
                });
            });

            res.status(200).json('File removed from database.');
        } else {
            res.status(400).json("Requested file doesn't exist.");
        }
    });
});

module.exports = router;
