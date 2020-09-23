const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require('../middleware');
const Photo = require('../models/photo');
const Video = require('../models/video');
const PhotoCollection = require('../models/photocollection');
const VideoCollection = require('../models/videocollection');

const pickFile = typeOfFile => {
    if (typeOfFile === 'photos') {
        return Photo;
    } else if (typeOfFile === 'videos') {
        return Video;
    } else {
        return null;
    }
};

const pickCollection = typeOfFile => {
    if (typeOfFile === 'photos') {
        return PhotoCollection;
    } else if (typeOfFile === 'videos') {
        return VideoCollection;
    } else {
        return null;
    }
};

// ======================================================
// FILES ROUTES
// ======================================================

// INDEX
router.get('/', (req, res) => {
    const { typeOfFile } = req.params;
    const File = pickFile(typeOfFile);

    File.find({}, (err, files) => {
        if (err) {
            res.status(400).json('Error fetching files from the database.');
        } else {
            res.json(files);
        }
    });
});

// CREATE
router.post('/', isLoggedIn, (req, res) => {
    const { typeOfFile } = req.params;
    const { fileUrl, fileName, fileCollections } = req.body;
    const File = pickFile(typeOfFile);
    const Collection = pickCollection(typeOfFile);

    const newFile = new File({
        src: fileUrl,
        name: fileName,
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
                const fileCollectionsId = collections.map(
                    collection => collection._id
                );
                newFile.collections = [...fileCollectionsId];

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

// SHOW MANY
router.get('/collection/:collectionTag', (req, res) => {
    const { typeOfFile, collectionTag } = req.params;
    const File = pickFile(typeOfFile);
    const Collection = pickCollection(typeOfFile);

    Collection.findOne({ tag: collectionTag }, (err, collection) => {
        if (err) {
            res.status(400).json('Error fetching the requested collection.');
        } else if (collection) {
            File.find(
                { _id: { $in: collection[typeOfFile] } },
                (err, files) => {
                    if (err) {
                        res.status(400).status(
                            'Error fetching the requested files.'
                        );
                    } else if (files) {
                        res.json(files);
                    } else {
                        res.status(400).status("Requested files don't exist.");
                    }
                }
            );
        } else {
            res.status(400).json("Collection doesn't exist.");
        }
    });
});

// SHOW
router.get('/:fileId', (req, res) => {
    const { typeOfFile, fileId } = req.params;
    const File = pickFile(typeOfFile);

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
router.put('/:fileId', isLoggedIn, (req, res) => {
    const { typeOfFile, fileId } = req.params;
    const { fileUrl, fileName, fileCollections } = req.body;
    const File = pickFile(typeOfFile);
    const Collection = pickCollection(typeOfFile);

    const updatedFile = {
        src: fileUrl,
        name: fileName,
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
router.delete('/:fileId', isLoggedIn, (req, res) => {
    const { typeOfFile, fileId } = req.params;
    const File = pickFile(typeOfFile);
    const Collection = pickCollection(typeOfFile);

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
