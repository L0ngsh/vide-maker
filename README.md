# video-maker
Open-souce project to make automated videos

# Instalation

## Prerequisite
- [node.js](https://nodejs.org/)
- [yarn](https://yarnpkg.com/)
- [melt](https://www.mltframework.org/)
- [imagemagick](https://imagemagick.org/index.php)

## Optional
- [kdenlive](https://kdenlive.org/en/) (Needed to create new video templates)

## Clone
```
git clone https://github.com/L0ngsh/video-maker.git
cd video-maker
yarn install
```

# Credentials Folder

## Algorithmia
Create an account at [Algorithmia](https://algorithmia.com/) and get your apiKey.

File: `algorithmia.json`

```
{
    "apiKey": "apiKey"
}
```

## Watson Natural Language Understanding
Create an account at [IBM Cloud](https://cloud.ibm.com/), search by ``Natural Language Understanding-vd`` click in ```Create``` button and get your creds.

File: `watson-nlu.json`

```
{
    "apikey": "apikey",
    "iam_apikey_description": "iam_apikey_description",
    "iam_apikey_name": "iam_apikey_name",
    "iam_role_crn": "iam_role_crn",
    "iam_serviceid_crn": "iam_serviceid_crn",
    "url": "url"
}
```

## Google Search
Enter the [Google API](https://cloud.google.com/), create a new project, click in ```APIs and Services > Library```, search by ```Custom Search API``` ```> Activate > Credentials > Create Credentials > API Key```.

Enter the [Googel CSE](cse.google.com/cse/all), create a new engine, set ```google.com``` as Sites to search and rename the engine as you wish, click in Control panel, activates ```Image search``` and ```Search the web```, copy search engine ID.

File: `googleSearch.json`

```
{
    "apiKey": "apiKey"
    "searchEngineId": "google engine serach ID"
}
```

## YouTube Upload
Enter the [Google API](https://cloud.google.com/), create a new project, click in ```APIs and Services > Library```, search by ```YouTube Data API v3``` ```> Activate > Credentials > Create Credentials > OAuth Client ID```, configure OAuth page:
- Set as external
- Give a name to your app > Insert a valid email to contact and suport > Save and continue
- Save and continue
- Add users (set the account to upload the video)
- Save and continue
- Back to panel

Now enter the credentials tab and create an ```OAuth Clind ID```:
- Set app as ```Web App```
- Name as you wish
- set Authorized JavaScript sources as ```http://localhost:5000```
- set Authorized redirect URIs as ```http://localhost:5000/oauth2callback```
- Create

Downlad creds file and rename to `OAuth2.json`.
