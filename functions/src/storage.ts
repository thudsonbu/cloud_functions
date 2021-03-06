import * as functions from 'firebase-functions';
// admin db
import * as admin from 'firebase-admin';
// Google cloud storage is the storage bucket that is provided by firebase for large data objects
import { Storage } from '@google-cloud/storage';
const gcs = new Storage();

// promise based library that increases functionality of basic node.js file system
import * as fs from 'fs-extra'; 
// promise based library for editing and resizing images
import * as sharp from 'sharp';

// When a user uploads an image to the storage bucket we will resize it to be
// 100 pixels by 100 pixels

import { tmpdir } from 'os';
import { join, dirname } from 'path';

// add the function to storage so that it executes when something is saved
export const resizeAvatar = functions.storage
  .object()
  .onFinalize( async object => { // on finalize is run when something is saved to the storage bucket
    const bucket = gcs.bucket(object.bucket); // create ref to storage bucket to download from 
    
    const filePath = object.name ? object.name : ''; // location where file is stored in bucket
    const fileName = filePath.split('/').pop(); // get file name by spliting on /

    const path = object.name ? object.name : '';
    const tmpFilePath = join( tmpdir(), path ); // create file path ( using tmp dir on host machine )

    const avatarFileName = 'avatar_' + fileName;
    const tmpAvatarPath = join(tmpdir(), avatarFileName);

    // make sure that we dont get caught in an infinite loop as onFinalize is
    // called every time something is saved
    if (fileName?.includes('avatar_')) {
      console.log('exiting functions'); // exit if already created avatar
      return false;
    }

    // download the image from firestore storage bucket
    await bucket.file(filePath).download({
      destination: tmpFilePath
    });

    // use sharp library to resize the file
    await sharp(tmpFilePath)
      .resize(100, 100)
      .toFile(tmpAvatarPath);

    // return a promise to upload the resized file
    return bucket.upload( tmpAvatarPath, {
      destination: join( dirname(filePath), avatarFileName)
    });
  })