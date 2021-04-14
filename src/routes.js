"use strict";

const express = require("express");
const router = express.Router();
const utils = require("../config/utilities");
const Artist = require("./schema/Artist");
const Track = require("./schema/Track");
const { 
    deleteArtists, deleteTracks, insertArtists, insertTracks 
} = utils;


router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });

///////////////////////////////
// Your code below this line //
///////////////////////////////

router.route("/artists")
    .get((_req, res) => {
        // implemented for you:
        console.log("GET /artists");
        Artist.find({})
            .then(artists => {
                res.status(200).send(artists);
            })
    })
    .post((req, res) => {
        let myArtist = req.body;
        if(myArtist.name == null || myArtist.genres == null){
            res.status(400).send()
        }
        else{
            Artist.create(myArtist).save(); 
            res.status(201).send(myArtist)

        }
    });

router.route("/artists/:id")
    .get((req, res) => {
        // console.log(`GET /artists/${req.params.id}`);
        // res.status(501).send();
        Artist.findById(req.params.id).then((myArtist)=>{
            res.status(200).send(myArtist);
        }).catch(() => {
            res.status(404).send();
          });
    })
    // const updateArtist = () => {
    //     const id = "6073a9adc21f9ed50ba3044c" // some valid id (the Beatles)
    //     return Artist.findOneAndUpdate(
    //         { _id: id }, 
    //         {
    //             "genres": [ "metal", "rock"]
    //         },
    //         { new: true } // means you want to return the updated artist
    //     )
    // }
    
    .patch((req, res) => {
        // console.log(`PATCH /artists/${req.params.id}`);
        // res.status(501).send();
        let myArtist = {};
        if(req.body.name != null){
            myArtist.name = req.body.name;
        }

        if(req.body.genres != null){
            myArtist.genres = req.body.genres;
        }

        if(req.body.spotify_id != null){
            myArtist.genres = req.body.spotify_id;
        }

        if(req.body.image_url!= null){
            myArtist.image_url = req.body.image_url;
        }

        Artist.findOneAndUpdate({ _id: req.params.id }, myArtist, { new: true })
      .then((data) => {
          res.status(200).send();
      })
      .catch(() => {
          res.status(404).send();
      });
    })
    .delete((req, res) => {
        // console.log(`DELETE /artists/${req.params.id}`);
        // res.status(501).send();
        Artist.findOneAndDelete({_id:req.params.id}).then((myArtist)=>{
            res.status(200).send();
        }).catch(()=>{
            res.status(404).send();
        });
    });

router.route("/artists/:id/tracks")
    .get((req, res) => {
        console.log(`GET /artists/${req.params.id}/tracks`);
        res.status(501).send();
    })

router.route("/tracks")
    .get((_req, res) => {
        console.log("GET /tracks");
        // implemented for you:
        Track.find({})
            .then(tracks => {
                res.status(200).send(tracks);
            })
    })
    .post((req, res) => {
        console.log("POST /doctors");
        res.status(501).send();
    });

router.route("/tracks/:id")
    .get((req, res) => {
        console.log(`GET /tracks/${req.params.id}`);
        res.status(501).send();
    })
    .patch((req, res) => {
        console.log(`PATCH /tracks/${req.params.id}`);
        res.status(501).send();
    })
    .delete((req, res) => {
        console.log(`DELETE /tracks/${req.params.id}`);
        res.status(501).send();
    });

router.route("/search")
    .get((req, res) => {
        console.log(`GET /search`);
        console.log(req.query);

        // validation code:
        if (!req.query.term) {
            res.status(400).send({
                message: `"term" query parameter is required. Valid search string: /search?term=beyonce&type=track`
            });
            return; // don't forget the return to exit early!
        }
        if (!req.query.type || !['artist', 'track'].includes(req.query.type)) {
            res.status(400).send({
                message: `"type" query parameter is required and must either be "artist" or "track". Valid search string: /search?term=beyonce&type=track`
            });
            return; // don't forget the return to exit early!
        }

        /**
         * your code below this comment:
         * if req.query.type === 'artist', query the Artist collection
         * for any artist that matches the search term
         * 
         * if req.query.type === 'track', query the Track collection
         * for any artist that matches the search term 
         * 
         * Use regular expressions (see Lecture 5 for details)
         */

        if(req.query.type == 'artist'){
            Artist.find({name:{$regex:req.query.term,$options:"i"}}).then((myArtist)=>{
                res.status(200).send(myArtist)
            });
        }

        else if(req.query.type == 'track'){
            Track.find({name:{$regex:req.query.term,$options:"i"}}).then((myArtist)=>{
                res.status(200).send(myArtist)
            });
        }else{
            res.status(400).send();
        }

    })











///////////////////////////////
// Your code above this line //
///////////////////////////////
router.route("/reset")
    .get((_req, res) => {
        deleteArtists()
            .then(results => {
                console.log('All artists have been deleted from the database.');
            })
            .then(deleteTracks)
            .then(results => {
                console.log('All tracks have been deleted from the database.');
            })
            .then(insertArtists)
            .then(results => {
                console.log(results.length + ' artists have been inserted into the database.');
            })
            .then(insertTracks)
            .then(results => {
                console.log(results.length + ' tracks have been inserted into the database.');
                res.status(200).send({
                    message: "Data has been reset."
                });
            });
    });
module.exports = router;