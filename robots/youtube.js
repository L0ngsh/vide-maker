const express = require('express');
const google = require('googleapis').google;
const fs = require('fs');

const state = require('./state');
const OAuth2 = google.auth.OAuth2;
const youtube = google.youtube({ version: 'v3' });

async function robot() {
    const content = state.load();

    await autheticateWithOAuth();
    const videoData = await uploadVideo(content);
    await uploadThumbnail(videoData);

    async function autheticateWithOAuth() {
        const webServer = await startWebServer();
        const OAuthClient = await createOAuthClient();
        await requestUserConsent(OAuthClient);
        const authorizationToken = await waitForGoogleCallback(webServer);
        await requestGoogleForAuthentication(OAuthClient, authorizationToken);
        await setGlobalGoogleAuthentication(OAuthClient);
        await stopServer(webServer);
    
        async function startWebServer() {
            return new Promise((resolve, reject) => {
                const port = 5000;
                const app = express();

                const server = app.listen(port, () => {
                    console.log(`> Listening on http://localhost:${port}`);
                
                    resolve({
                        app,
                        server
                    });
                });
            });
        }
    
        async function createOAuthClient() {
            const credentials = require('../credentials/oauth2.json');
        
            const OAuthClient = new OAuth2(
                credentials.web.client_id,
                credentials.web.client_secret,
                credentials.web.redirect_uris[0]
            );

            return OAuthClient;
        }
    
        async function requestUserConsent(OAuthClient) {
            const consentUrl = OAuthClient.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/youtube']
            });
        
            console.log(`> Plese give your consent: ${consentUrl}`);
        }

        async function waitForGoogleCallback(webServer) {
            return new Promise((resolve, reject) => {
                console.log('> Waiting for user consent...');

                webServer.app.get('/oauth2callback', (req, res) => {
                    const authCode = req.query.code;

                    console.log(`> Consent given: ${authCode}`);

                    res.send('<h1>Thank You!</h1><p>Now close this tab</p>');
                    resolve(authCode);
                });
            });
        }

        async function requestGoogleForAuthentication(OAuthClient, authorizationToken) {
            return new Promise((resolve, reject) => {
                OAuthClient.getToken(authorizationToken, (error, tokens) => {
                    if (error) {
                        return reject(error);
                    }

                    console.log('> Access tokens received');
                    
                    OAuthClient.setCredentials(tokens);
                    resolve();
                });
            });
        }

        async function setGlobalGoogleAuthentication(OAuthClient) {
            google.options({
                auth: OAuthClient
            });
        }

        async function stopServer(webServer) {
            return new Promise((resolve, reject) => {
                webServer.server.close(() => {
                    resolve();
                });
            });
        }
    }

    async function uploadVideo(content) {
        const videoPath = './content/video.mp4';
        const videoFileSize = fs.statSync(videoPath).size;
        const videoTitle = `${content.prefix} ${content.searchTerm}`;
        
        const videoTags = [content.searchTerm];
        for (sentence in  content.sentences) {
            for (keyword in content.sentences[sentence].keywords) {
                let key = content.sentences[sentence].keywords[keyword];
                
                if (!videoTags.includes(key) && sentence < 3) {
                    videoTags.push(key);
                }
            }
        }
        
        const videoDescriptionMusic = `Music:\n${content.videoData.musicLink}`;
        const videoDescriptionSentences = content.sentences.map((sentence) => {
            return sentence.text;
        }).join('\n\n');
        const videoDescription = `${videoDescriptionSentences}\n\n${videoDescriptionMusic}`;

        const requestParameters = {
            part: 'snippet, status',
            requestBody: {
                snippet: {
                    title: videoTitle,
                    description: videoDescription,
                    tags: videoTags,
                },
                status: {
                    privacyStatus: 'unlisted'
                },
            },
            media: {
                body: fs.createReadStream(videoPath)
            }
        }

        const youtuberesponse = await youtube.videos.insert(requestParameters, {
            onUploadProgress: onUploadProgress
        });

        console.log(`> Vídeo avaliable at: https://youtu.be/${youtuberesponse.data.id}`);
        return youtuberesponse;
    
        function onUploadProgress(event) {
            const progress = Math.round((event.bytesRead / videoFileSize) * 100);
            console.log(`> ${progress}% Completed`);
        }
    }

    async function uploadThumbnail(videoData) {
        const videoId = videoData.data.id;
        const videoThumbnailFielPAth = './content/thumbnail.jpg';
    
        const requestParameters = {
            videoId: videoId,
            media: {
                mimetype: 'image/jpeg',
                body: fs.createReadStream(videoThumbnailFielPAth)
            }
        }
    
        const youtubeResponse = await youtube.thumbnails.set(requestParameters);

        console.log(`> Thumbnail uploaded.`);

    }

}

module.exports = robot;