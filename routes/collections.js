const express = require('express');
const router = express.Router({ mergeParams: true });
const PhotoCollection = require('../models/photocollection');
const VideoCollection = require('../models/videocollection');

// ======================
// FILES COLLECTIONS ROUTES
// ======================

// INDEX
router.get('/', (req, res) => {
    const { typeOfFile } = req.params;

    const Collection =
        typeOfFile === 'photos'
            ? PhotoCollection
            : typeOfFile === 'videos'
            ? VideoCollection
            : null;

    Collection.find({}, (err, collections) => {
        if (err) {
            res.status(400).json(
                `Couldn't fetch  ${typeOfFile}s from the database.`
            );
        } else {
            res.json(collections);
        }
    });
});

// CREATE
router.post('/', (req, res) => {
    const { typeOfFile } = req.params;

    const Collection =
        typeOfFile === 'photos'
            ? PhotoCollection
            : typeOfFile === 'videos'
            ? VideoCollection
            : null;

    const { name, tag } = req.body;
    const newCollection = {
        name,
        tag
    };

    Collection.create(newCollection, err => {
        if (err) {
            res.status(400).json(
                "Coudln't save the  collection in the database."
            );
        } else {
            res.status(200).json('Collection saved in database.');
        }
    });
});

// SHOW
router.get('/:collectionTag', (req, res) => {
    const { typeOfFile, collectionTag } = req.params;

    const Collection =
        typeOfFile === 'photos'
            ? PhotoCollection
            : typeOfFile === 'videos'
            ? VideoCollection
            : null;

    Collection.findOne({ tag: collectionTag }, (err, collection) => {
        if (err) {
            res.status(400).status("Couldn't find the requested collection.");
        } else {
            res.json(collection);
        }
    });
});

// UPDATE
router.put('/:collectionTag', (req, res) => {
    const { typeOfFile, collectionTag } = req.params;

    const Collection =
        typeOfFile === 'photos'
            ? PhotoCollection
            : typeOfFile === 'videos'
            ? VideoCollection
            : null;

    const { name, tag } = req.body;
    const updatedCollection = {
        name,
        tag
    };

    Collection.findOneAndUpdate(
        { tag: collectionTag },
        updatedCollection,
        err => {
            if (err) {
                res.status(400).json(
                    "Coudln't save the collection in the database."
                );
            } else {
                res.status(200).json('Collection saved in database.');
            }
        }
    );
});

// DESTR0Y
router.delete('/:collectionTag', (req, res) => {
    const { typeOfFile, collectionTag } = req.params;

    const Collection =
        typeOfFile === 'photos'
            ? PhotoCollection
            : typeOfFile === 'videos'
            ? VideoCollection
            : null;

    Collection.findOne({ tag: collectionTag }, (err, collection) => {
        if (err) {
            res.status(400).status("Couldn't find the requested collection.");
        } else {
            if (collection[typeOfFile].length) {
                res.status(400).json(
                    "Coudln't remove the collection from the database : collection not empty."
                );
            } else {
                Collection.findOneAndDelete({ tag: collectionTag }, err => {
                    if (err) {
                        res.status(400).json(
                            "Coudln't remove the collection from the database."
                        );
                    } else {
                        res.status(200).json(
                            'Collection removed from database.'
                        );
                    }
                });
            }
        }
    });
});

module.exports = router;
