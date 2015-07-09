Although this project has 100% test coverage, there are many conditions that are not being tested. For example, if we request small dogs using the third-party API, we should make sure we don't get any cats (or non-small dogs).

Also, the validation could be more robust, for example, we could exclude any non-cats and non-dogs. We could also make sure gender is specified, though we would probably want to add an 'unknown' option. As size is relatively important for the third-party API, we would probably want to make sure we have restricted the options to only those that we have documented in the API docs. There is also no duplication protection though that wasn't within the scope of the project.

As there are so many files in this project, I have attempted to simplify the review process by indicating where I have put comments below. Where there's only one file in a path that has comments it can be assumed I picked the most comprehensive example and that the other files would only generally have duplicated comments.

All JS files have comments with the following exceptions:
./endpoints/pets - only create.js has comments
./tools - only plugins.js has comments
./test/plugins/endpoints/pets - only update.js has comments

To spin this up, make sure that Node.JS and npm are installed, run 'npm install', and 'npm start' to start the server or 'npm test' to run the test suite. Before starting the server, make sure that ./dumpandloaddb.sh is executable and run './dumpandloaddb.sh animalshelter-dev' to populate the development database with some starter data.
