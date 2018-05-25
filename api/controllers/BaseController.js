'use strict';

const path = require('path');

exports.getDescription = async function(req, res) {
    try {
        let projectRootDirectory = __dirname.split(path.sep);
        projectRootDirectory = projectRootDirectory
                                    .slice(0, projectRootDirectory.length - 2)
                                    .join(path.sep);
        res.sendFile(path.join(projectRootDirectory, '/api/static_content/base_description.html'));
    } catch (error) {
        console.log(error);
        res.status(500).send('Unknown error');
    }
};
