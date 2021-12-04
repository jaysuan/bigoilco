const { google } = require("googleapis");
const drive = google.drive("v3");
const Busboy = require("busboy");

async function setupAuth() {
    const scopes = [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.appdata"
    ];
    
    const auth = await google.auth.getClient({
        scopes
    });

    google.options({
        auth
    });
}

async function uploadToDrive(file, metadata, uploadDir) {
    console.info(`Uploading ${metadata.name}`);
    const { data } = await drive.files.create({
        media: {
            mimeType: metadata.mimeType,
            body: file
        },
        fields: "id,name,webViewLink",
        requestBody: {
            name: metadata.name,
            parents: [ uploadDir ]
        }
    });
    return data;
}

const multipartMiddleware = (uploadDirId) => async (req, res, next) => {
    const busboy = new Busboy({
        headers: req.headers,
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    });
    const fields = {};
    const uploads = [];
    const errors = [];

    await setupAuth();

    const isFieldNamePresent = fieldName => fieldName && fieldName.length > 0;
    const isFilePresent = (fieldName, fileName) => (fieldName && fieldName.length > 0) && (fileName && fileName.length > 0);

    busboy.on("field", (name, value) => {
        if (isFieldNamePresent(name)) {
            fields[name] = value;
        } else {
            errors.push({
                msg: "Empty field name"
            });
        }
    });

    busboy.on("file", (fieldName, file, fileName, encoding, mimeType) => {
        if (!isFieldNamePresent(fieldName)) {
            errors.push({
                msg: "Empty field name"
            });
        }
        if (isFilePresent(fieldName, fileName)) {
            uploads.push(uploadToDrive(
                file,
                {
                    name: fieldName,
                    mimeType
                },
                uploadDirId
            ));
        } else {
            file.resume();
            errors.push({
                param: fieldName,
                msg: "File not found"
            });
        }
    });

    busboy.on("finish", () => {
        if (errors.length > 0) {
            res.status(400).json({
                errors
            });
        } else {
            Promise.all(uploads)
                .then(driveFiles => {
                    req.files = driveFiles;
                    req.body = fields;
                    driveFiles.forEach(({ name, webViewLink }) => req.body[name] = webViewLink);
                    next();
                })
                .catch(next);
        }
    });

    busboy.end(req.rawBody);
}

module.exports = {
    multipartMiddleware
}
