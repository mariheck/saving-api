const express = require('express');
const router = express.Router({ mergeParams: true });
const _ = require('lodash');
const { isLoggedIn } = require('../middleware');
const PhotoCollection = require('../models/photocollection');
const VideoCollection = require('../models/videocollection');

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
// FILES COLLECTIONS ROUTES
// ======================================================

// INDEX
router.get('/', (req, res) => {
    const { typeOfFile } = req.params;
    const Collection = pickCollection(typeOfFile);

    Collection.find({}, (err, collections) => {
        if (err) {
            res.status(400).json(
                'Error fetching collections from the database.'
            );
        } else if (collections) {
            res.json(collections);
        } else {
            res.status(400).json('No collections in the database.');
        }
    });
});

// CREATE
router.post('/', isLoggedIn, (req, res) => {
    const { typeOfFile } = req.params;
    const { entry } = req.body;
    const Collection = pickCollection(typeOfFile);

    const newCollection = new Collection({
        name: _.startCase(_.toLower(_.trim(entry))),
        tag: _.kebabCase(_.toLower(_.trim(entry)))
    });

    Collection.create(newCollection, err => {
        if (err) {
            res.status(400).json(
                'Error creating the  collection in the database.'
            );
        } else {
            res.status(200).json('Collection saved in database.');
        }
    });
});

// SHOW
router.get('/:collectionTag', (req, res) => {
    const { typeOfFile, collectionTag } = req.params;
    const Collection = pickCollection(typeOfFile);

    Collection.findOne({ tag: collectionTag }, (err, collection) => {
        if (err) {
            res.status(400).json('Error fetching the requested collection.');
        } else if (collection) {
            res.json(collection);
        } else {
            res.status(400).json("Collection doesn't exist.");
        }
    });
});

// UPDATE
router.put('/:collectionTag', isLoggedIn, (req, res) => {
    const { typeOfFile, collectionTag } = req.params;
    const { entry } = req.body;
    const Collection = pickCollection(typeOfFile);

    const updatedCollection = {
        name: _.startCase(_.toLower(_.trim(entry))),
        tag: _.kebabCase(_.toLower(_.trim(entry)))
    };

    Collection.findOneAndUpdate(
        { tag: collectionTag },
        updatedCollection,
        (err, collection) => {
            if (err) {
                res.status(400).json('Error updating the collection.');
            } else if (collection) {
                res.status(200).json('Collection saved in database.');
            } else {
                res.status(400).json("Requested collection doesn't exist.");
            }
        }
    );
});

// DESTR0Y
router.delete('/:collectionTag', isLoggedIn, (req, res) => {
    const { typeOfFile, collectionTag } = req.params;
    const Collection = pickCollection(typeOfFile);

    Collection.findOne({ tag: collectionTag }, (findError, collection) => {
        if (findError) {
            res.status(400).json('Error fetching the requested collection.');
        } else if (collection) {
            if (collection[typeOfFile].length) {
                res.status(400).json(
                    "Coudln't remove the collection from the database : collection not empty."
                );
            } else {
                Collection.findOneAndDelete(
                    { tag: collectionTag },
                    deleteError => {
                        if (deleteError) {
                            res.status(400).json(
                                "Coudln't remove the collection from the database."
                            );
                        } else {
                            res.status(200).json(
                                'Collection removed from database.'
                            );
                        }
                    }
                );
            }
        } else {
            res.status(400).json("Requested collection doesn't exist.");
        }
    });
});

module.exports = router;
