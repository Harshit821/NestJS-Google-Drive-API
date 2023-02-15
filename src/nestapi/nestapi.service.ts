import { Injectable } from '@nestjs/common';
import { CreateNestapiDto } from './dto/create-nestapi.dto';
import { UpdateNestapiDto } from './dto/update-nestapi.dto';
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


// var ps=require("prompt-sync");
// const prompt=ps();

//var fs=require("fs");



// let command=prompt("Enter the command  ");
// let cmdarray=command.split(" ");







  




/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
  const drive = google.drive({version: 'v3', auth: authClient});
  const res = await drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  const files = res.data.files;
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }

  console.log('Files:');
  files.map((file) => {
    console.log(`${file.name} (${file.id})`);
  });
  return files;
}
/**
 * Insert new file.
 * @return{obj} file Id
 * */
// const drive = new GoogleDrive({
//   keyFilename: process.env.GOOGLE_DRIVE_KEY_FILE,
// });
async function uploadBasic(authClient,namef) {
  const fs = require('fs');
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  // const auth = new GoogleAuth({
  //   scopes: 'https://www.googleapis.com/auth/drive',
  // });
  const service = google.drive({version: 'v3', auth: authClient});
  const fileMetadata = {
    name: `${namef}`,
  };
  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream('photo.jpg'),
  };
  try {
    const file = await service.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    console.log('File Id:', file.data.id);
    return file.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
/**
 * Downloads a file
 * @param{string} realFileId file ID
 * @return{obj} file status
 * */

/**
 * Search file in drive location
 * @return{obj} data file
 * */
async function searchFile(authClient,namef) {
  // const {GoogleAuth} = require('google-auth-library');
  // const {google} = require('googleapis');

  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  // const auth = new GoogleAuth({
  //   scopes: 'https://www.googleapis.com/auth/drive',
  // });
  const service = google.drive({version: 'v3', auth: authClient});
  const files = [];
  console.log(namef);
  try {
    const res = await service.files.list({
      q: `
      name=\'${namef}\'`,
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive',
    });
    Array.prototype.push.apply(files, res.files);
    let y;
    res.data.files.forEach(function(file) {
      console.log('Found file:', file.name, file.id);
      y = file.id;
    });
    //console.log(y);
    return y;
    //return res.data.files;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}

async function downloadFile(authClient,namef) {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  let fs = require('fs');

  let realFileId=await searchFile(authClient,namef);
  //realFileId="1FiK_4hYP20JYnPE-uXJHGUTGKqzYy6Ka";

  console.log(realFileId);

  const service = google.drive({version: 'v3', auth:authClient});

  let fileId = realFileId;
  try {
    let msg="Download Successful";
    const file = await service.files.get({
      fileId: realFileId ,
      mimeType: 'image/jpeg',
      alt: 'media'
    }, {
      responseType: "arraybuffer"
    },
    function(err, { data }){
      fs.writeFile("photod.jpg", Buffer.from(data), err=>{
          if(err) console.log(err);
          
      }
      );
    });
     
    return msg;
     //console.log(file.status);



  //   return file.status;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}


@Injectable()
export class NestapiService {
  create(createNestapiDto: CreateNestapiDto) {
    return 'This action adds a new nestapi';
  }

  findAll() {
    return authorize().then(listFiles).catch(console.error);
  }
  upLoad(name:string) {
    return authorize().then((value)=>uploadBasic(value,name)).catch(console.error);
  }
  Search(name:string) {
    return authorize().then((value)=>searchFile(value,name)).catch(console.error);
  }
  downLoad(name:string) {
    return authorize().then((value)=>downloadFile(value,name)).catch(console.error);
  }
  

  findOne(id: number) {
    return `This action returns a #${id} nestapi`;
  }

  update(id: number, updateNestapiDto: UpdateNestapiDto) {
    return `This action updates a #${id} nestapi`;
  }

  remove(id: number) {
    return `This action removes a #${id} nestapi`;
  }
}
